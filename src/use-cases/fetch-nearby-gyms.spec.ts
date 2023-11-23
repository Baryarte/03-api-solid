import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    })

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -15.7328835,
            longitude: -47.8965811,
        })

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -15.8457351,
            longitude: -47.9804534,
        })
        //-15.8457351,-47.9804534

        const { gyms } = await sut.execute({
            userLatitude: -15.7358835,
            userLongitude: -47.8665811,
            
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ])
    })

    
})
