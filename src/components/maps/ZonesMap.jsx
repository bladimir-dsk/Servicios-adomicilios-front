import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { DEFAULT_CENTER, toPath } from "@/lib/geo";

export default function ZonesMap({ areas, selectedId }) {
  const { isLoaded, error } = useGoogleMaps();
  const ref = useRef(null);
  const mapRef = useRef(null);
  const infoRef = useRef(null);
  const overlays = useRef([]);

  // Crear el mapa
  useEffect(() => {
    if (!isLoaded || mapRef.current) return;
    mapRef.current = new window.google.maps.Map(ref.current, {
      center: DEFAULT_CENTER,
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
      clickableIcons: false,
    });
    infoRef.current = new window.google.maps.InfoWindow();
  }, [isLoaded]);

  // Dibujar zonas
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const g = window.google.maps;
    const map = mapRef.current;

    overlays.current.forEach((o) => o.setMap(null));
    overlays.current = [];
    const bounds = new g.LatLngBounds();
    let hasPoints = false;

    areas.forEach((area) => {
      const path = toPath(area.coveragePoints);
      if (!path.length) return;
      path.forEach((p) => {
        bounds.extend(p);
        hasPoints = true;
      });

      const color = area.color || "#4f46e5";
      let shape;
      if (path.length >= 3) {
        shape = new g.Polygon({
          paths: path,
          map,
          strokeColor: color,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.3,
        });
      } else if (path.length === 2) {
        shape = new g.Polyline({
          path,
          map,
          strokeColor: color,
          strokeWeight: 3,
        });
      } else {
        shape = new g.Marker({ position: path[0], map, title: area.name });
      }

      shape.addListener("click", (e) => {
        infoRef.current.setContent(`<strong>${area.name}</strong>`);
        infoRef.current.setPosition(e.latLng ?? path[0]);
        infoRef.current.open(map);
      });
      shape.__areaId = area.id_coverage_area;
      overlays.current.push(shape);
    });

    if (hasPoints) {
      map.fitBounds(bounds, 48);
      g.event.addListenerOnce(map, "idle", () => {
        if (map.getZoom() > 16) map.setZoom(15);
      });
    }
  }, [isLoaded, areas]);

  // Enfocar una zona al seleccionarla en la lista
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !selectedId) return;
    const area = areas.find((a) => a.id_coverage_area === selectedId);
    const path = toPath(area?.coveragePoints);
    if (!path.length) return;
    const g = window.google.maps;
    const bounds = new g.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    mapRef.current.fitBounds(bounds, 64);
    g.event.addListenerOnce(mapRef.current, "idle", () => {
      if (mapRef.current.getZoom() > 16) mapRef.current.setZoom(15);
    });
  }, [selectedId, areas, isLoaded]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }
  return <div ref={ref} className="h-full w-full" />;
}
