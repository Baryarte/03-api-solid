
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfile(): GetUserProfileUseCase {
    const userRepository = new PrismaUsersRepository()
    return new GetUserProfileUseCase(userRepository)
}
