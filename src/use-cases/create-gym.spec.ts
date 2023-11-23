import { expect, describe, it, beforeEach}  from 'vitest'
import { GymsRepository } from '@/repositories/gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: GymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case',  () => {
    beforeEach(() => {
        gymsRepository  = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })
    
    it('should be able create a gym', async () => {
        const {gym} = await sut.execute({
            title: 'Gym 01',
            description: '',
            phone: '',
            latitude: -15.7680872,
            longitude: -47.8723759,
        })

        expect(gym.id).toEqual(expect.any(String))
    })    
})