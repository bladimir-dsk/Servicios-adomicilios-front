import { useState, useEffect } from "react";
import { MapPin, Phone, User, Save } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import {
  createCustomerProfile,
  getCustomerProfile,
  updateCustomerProfile,
} from "@/apis/auth.api";
import { getErrorMessage } from "@/apis/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultCenter = {
  lat: 20.204884,
  lng: -89.281869,
};

function MapClickHandler({ onClick }) {
  const map = useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function Perfil() {
  const [form, setForm] = useState({
    firstName: "",
    secondName: "",
    code: "52",
    phone: "",
    street: "",
    city: "",
    intersectionOne: "",
    intersectionTwo: "",
    houseNumber: "",
    reference: "",
    latitude: "",
    longitude: "",
  });
  const [existingProfile, setExistingProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mapCenter, setMapCenter] = useState([
    defaultCenter.lat,
    defaultCenter.lng,
  ]);
  const [markerPosition, setMarkerPosition] = useState([
    defaultCenter.lat,
    defaultCenter.lng,
  ]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCustomerProfile();
      if (data.customerInformations && data.customerInformations.length > 0) {
        const profile = data.customerInformations[0];
        setExistingProfile(profile);
        const lat = parseFloat(profile.latitude) || defaultCenter.lat;
        const lng = parseFloat(profile.longitude) || defaultCenter.lng;
        setForm({
          firstName: profile.firstName || "",
          secondName: profile.secondName || "",
          code: profile.code || "52",
          phone: profile.phone || "",
          street: profile.street || "",
          city: profile.city || "",
          intersectionOne: profile.intersectionOne || "",
          intersectionTwo: profile.intersectionTwo || "",
          houseNumber: profile.houseNumber || "",
          reference: profile.reference || "",
          latitude: profile.latitude || "",
          longitude: profile.longitude || "",
        });
        setMapCenter([lat, lng]);
        setMarkerPosition([lat, lng]);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(getErrorMessage(err, "Error al cargar el perfil"));
      }
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      if (existingProfile) {
        await updateCustomerProfile(
          existingProfile.id_customerInformation,
          form,
        );
        setSuccess("Perfil actualizado correctamente");
      } else {
        await createCustomerProfile(form);
        setSuccess("Perfil creado correctamente");
        await loadProfile();
      }
    } catch (err) {
      setError(getErrorMessage(err, "Error al guardar el perfil"));
    } finally {
      setSaving(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setForm((f) => ({
            ...f,
            latitude: lat.toString(),
            longitude: lng.toString(),
          }));
          setMapCenter([lat, lng]);
          setMarkerPosition([lat, lng]);
        },
        (err) => {
          setError("No se pudo obtener la ubicación");
        },
      );
    } else {
      setError("Geolocalización no soportada en este navegador");
    }
  };

  const onMapClick = (latlng) => {
    const lat = latlng.lat;
    const lng = latlng.lng;
    setForm((f) => ({
      ...f,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
    setMarkerPosition([lat, lng]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y dirección
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>Tus datos de contacto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Juan"
                  required
                  value={form.firstName}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondName">Apellido *</Label>
                <Input
                  id="secondName"
                  name="secondName"
                  placeholder="Pérez"
                  required
                  value={form.secondName}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="code">Código país</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="52"
                  value={form.code}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="9991429513"
                  required
                  value={form.phone}
                  onChange={onChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Dirección de Entrega
            </CardTitle>
            <CardDescription>
              La dirección donde recibirás tus pedidos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="street">Calle *</Label>
                <Input
                  id="street"
                  name="street"
                  placeholder="Calle 45"
                  required
                  value={form.street}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Tekax"
                  required
                  value={form.city}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="houseNumber">Número *</Label>
                <Input
                  id="houseNumber"
                  name="houseNumber"
                  placeholder="123"
                  required
                  value={form.houseNumber}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intersectionOne">Intersección 1</Label>
                <Input
                  id="intersectionOne"
                  name="intersectionOne"
                  placeholder="Calle 60"
                  value={form.intersectionOne}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intersectionTwo">Intersección 2</Label>
                <Input
                  id="intersectionTwo"
                  name="intersectionTwo"
                  placeholder="Calle 62"
                  value={form.intersectionTwo}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Referencia</Label>
              <Input
                id="reference"
                name="reference"
                placeholder="Casa de piedra, portón azul, etc."
                value={form.reference}
                onChange={onChange}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Ubicación GPS</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Obtener mi ubicación
                </Button>
              </div>

              <div className="h-[300px] w-full rounded-lg overflow-hidden border">
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={markerPosition} />
                  <MapClickHandler onClick={onMapClick} />
                </MapContainer>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitud</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    placeholder="20.204884"
                    value={form.latitude}
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitud</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    placeholder="-89.281869"
                    value={form.longitude}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {existingProfile ? "Actualizar Perfil" : "Crear Perfil"}
          </Button>
        </div>
      </form>
    </div>
  );
}
