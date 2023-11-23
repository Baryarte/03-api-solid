import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-erro'
import { MaxDistanceError } from './errors/max-distance-error'


let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)
        
        await gymsRepository.create({
            id: 'gym-01',
            title: 'Gym 01',
            description: '',
            phone: '',
            latitude: -15.7680872,
            longitude: -47.8723759,
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -15.7680872,
            userLongitude: -47.8723759,
        })
        
        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022,0, 20, 8, 0 ,0))
        
        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -15.7680872,
            userLongitude: -47.8723759,
        })
        
        await expect(() =>
            sut.execute({
                userId: 'user-01',
                gymId: 'gym-01',
                userLatitude: -15.7680872,
                userLongitude: -47.8723759,
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2022,0, 20, 8, 0 ,0))
        
        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -15.7680872,
            userLongitude: -47.8723759,
        })

        vi.setSystemTime(new Date(2022,0, 21, 8, 0 ,0))

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -15.7680872,
            userLongitude: -47.8723759,
        })

        expect(checkIn.id).toEqual(expect.any(String))
        
    })

    it('should not be able to check in on distant gym', async () => {
        await gymsRepository.create({
            id: 'gym-02',
            title: 'Gym 02',
            description: '',
            phone: '',
            latitude: new Decimal(-15.7328835),
            longitude: new Decimal(-47.8965811),
        })

        await expect(() => sut.execute({
            userId: 'user-01',
            gymId: 'gym-02',
            userLatitude: -15.7680872,
            userLongitude: -47.8723759,
        })).rejects.toBeInstanceOf(MaxDistanceError)
        
        
    })
})
