import { useEffect, useState, useRef } from "react";

export function useScrollSpy(targetIds: string[], options?: IntersectionObserverInit) {
    const [activeId, setActiveId] = useState<string>("");

    // Guardamos un contador para saber cuál elemento está más arriba si se ven varios a la vez
    const headingElementsRef = useRef<{ [key: string]: IntersectionObserverEntry }>({});

    useEffect(() => {
        const callback = (entries: IntersectionObserverEntry[]) => {
            // Actualizamos el registro de elementos visibles
            entries.forEach((entry) => {
                headingElementsRef.current[entry.target.id] = entry;
            });

            // Filtramos solo los que están cruzando el umbral (visibles)
            const visibleEntries = Object.values(headingElementsRef.current).filter(
                (entry) => entry.isIntersecting
            );

            // Si hay elementos visibles, nos quedamos con el que esté más cerca de la parte superior
            if (visibleEntries.length > 0) {
                const sortedVisibleEntries = visibleEntries.sort(
                    (a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top
                );

                setActiveId(sortedVisibleEntries[0].target.id);
            }
        };

        // 'rootMargin' es clave: controla la línea imaginaria donde se dispara el cambio.
        // "-20% 0px -60% 0px" significa que detectará cuando esté en el tercio superior de la pantalla.
        const observer = new IntersectionObserver(callback, options ?? {
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0.1,
        });

        // Registrar los elementos por ID
        targetIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [targetIds, options]);

    return activeId;
}