import { expect, describe, it, beforeEach}  from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: AuthenticateUseCase // system under test

describe('Authenticate Use Case',  () => {
    beforeEach(() => {
        usersRepository  = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
        const password = '123456'
        const password_hash = await hash(password, 6)

        await usersRepository.create({
            name: 'John Doe',
            email: 'johnnew@email.com',
            password_hash
        })
        
        const {user} = await sut.execute({
            email: 'johnnew@email.com',
            password
        })

        

        expect(user.id).toEqual(expect.any(String))
    })


    it('should not be able to authenticate with wrong email', async () => {
        
        const password = '123456'
        
    
        await expect(() => (
            sut.execute({
                email: 'wrongemail@email.com',
                password
            })
        )).rejects.toBeInstanceOf(InvalidCredentialsError)
        
    })


    it('should not be able to authenticate with wrong password', async () => {        
        const password = '123456'
        const password_hash = await hash(password, 6)

        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password_hash
        })
        
    
        await expect(() => (
            sut.execute({
                email: 'johndoe@email.com',
                password: 'wrongpassword'
            })
        )).rejects.toBeInstanceOf(InvalidCredentialsError)
        
    })
    
    
})