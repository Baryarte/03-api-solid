
import { ValidateCheckInUseCase } from '../validate-check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export const makeValidateCheckInUseCase = () => {
    const checkInsRepository = new PrismaCheckInsRepository()
    return new ValidateCheckInUseCase(checkInsRepository)
}
