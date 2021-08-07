import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { ViewUserDto } from './dtos/view-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Serialize(ViewUserDto)
@Controller('auth')
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ){}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {        
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }

    @UseGuards(AuthGuard)
    @Get('whoami')
    async whoAmI(@CurrentUser() user: User) {
        return user
    } 

    @Get('signout')
    signout(@Session() session: any) {
        session.userId = null
    }

    @Get('/:id')
    async getById(@Param('id') id: number) {        
        const user = await this.userService.findOne(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    @Get()
    getByEmail(@Query('email') email: string) {
        return this.userService.find(email)
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.userService.remove(id)
    }

    @Patch('/:id')
    async update(@Param('id') id: number, @Body() body: UpdateUserDto) {
        return await this.userService.update(id, body)
    }

}
