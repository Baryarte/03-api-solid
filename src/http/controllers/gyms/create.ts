import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string({required_error: 'It needs to be a string' }),
        phone: z.string(),
        latitude: z.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.number().refine((value) => Math.abs(value) <= 180),
    })
    const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

    const createGym = makeCreateGymUseCase()

    await createGym.execute({ title, description, phone, latitude, longitude })

    return reply.status(201).send()
}
