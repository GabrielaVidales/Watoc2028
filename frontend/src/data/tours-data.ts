export type Tour = {
    id: number
    description: string
    name: string
    price: number | string
    image?: string
}

export const toursData: Tour[] = [
    {
        id: 1,
        name: 'Uxmal',
        description: '',
        price: 1500.00
    },
    {
        id: 2,
        name: 'Chichén Itzá',
        description: '',
        price: 1500.00
    },
]