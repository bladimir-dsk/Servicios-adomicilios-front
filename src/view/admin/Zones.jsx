import { useState } from "react";
import { Plus, MapPin, Pencil } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ZonesMap from "@/components/maps/ZonesMap";
import ZoneModal from "@/components/zones/ZoneModal";
import { useCoverageAreas } from "@/hooks/useCoverageAreas";

export default function Zones() {
  const { areas, loading, error, reload } = useCoverageAreas();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = crear, objeto = editar
  const [selectedId, setSelectedId] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (area) => {
    setEditing(area);
    setModalOpen(true);
  };

  return (
    <>
      <PageHeader>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Nueva zona
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="h-[55vh] lg:h-[70vh]">
            <ZonesMap areas={areas} selectedId={selectedId} />
          </div>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 font-semibold">Zonas ({areas.length})</h3>
            {loading && (
              <p className="text-sm text-muted-foreground">Cargando…</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!loading && !error && areas.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aún no hay zonas. Crea la primera.
              </p>
            )}
            <ul className="space-y-1">
              {areas.map((a) => (
                <li
                  key={a.id_coverage_area}
                  className={`flex items-center gap-1 rounded-lg transition-colors hover:bg-secondary ${
                    selectedId === a.id_coverage_area ? "bg-accent" : ""
                  }`}
                >
                  <button
                    onClick={() => setSelectedId(a.id_coverage_area)}
                    className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left text-sm"
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border"
                      style={{ backgroundColor: a.color }}
                    />
                    <span className="flex-1 truncate font-medium">
                      {a.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />{" "}
                      {a.coveragePoints?.length ?? 0}
                    </span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => openEdit(a)}
                    aria-label={`Editar ${a.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <ZoneModal
        open={modalOpen}
        area={editing}
        existingAreas={areas}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          reload();
        }}
      />
    </>
  );
}
