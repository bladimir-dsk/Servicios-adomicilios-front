import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { DEFAULT_CENTER, toPath } from "@/lib/geo";

export default function ZonePickerMap({
  points,
  onChange,
  color,
  existingAreas = [],
  initialFit = [],
}) {
  const { isLoaded, error } = useGoogleMaps();
  const ref = useRef(null);
  const mapRef = useRef(null);
  const drawn = useRef([]);
  const background = useRef([]);

  // Crear mapa y escuchar clics
  useEffect(() => {
    if (!isLoaded || mapRef.current) return;
    const g = window.google.maps;
    const map = new g.Map(ref.current, {
      center: DEFAULT_CENTER,
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      draggableCursor: "crosshair",
    });
    map.addListener("click", (e) => {
      onChange((prev) => [
        ...prev,
        { lat: e.latLng.lat(), lng: e.latLng.lng() },
      ]);
    });
    mapRef.current = map;
  }, [isLoaded, onChange]);

  // Zonas existentes de fondo (referencia, no clicables)
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const g = window.google.maps;
    background.current.forEach((o) => o.setMap(null));
    background.current = [];
    const bounds = new g.LatLngBounds();
    let has = false;
    existingAreas.forEach((area) => {
      const path = toPath(area.coveragePoints);
      path.forEach((p) => {
        bounds.extend(p);
        has = true;
      });
      if (path.length >= 3) {
        background.current.push(
          new g.Polygon({
            paths: path,
            map: mapRef.current,
            clickable: false,
            strokeColor: area.color || "#64748b",
            strokeOpacity: 0.6,
            strokeWeight: 1,
            fillColor: area.color || "#64748b",
            fillOpacity: 0.12,
          }),
        );
      }
    });
    // Si estamos editando, el encuadre lo decide initialFit
    if (has && !initialFit.length) mapRef.current.fitBounds(bounds, 48);
  }, [isLoaded, existingAreas, initialFit]);

  // Encuadrar la zona que se está editando
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !initialFit.length) return;
    const g = window.google.maps;
    const bounds = new g.LatLngBounds();
    initialFit.forEach((p) => bounds.extend(p));
    mapRef.current.fitBounds(bounds, 64);
    g.event.addListenerOnce(mapRef.current, "idle", () => {
      if (mapRef.current.getZoom() > 17) mapRef.current.setZoom(16);
    });
  }, [isLoaded, initialFit]);

  // Dibujar los puntos + la forma
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const g = window.google.maps;
    const map = mapRef.current;

    drawn.current.forEach((o) => o.setMap(null));
    drawn.current = [];

    points.forEach((p, i) => {
      const marker = new g.Marker({
        position: p,
        map,
        draggable: true,
        label: String(i + 1),
      });
      marker.addListener("dragend", (e) => {
        const next = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        onChange((prev) => prev.map((pt, idx) => (idx === i ? next : pt)));
      });
      drawn.current.push(marker);
    });

    if (points.length >= 3) {
      drawn.current.push(
        new g.Polygon({
          paths: points,
          map,
          clickable: false,
          strokeColor: color,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.35,
        }),
      );
    } else if (points.length === 2) {
      drawn.current.push(
        new g.Polyline({
          path: points,
          map,
          clickable: false,
          strokeColor: color,
          strokeWeight: 3,
        }),
      );
    }
  }, [isLoaded, points, color, onChange]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }
  return <div ref={ref} className="h-full w-full" />;
}
