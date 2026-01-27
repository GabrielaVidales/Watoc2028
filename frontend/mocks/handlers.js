import { http, HttpResponse } from 'msw'

export const handlers = [
    http.post('/api/v1/contact', async ({ request }) => {
        const { firstName, lastName, email, subject, description } = await request.json()

        if (!firstName || !lastName || !email || !subject || !description) {
            return new HttpResponse(null, { status: 404 })
        }
        return HttpResponse.text('Success', { status: 201 })
    }),

    http.post('/api/v1/login', async ({ request }) => {
        const { email, password } = await request.json()
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (!email || !password) {
            return HttpResponse.json({ error: 'No credentials' }, { status: 400 })
        }

        if (email === 'pendejo@email.com' && password === '1234') {
            return new HttpResponse(
                JSON.stringify(mockUser),
                {
                    status: 200,
                    headers: {
                        'set-cookie': 'session_id=abc-123; Path=/; SameSite=None; Secure; Max-Age=86400;',
                    },
                }
            );
        }
        
        return new HttpResponse(null, { status: 401 });
    }),
    
    http.post('/api/v1/logout', async ({ request }) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return new HttpResponse(null, {
            status: 200,
            headers: {
                'set-cookie': 'session_id=; Path=/; SameSite=None; Secure; Max-Age=86400;',
            },
        });
    }),

    http.get('/api/v1/whoami', async ({ cookies }) => {
        await new Promise(resolve => setTimeout(resolve, 100))

        const { session_id } = cookies

        if (session_id === 'abc-123') {
            return HttpResponse.json({
                id: 1,
                email: 'pendejo@email.com',
                role: 'admin',
                data: userData
            });
        }

        return new HttpResponse(null, { status: 401 });
    }),

    http.post('/api/v1/register', async ({ request }) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return HttpResponse.json(mockUser)
    }),

    http.post('/api/v1/create-checkout-session', async ({ request }) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return HttpResponse.json({
            id: 'pk_alskjd@ajskdhasjdhasjkdh',
        })
    }),
]

const userData = {
    prefix: "Mr.",
    firstName: 'Eduardo',
    lastName: 'Escalante',
    email: 'eduardo.escalante@example.com',
    phone: '+52 55 1234 5678',
    country: 'Mexico',
    city: 'Mexico City',
    affiliation: 'Universidad Nacional Autónoma de México',
    department: 'Computer Science',
    cargo: 'Full Stack Developer',
    emailConfirmed: true
}

const mockUser = {
    id: 1,
    email: 'pendejo@email.com',
    role: 'admin',
    data: userData,
}
