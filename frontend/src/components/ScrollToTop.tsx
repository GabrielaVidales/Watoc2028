import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface ScrollTopProps {
    targetId?: string;
}

export function ScrollToTop({ targetId = "main-container" }: ScrollTopProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Buscamos el contenedor padre usando la ref del div contenedor
        const scrollContainer = containerRef.current?.closest(".overflow-y-auto, .overflow-y-scroll") || window;

        const toggleVisibility = () => {
            const scrollTop = scrollContainer === window
                ? window.scrollY
                : (scrollContainer as HTMLElement).scrollTop;

            if (scrollTop > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        scrollContainer.addEventListener("scroll", toggleVisibility);
        toggleVisibility();

        return () => scrollContainer.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "sticky bottom-0 right-0 float-right z-50 h-fit w-fit pointer-events-none transition-all duration-300 ease-in-out",
                isVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
            )}
        >
            <button
                onClick={() => {
                    const container = document.getElementById(targetId);
                    if (container) {
                        container.scrollTo({ top: 0, behavior: "smooth" });
                    }
                }}
                className={cn(
                    "cursor-pointer flex items-center justify-center w-12 h-12 bg-zinc-900 text-white rounded-full shadow-lg hover:bg-zinc-800 transition-all border border-zinc-700",
                    isVisible ? "pointer-events-auto" : "pointer-events-none"
                )}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.7.275t-.7-.275z" />
                </svg>
            </button>
        </div>
    );
}