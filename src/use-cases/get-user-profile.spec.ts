import { expect, describe, it, beforeEach}  from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: UsersRepository
let sut: GetUserProfileUseCase // system under test

describe('Get User Profile Use Case',  () => {
    beforeEach(() => {
        usersRepository  = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it('should be able to get user profile', async () => {
        const password = '123456'
        const password_hash = await hash(password, 6)

        const createdUser = await usersRepository.create({
            name: 'John Doe',
            email: 'johnnew@email.com',
            password_hash
        })
        
        const {user} = await sut.execute({
            userId: createdUser.id
        })

        

        expect(user.name).toEqual(createdUser.name)
    })


    it('should not be able to get user profile with wrong id', async () => {
        
        await expect(() => (
            sut.execute({
                userId: 'non-existent-user-id',
            })
        )).rejects.toBeInstanceOf(ResourceNotFoundError)
        
    })        
})