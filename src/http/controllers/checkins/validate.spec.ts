import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-In Validate (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to validate a check-in', async () => {
        const {token} = await createAndAuthenticateUser(app, true)

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

        let checkIn = await prisma.checkIn.create({
            data: {
                user_id: user.id,
                gym_id: gym.id,
            },
        })
        

        const validateCheckInResponse = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set({
                Authorization: `Bearer ${token}`,
            })
            .send()

        expect(validateCheckInResponse.statusCode).toBe(204)

        checkIn = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkIn.id,
            },
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        
    })
})
