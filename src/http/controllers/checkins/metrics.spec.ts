import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-In History (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be to get an users check-in history', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'Academia 1',
                description: 'Academia 1',
                phone: '1111111111',
                latitude: -23.55052,
                longitude: -46.633308,
            },
        })
        
        

        await prisma.checkIn.createMany({
            data: [
                {
                    user_id: user.id,
                    gym_id: gym.id,
                    
                },
                {
                    user_id: user.id,
                    gym_id: gym.id,
                    
                },
            ],
        })
        
        const getMetricsResponse = await request(app.server)
            .get('/check-ins/metrics')
            .set({
                Authorization: `Bearer ${token}`,
            })
            .send()

        console.log(getMetricsResponse.body)

        expect(getMetricsResponse.statusCode).toBe(200)
        expect(getMetricsResponse.body.checkInsCount).toBe(2)
    })
})
