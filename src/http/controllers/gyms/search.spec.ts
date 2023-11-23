import { app } from '@/app'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search for gyms by title', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: 'Academia 1',
                description: 'Academia 1',
                phone: '1111111111',
                latitude: -23.55052,
                longitude: -46.633308,
            })

        await request(app.server).post('/gyms')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: 'Academia 2',
                description: 'Academia 2',
                phone: '1111111111',
                latitude: -23.55052,
                longitude: -46.633308,
            })

        const searchResponse = await request(app.server)
            .get('/gyms/search')
            .query({
                q: 'Academia 1',
            })
            .set({
                Authorization: `Bearer ${token}`,
            })
            .send()

        expect(searchResponse.statusCode).toBe(200)
        expect(searchResponse.body.gyms).toHaveLength(1)
        expect(searchResponse.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Academia 1',
            }),
        ])
    })
})
