import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    const httpServer = app.getHttpServer();
    if (!httpServer) {
      throw new Error('HTTP server not available');
    }

    return request
      .default(httpServer)
      .get('/')
      .expect(200)
      .expect('Hello World!')
      .catch((error) => {
        console.error('Test failed:', error);
        throw error;
      });
  });
});
