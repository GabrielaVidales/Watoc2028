import { DEBUG } from "./constants"

// Mapear errores
export function mapErrors<T>(errors: { errors: Record<string, string[]> }, onField: (t: keyof T, v: string[]) => void) {
    DEBUG && console.log(errors);

    Object.entries(errors.errors).forEach(([key, value]) => {
        onField(key as keyof T, value)
    })
}