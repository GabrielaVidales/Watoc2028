type RouteTree<T> = {
    [K in keyof T]:
    T[K] extends { build: (...args: any) => any } 
    ? T[K]
    : T[K] extends string
    ? string
    : T[K] extends object
    ? RouteTree<T[K]>
    : never
}


type RouteParams<T extends string> =
    T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | RouteParams<`/${Rest}`> : T extends `${string}:${infer Param}`
    ? Param : never


function createRouteGroup<T extends Record<string, any>>(
    base: string,
    routes: T
): RouteTree<T> {
    const result: any = {}

    for (const key in routes) {
        const value = routes[key]

        if (typeof value === "string") {
            result[key] = `${base}${value}`
        } else if (value && typeof value === "object" && "build" in value) {
            result[key] = {
                ...value,
                url: `${base}${value.url}`,
            }
        } else if (typeof value === "object") {
            result[key] = createRouteGroup(
                base + (value.base ?? ""),
                value.routes ?? value
            )
        }
    }

    return result
}


const withBuilder = <T extends string>(url: T) => ({
    url,
    build(this: { url: string }, params: { [K in RouteParams<T>]: string | number }) {
        let final = this.url

        Object.entries(params).forEach(([k, v]) => {
            final = final.replace(`:${k}`, String(v))
        })

        return final
    },
})


export const urls = {
    home: {
        index: '/',
        watoc: '/watoc',
        youngWatoc: '/young-watoc',
        contact: '/contact',
    },
    auth: createRouteGroup('/auth', {
        login: '/login',
        register: '/register',
        verify: '/verify',
    }),
    users: createRouteGroup('/user', {
        profile: '/profile',
        viewAbstracts: '/my-abstracts',
        editAbstract: withBuilder('/abstract/:id/edit'),
        previewAbstract: withBuilder('/abstract/:id/preview'),
        submitAbstract: '/abstract',
        confirmAssistance: createRouteGroup('/confirm-assistance', {
            start: '',
            fee: '/fee',
            tour: '/tour',
            payment: '/payment',
            dinner: '/dinner',
        }),
    }),
    payments: createRouteGroup('/payments', {
        success: '/success',
        failed: '/failed',
    }),
} as const


