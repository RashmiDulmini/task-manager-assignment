import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/configure-app';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('allows requests from the configured frontend origin', () => {
    const origin = process.env.WEB_ORIGIN ?? 'http://localhost:3000';

    return request(app.getHttpServer())
      .options('/')
      .set('Origin', origin)
      .set('Access-Control-Request-Method', 'GET')
      .expect(204)
      .expect('Access-Control-Allow-Origin', origin);
  });

  it('returns 404 for an unknown route', () => {
    return request(app.getHttpServer()).get('/missing').expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
