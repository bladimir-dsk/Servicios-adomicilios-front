import { useCallback, useEffect, useState } from "react";
import { getCoverageAreas } from "@/apis/coverage.api";
import { getErrorMessage } from "@/apis/client";

export function useCoverageAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setAreas(await getCoverageAreas());
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar las zonas"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { areas, loading, error, reload };
}
