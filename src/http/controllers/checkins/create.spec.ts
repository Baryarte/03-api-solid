import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-In (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a check-in', async () => {
        const {token} = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
                title: 'Academia 1',
                description: 'Academia 1',
                phone: '1111111111',
                latitude: -23.55052,
                longitude: -46.633308,
            },
        })
        

        const createCheckInResponse = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set({
                Authorization: `Bearer ${token}`,
            })
            .send({
                latitude: -23.55052,
                longitude: -46.633308,
            })

        expect(createCheckInResponse.statusCode).toBe(201)
        
    })
})
