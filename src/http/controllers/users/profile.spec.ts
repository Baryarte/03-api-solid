import { app } from '@/app'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get a users profile', async () => {
        const {token} = await createAndAuthenticateUser(app)

        const profileResponse = await request(app.server)
            .get('/me')
            .set({
                Authorization: `Bearer ${token}`,
            })
            .send()
        expect(profileResponse.statusCode).toBe(200)
        expect(profileResponse.body.user).toEqual(
            expect.objectContaining({
                name: 'John Doe',
                email: 'johndoe@example.com',
            })
        )
    })
})
