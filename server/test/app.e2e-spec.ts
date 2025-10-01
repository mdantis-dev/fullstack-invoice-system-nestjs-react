import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App E2E', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login → 200 + token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'demo@altametrics.test', password: 'Passw0rd!' })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    token = res.body.accessToken;
  });

  it('GET /invoices (no auth) → 401', async () => {
    await request(app.getHttpServer()).get('/invoices').expect(401);
  });

  it('GET /invoices (auth) → 200 data[]', async () => {
    const res = await request(app.getHttpServer())
      .get('/invoices?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toEqual(
      expect.objectContaining({ page: 1, limit: 5, total: expect.any(Number) }),
    );
  });

  it('GET /invoices/:id (auth) → 200 object', async () => {
    const res = await request(app.getHttpServer())
      .get('/invoices/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining({ id: 1, vendor_name: expect.any(String) }));
  });
});
