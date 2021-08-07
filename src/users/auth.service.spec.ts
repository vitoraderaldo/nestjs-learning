import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService', () => {

    let authService: AuthService
    let userServiceMock: Partial<UsersService>

    const email = 'vitor@gmail.com'
    const password = '21321321'

    beforeEach(async () => {
        
        userServiceMock = {
            find: (email: string) => Promise.resolve(null),
            create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User)
        }

        const authModuleMock = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: userServiceMock
                }
            ]
        }).compile();

        authService = authModuleMock.get(AuthService)
    })

    it ('Must create an instance of auth service', async () => {        
        expect(authService).toBeDefined()    
    })

    it('Must create a new user with salted and hashed passoword', async () => {
        const user = await authService.signup(email, password)                
        const [salt, hash] = user.password.split('.')

        expect(user.password).not.toEqual(password)
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('Must not create a user with an email that is already in use', async () => {
        userServiceMock.find = (email: string) => Promise.resolve({id: 1, email, password} as User)
        try {            
            await authService.signup(email, password)                
        } catch (err) {            
            expect(err).toBeInstanceOf(BadRequestException)
            expect(err.message).toBe('Email already in use')            
        }        
    })

    it('Must sign in when user and password is correct', async () => {
        const savedUser = await authService.signup(email, password)       
        userServiceMock.find = (email: string) => Promise.resolve(savedUser)
        const user = await authService.signin(email, password)
        expect(user).toBeDefined()        
    })
    
    it('Must not sign in with unused email', async () => {
        try {  
            await authService.signin(email, password)
        } catch (err) {            
            expect(err).toBeInstanceOf(BadRequestException)
            expect(err.message).toBe('User not found!')            
        }
    })

    it('Must not sign in with wrong password', async () => {
        userServiceMock.find = () => Promise.resolve({id: 1, email, password: 'salt.hash'} as User)
        try {  
            const user = await authService.signin(email, password)            
        } catch (err) {            
            expect(err).toBeInstanceOf(ForbiddenException)
            expect(err.message).toBe('Wrong email or password') 
        }        
    })

})

