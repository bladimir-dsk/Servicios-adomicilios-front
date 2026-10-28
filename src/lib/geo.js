export const DEFAULT_CENTER = { lat: 20.7, lng: -89.0 }; // Yucatán

// Convierte los puntos de la API (strings) a coordenadas numéricas ordenadas.
// Ignora puntos inválidos (por ejemplo "string").
export function toPath(points = []) {
  return [...points]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({ lat: parseFloat(p.latitude), lng: parseFloat(p.longitude) }))
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
}
