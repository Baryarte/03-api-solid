import { env } from './env/index'
import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import { checkInRoutes } from './http/controllers/checkins/routes'

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    },
})

app.register(fastifyCookie)
app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInRoutes)


app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error', issues: error.format() })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
    // TODO: Send error to Sentry/NewRelic/Datadog
    }

    return reply.status(500).send({ message: 'Internal server error' })
})
