
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymUseCase } from '../search-gyms'

export function makeSearchGymUseCase() {
    const gymsRepository = new PrismaGymsRepository()
    return new SearchGymUseCase(gymsRepository)
}
