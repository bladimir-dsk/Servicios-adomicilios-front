export function toHex(color, fallback = "#ef4444") {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = color || fallback;
  const value = ctx.fillStyle; // el navegador lo normaliza a #rrggbb
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}
