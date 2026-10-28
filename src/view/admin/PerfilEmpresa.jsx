import { useState, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  User,
} from "lucide-react";
import { getAdminCompanyInfo, updateCompanyInfo } from "@/apis/auth.api";
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

export default function PerfilEmpresa() {
  const [adminInfo, setAdminInfo] = useState(null);
  const [form, setForm] = useState({
    name: "",
    rfc: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminCompanyInfo();
      if (data && data.length > 0) {
        const user = data[0];
        setAdminInfo(user);
        if (user.empresa) {
          setForm({
            name: user.empresa.name || "",
            rfc: user.empresa.rfc || "",
            description: user.empresa.description || "",
            phone: user.empresa.phone || "",
            email: user.empresa.email || "",
            address: user.empresa.address || "",
            city: user.empresa.city || "",
            url: user.empresa.url || "",
          });
        }
      }
    } catch (err) {
      setError(getErrorMessage(err, "Error al cargar la información"));
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
      await updateCompanyInfo(form);
      setSuccess("Información de la empresa actualizada correctamente");
      await loadCompanyInfo();
    } catch (err) {
      setError(getErrorMessage(err, "Error al guardar la información"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Información del Admin (solo lectura) */}
      {adminInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Administrador
            </CardTitle>
            <CardDescription>
              Datos de tu cuenta (no modificables)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={adminInfo.name || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={adminInfo.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Rol</Label>
                <Input
                  value={adminInfo.role || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Estatus</Label>
                <Input
                  value={adminInfo.estatus || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de la Empresa (editable) */}
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Datos de la Empresa
            </CardTitle>
            <CardDescription>Información pública de tu empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la empresa *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Pizzería Ejemplo"
                required
                value={form.name}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rfc">RFC</Label>
              <Input
                id="rfc"
                name="rfc"
                placeholder="XAXX010101000"
                value={form.rfc}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                placeholder="Descripción breve de tu empresa"
                value={form.description}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="9991234567"
                  value={form.phone}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email de contacto
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={form.email}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Calle 123, Colonia Centro"
                  value={form.address}
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Ciudad de México"
                  value={form.city}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Sitio web
              </Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://www.miempresa.com"
                value={form.url}
                onChange={onChange}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
