import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    app.init();
    app.listen('3333');
    prisma = app.get(PrismaService);
    prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  // auth
  describe('Auth', () => {
    // sign up
    describe('Signup', () => {
      it('Should Signup', () => {
        // dto
        const dto: AuthDto = {
          email: 'alemayehudabi606@gmail.com',
          password: '1234',
        };

        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });

    // sign in
    describe('Signin', () => {
      it('Should Signin', () => {
        const dto: AuthDto = {
          email: 'alemayehudabi606@gmail.com',
          password: '1234',
        };

        pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .inspect();
      });
    });
  });

  // user

  // book
});
