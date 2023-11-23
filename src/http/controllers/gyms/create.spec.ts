import { app } from '@/app'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a gym', async () => {
        const {token} = await createAndAuthenticateUser(app, true)

        const createResponse = await request(app.server)
            .post('/gyms')
            .set({
                Authorization: `Bearer ${token}`,
            })
            .send({
                title: 'Academia 1',
                description:'Academia 1',
                phone:'1111111111',
                latitude: -23.550520,
                longitude: -46.633308
            })
        
        expect(createResponse.statusCode).toBe(201)
    })
})
