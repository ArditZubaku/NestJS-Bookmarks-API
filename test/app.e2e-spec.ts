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
import { EditUserDto } from '../src/user/dto';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from '../src/bookmark/dto';

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
      it('Should sign in!', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores(
            'user_access_token',
            'access_token',
          );
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:
              'Bearer $S{user_access_token}',
          })
          .expectStatus(HttpStatus.OK);
      });
    });
    describe('Edit user', () => {
      it('Should edit current user', () => {
        const dto: EditUserDto = {
          firstName: 'TestName',
          // lastName: 'TestSurname',
          email: 'test2@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users/edit/1')
          .withBody(dto)
          .withHeaders({
            Authorization:
              'Bearer $S{user_access_token}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.firstName);
      });
    });
  });
  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{user_access_token}`, //$S - Pactum syntax
          })
          .expectStatus(HttpStatus.OK)
          .expectBody([])
          .inspect();
      });
    });

    describe('Create bookmark', () => {
      it('Should create bookmark', () => {
        const dto: CreateBookmarkDto = {
          description: 'Bookmark description',
          link: '/bookmark/link',
          title: 'Bookmark title',
        };
        return pactum
          .spec()
          .post('/bookmarks/new')
          .withHeaders({
            Authorization:
              'Bearer $S{user_access_token}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
          .stores('bookmarkID', 'id');
      });
    });
    describe('Get bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{user_access_token}`,
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1); // Should have at least 1 element
      });
    });
    describe('Get bookmark by ID', () => {
      it('Should get bookmark by ID ', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkID}')
          .withHeaders({
            Authorization:
              'Bearer $S{user_access_token}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkID}');
      });
    });
    describe('Edit bookmark', () => {
      it('Should edit bookmark', () => {
        const dto: EditBookmarkDto = {
          description:
            'Edited bookmark description',
          link: 'Edited /bookmark/link',
          title: 'Edited bookmark title',
        };
        return pactum
          .spec()
          .patch('/bookmarks/edit/{id}')
          .withBody(dto)
          .withPathParams({
            id: '$S{bookmarkID}',
          })
          .withHeaders({
            Authorization:
              'Bearer $S{user_access_token}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });
    describe('Delete bookmark', () => {
      it('Should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams({
            id: '$S{bookmarkID}',
          })
          .withHeaders({
            Authorization:
              'Bearer $S{user_access_token}',
          })
          .expectStatus(HttpStatus.NO_CONTENT)
          .expectBody('');
      });
      it('Should get empty bookmarks', () => {
        return (
          pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization:
                'Bearer $S{user_access_token}',
            })
            .expectStatus(HttpStatus.OK)
            // .expectBody([]);
            .expectJsonLength(0)
        );
      });
    });
  });
  it.todo('Should pass!');
});
