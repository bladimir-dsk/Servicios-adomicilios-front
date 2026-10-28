import { useEffect, useState } from "react";

let loaderPromise = null;

function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps);

  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key)
    return Promise.reject(
      new Error("Falta VITE_GOOGLE_MAPS_API_KEY en el archivo .env"),
    );

  if (!loaderPromise) {
    loaderPromise = new Promise((resolve, reject) => {
      window.__gmapsReady = () => resolve(window.google.maps);
      window.gm_authFailure = () =>
        reject(new Error("Google Maps rechazó la API key"));
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=__gmapsReady&v=weekly`;
      script.async = true;
      script.onerror = () => {
        loaderPromise = null;
        reject(new Error("No se pudo cargar Google Maps"));
      };
      document.head.appendChild(script);
    });
  }
  return loaderPromise;
}

export function useGoogleMaps() {
  const [state, setState] = useState({
    isLoaded: !!window.google?.maps,
    error: "",
  });

  useEffect(() => {
    if (state.isLoaded) return;
    loadGoogleMaps()
      .then(() => setState({ isLoaded: true, error: "" }))
      .catch((err) => setState({ isLoaded: false, error: err.message }));
  }, [state.isLoaded]);

  return state;
}
