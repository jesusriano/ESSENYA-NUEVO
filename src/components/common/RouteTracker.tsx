import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../../utils/tracking';

/**
 * Registra una vista de página cada vez que cambia la ruta dentro del sitio (navegación sin recargar).
 * La primera carga ya la registra index.html, por eso se omite la primera vez.
 */
export function RouteTracker() {
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    trackEvent('pageview', { label: pathname });
  }, [pathname]);

  return null;
}
