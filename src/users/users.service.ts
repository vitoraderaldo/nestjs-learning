import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {    

    constructor(@InjectRepository(User) private repo: Repository<User>) {  
    }

    async create(email: string, password: string) {
        const user = this.repo.create({
            email: email,
            password: password,
            admin: false
        })
        return await this.repo.save(user)
    }

    async findOne(id: number) {
        if (!id) {
            return null
        }
        return await this.repo.findOne(id)
    }

    async find(email: string) {
        return await this.repo.findOne({email: email})
    }

    async update(id: number, newValues: Partial<User>) {
        const user = await this.findOne(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        Object.assign(user, newValues)        
        return await this.repo.save(user)
    }

    async remove(id: number) {
        const user = await this.findOne(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return this.repo.remove(user)
    }

}
