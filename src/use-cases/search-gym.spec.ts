import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymUseCase(gymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'Javascript Gym',
            description: null,
            phone: null,
            latitude: -15.7328835,
            longitude: -47.8965811,
        })

        await gymsRepository.create({
            title: 'Typescript Gym',
            description: null,
            phone: null,
            latitude: -15.7728835,
            longitude: -47.8965811,
        })

        const { gyms } = await sut.execute({
            query: 'Javascript',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym' }),
        ])
    })

    it('should be able fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Javascript Gym ${i}`,
                description: null,
                phone: null,
                latitude: -15.7328835,
                longitude: -47.8965811,
            })
        }

        const { gyms } = await sut.execute({
            query: 'Javascript',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym 21' }),
            expect.objectContaining({ title: 'Javascript Gym 22' }),
        ])
    })
})
