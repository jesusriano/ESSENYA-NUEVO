import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackGa, trackMeta } from '../../utils/tracking';

/**
 * Registra una vista de página cada vez que cambia la ruta dentro del sitio (navegación sin recargar).
 * La primera carga ya la registra index.html, por eso se omite la primera vez.
 */
export function RouteTracker() {
  const { pathname, search } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const page = `${pathname}${search}`;
    trackMeta('PageView');
    trackGa('page_view', { page_path: page, page_location: window.location.href, page_title: document.title });
  }, [pathname, search]);

  return null;
}
