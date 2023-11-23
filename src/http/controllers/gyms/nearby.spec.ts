import { app } from '@/app'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms')
            .set({
                Authorization: `Bearer ${token}`,
            })
            .send({
                title: 'Near Gym',
                description: 'Near Gym',
                phone: '1111111111',
                latitude: -15.7328835,
                longitude: -47.8965811,
            })
        await request(app.server)
            .post('/gyms')
            .set({
                Authorization: `Bearer ${token}`,
            })
            .send({
                title: 'Far Gym',
                description: 'Far Gym',
                phone: '1111111111',
                latitude: -15.8457351,
                longitude: -47.9804534,
            })
        //-15.8457351,-47.9804534

        const nearbyResponse = await request(app.server)
            .get('/gyms/nearby')
            .set({ Authorization: `Bearer ${token}` })
            .query({ latitude: -15.7328835, longitude: -47.8965811 })
            .send()


        expect(nearbyResponse.statusCode).toBe(200)
        expect(nearbyResponse.body).toEqual(expect.objectContaining({
            gyms: expect.arrayContaining([
                expect.objectContaining({
                    title: 'Near Gym',
                }),
            ]),
        }))
    })
})
