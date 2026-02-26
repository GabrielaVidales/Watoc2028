
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
            url: 'user/:id',
            build: (id: number | string) => `user/${id}`
        },
        submitAbstract: '/user/abstract',
        profile: '/user/profile/',
    }
}