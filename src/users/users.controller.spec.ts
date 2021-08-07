import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { assert } from 'console';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let userServiceMock: Partial<UsersService>
  let authServiceMock: Partial<AuthService>

  const email = 'vitor@gmail.com'
  const password = '21321321'
  const user = {id: 1, email: email, password: password} as User

  beforeEach(async () => {

    userServiceMock = {      
      find: (email: string) => Promise.resolve(user),
      findOne: (id: number) => Promise.resolve(user),
      //update: (id: number, newValues: Partial<User>) => Promise.resolve({} as User),
      //remove: (id: number) => Promise.resolve({email: email, password: password} as User)
    }

    authServiceMock = {
      signin: (email: string, password: string) => Promise.resolve(user),
      //signup: (email: string, password: string) => Promise.resolve(user)
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: userServiceMock
        },
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('Controller must be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Must find user with a given email', async () => {
    const foundUser = await controller.getByEmail(email)
    expect(foundUser).toBeDefined()
  })

  it('Must find user with a given ID', async () => {
    const foundUser = await controller.getById(user.id)
    expect(foundUser).toBeDefined()
  })

  it('Must throw an error when given ID is not found', async () => {
    userServiceMock.findOne = (id: number) => Promise.resolve(null)
    try {
      const foundUser = await controller.getById(user.id)
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException)
      expect(err.message).toBe('User not found')
    }    
  })

  it('Must update session when user signs in in', async () => {
    const body = { email: user.email, password: user.password} as CreateUserDto
    const session = {userId: -1}
    const foundUser = await controller.signin(body, session)
    expect(session.userId).toBe(foundUser.id)
  })

  //async getUser(@Param('id') id: number) {        
  //getByEmail(@Query('email') email: string) {
  //delete(@Param('id') id: number) {
  //async update(@Param('id') id: number, @Body() body: UpdateUserDto) {
});
