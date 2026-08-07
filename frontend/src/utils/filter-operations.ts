// Estas funciones sirven para convertir filtros en
// un objeto de queryParams que axios puede mandar al
// backend para que Django lo entiende y filtre QuerySets

import type { Filter } from "@/components/reui/filters";

export const DJANGO_OPERATOR_MAP = {
    is: '',                     // Equal / Se deja tal cual =
    is_not: 'ne',               // Not equal / Excluir fecha u opción
    contains: 'icontains',      // Búsqueda parcial (case-insensitive)
    equals: 'exact',            // Coincidencia exacta estricta
    includes: 'in',             // Búsqueda en una lista de opciones
    excludes: 'not_in',         // Excluir elementos de una lista
    startsWith: 'istartswith',  // Inicia con (case-insensitive)
    endsWith: 'iendswith',      // Termina con (case-insensitive)
    greaterThan: 'gt',          // >
    lessThan: 'lt',             // <
    before: 'lt',               // Menor que (fechas)
    after: 'gt',                // Mayor que (fechas)
};


export function filtersToQueryParams(filters: Filter[]) {
    const queryParams = filters.reduce((lastValue, item) => {
        const operator = DJANGO_OPERATOR_MAP[item.operator]
        const fieldKey = `${item.field}${operator && '__'}${operator}`

        lastValue[fieldKey] = item.values.join(',')
        return lastValue
    }, {})
    return queryParams
}