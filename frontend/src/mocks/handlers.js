import { http, HttpResponse } from 'msw'

export const handlers = [
    http.post('/api/v1/contact', async ({ request }) => {
        const { firstName, lastName, email, subject, description } = await request.json()

        if (!firstName || !lastName || !email || !subject || !description) {
            return new HttpResponse(null, { status: 404 })
        }
        return HttpResponse.text('Success', { status: 201 })
    }),
]