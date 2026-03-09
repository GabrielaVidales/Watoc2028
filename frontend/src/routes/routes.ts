export const urls = {
    home: {
        index: '/'
    },
    auth: {
        login: '/login',
        register: '/register',
        logout: '/logout',
    },
    users: {
        root: {
            url: '/user/:id',
            build: (id: number | string) => `/user/${id}`
        },
        viewAbstracts: '/user/my-abstracts',
        editAbstract: {
            url: '/user/abstract/:id/edit',
            build: (id: number | string) => `/user/abstract/${id}/edit`
        },
        previewAbstract: {
            url: '/user/abstract/:id/preview',
            build: (id: number | string) => `/user/abstract/${id}/preview`
        },

        submitAbstract: '/user/abstract',
        profile: '/user/profile',
    }
}