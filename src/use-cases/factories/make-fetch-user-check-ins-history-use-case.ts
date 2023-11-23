import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInUseCaseUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository()
    const createGymUseCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

    return createGymUseCase
}