import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Body } from '@nestjs/common';

describe('Authentication System', () => {
  let app: INestApplication;

  const userEmail = 'vitor6@cv.com'
  const userPassword = 'test123'

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Sign up', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: userEmail, password: userPassword})
      .expect(201)
      .then( (res) => {
          const {id, email} = res.body
          expect(id).toBeDefined()
          expect(email).toEqual(userEmail)
      })      
  });

  it('Must return logged user data', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: userEmail, password: userPassword})
      .expect(201)
    
    const cookie = response.get('Set-Cookie')
    
    const {body} = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)

      expect(body.id).toBeDefined()
      expect(body.email).toEqual(userEmail)

  });

 

});
