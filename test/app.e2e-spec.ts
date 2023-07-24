import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile(); // Just module

    // Emulates the whole app
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();

    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '123',
    };
    describe('SignUp', () => {
      it('Should throw exception if email empty!', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto.password)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should throw exception if password empty!', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto.email)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should throw exception if no DTO (data)!', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(!dto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should sign up!', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
        // .inspect();
      });
    });
    describe('SignIn', () => {
      it('Should throw exception if email empty!', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto.password)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should throw exception if password empty!', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto.email)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should throw exception if no DTO (data)!', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(!dto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should sign up!', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(HttpStatus.OK);
        // .inspect();
      });
    });
  });

  it.todo('Should pass!');
});
