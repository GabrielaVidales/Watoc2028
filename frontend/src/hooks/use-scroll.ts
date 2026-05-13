import { useEffect, useState } from "react"

export const useScroll = (threshold: number = 100) => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const action = () => setIsScrolled(window.scrollY > threshold)
        window.addEventListener('scroll', action, { passive: true })
        return () => window.removeEventListener('scroll', action)
    }, [threshold])

    return isScrolled
}