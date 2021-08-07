import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService
    ){}

    async signup(email: string, password: string) {

        // Check duplicate user email
        const user: User = await this.userService.find(email)       
        if (user) {
            throw new BadRequestException('Email already in use')
        }

        //Hashes the user password
        const salt = randomBytes(8).toString('hex')
        const hash = (await scrypt(password, salt, 32)) as Buffer
        const result = `${salt}.${hash.toString('hex')}`
        
        // Save the user
        const newUser = await this.userService.create(email, result)
        return newUser
    }

    async signin(email: string, password: string) {
        // Get the user
        const user = await this.userService.find(email)
        if (!user) {
            throw new BadRequestException('User not found!')
        }
        
        const [storedSalt, storedHash] = user.password.split('.')

        const hash = (await scrypt(password, storedSalt, 32)) as Buffer
        if (hash.toString('hex') !== storedHash) {
            throw new ForbiddenException('Wrong email or password')
        }
        return user
    }

   

}