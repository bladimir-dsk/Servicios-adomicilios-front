import { useState } from "react";
import { Undo2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ZonePickerMap from "@/components/maps/ZonePickerMap";
import { createCoverageArea } from "@/apis/coverage.api";
import { getErrorMessage } from "@/apis/client";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
];

export default function CreateZoneModal({
  open,
  onClose,
  onCreated,
  existingAreas,
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [points, setPoints] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setColor(COLORS[0]);
    setPoints([]);
    setError("");
  };
  const close = () => {
    reset();
    onClose();
  };

  const canSave = name.trim() && points.length >= 3 && !saving;

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await createCoverageArea({
        name: name.trim(),
        colorFill: color,
        coveragePoints: points.map((p, i) => ({
          latitude: String(p.lat),
          longitude: String(p.lng),
          order: i + 1,
        })),
      });
      reset();
      onCreated();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo guardar la zona"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Nueva zona"
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={!canSave} loading={saving}>
            Guardar zona
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="zone-name">Nombre</Label>
            <Input
              id="zone-name"
              placeholder="Ej. Tekax"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  className={`h-8 w-8 rounded-full border-2 transition ${color === c ? "scale-110 border-foreground" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                aria-label="Color personalizado"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Puntos de la zona ({points.length})</Label>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!points.length}
                onClick={() => setPoints((p) => p.slice(0, -1))}
              >
                <Undo2 className="h-4 w-4" /> Deshacer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!points.length}
                onClick={() => setPoints([])}
              >
                <Trash2 className="h-4 w-4" /> Limpiar
              </Button>
            </div>
          </div>
          <div className="h-[45vh] min-h-[280px] overflow-hidden rounded-lg border">
            {open && (
              <ZonePickerMap
                points={points}
                onChange={setPoints}
                color={color}
                existingAreas={existingAreas}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Haz clic en el mapa para agregar puntos (mínimo 3). Puedes
            arrastrarlos para ajustarlos.
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
