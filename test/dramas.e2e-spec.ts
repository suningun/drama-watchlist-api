import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('DramasController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdId: number;

  const uniqueTitle = `E2E Drama ${Date.now()}`;
  const missingId = 999999;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'password123' });

    expect(res.status).toBe(201);
    token = res.body.access_token;
    expect(token).toBeTruthy();
  });

  afterAll(async () => {
    // Best-effort cleanup so repeated runs do not accumulate data.
    if (createdId && token) {
      await request(app.getHttpServer())
        .delete(`/items/${createdId}`)
        .set('Authorization', `Bearer ${token}`);
    }
    await app.close();
  });

  it('POST /auth/login rejects invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrong-password' })
      .expect(401);
  });

  it('GET /items is public', () => {
    return request(app.getHttpServer()).get('/items').expect(200);
  });

  it('POST /items without a token returns 401', () => {
    return request(app.getHttpServer())
      .post('/items')
      .send({ title: 'Test', genre: 'Romance' })
      .expect(401);
  });

  it('POST /items with an empty required field returns 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', genre: 'Romance' })
      .expect(400);

    expect(res.body.message).toContain('title should not be empty');
  });

  it('POST /items with a token creates a record', async () => {
    const res = await request(app.getHttpServer())
      .post('/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: uniqueTitle, genre: 'Romance' })
      .expect(201);

    expect(res.body).toMatchObject({
      title: uniqueTitle,
      genre: 'Romance',
      watched: false,
    });
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  it('GET /items/:id returns the created record', async () => {
    const res = await request(app.getHttpServer())
      .get(`/items/${createdId}`)
      .expect(200);

    expect(res.body.id).toBe(createdId);
  });

  it('GET /items/:id returns 404 for an unknown record', () => {
    return request(app.getHttpServer()).get(`/items/${missingId}`).expect(404);
  });

  it('GET /items/:id returns 400 for a malformed id', () => {
    return request(app.getHttpServer()).get('/items/not-a-number').expect(400);
  });

  it('PATCH /items/:id without a token returns 401', () => {
    return request(app.getHttpServer())
      .patch(`/items/${createdId}`)
      .send({ watched: true })
      .expect(401);
  });

  it('PATCH /items/:id updates the record', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/items/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ watched: true })
      .expect(200);

    expect(res.body.watched).toBe(true);
    expect(res.body.title).toBe(uniqueTitle);
  });

  it('PATCH /items/:id returns 404 for an unknown record', () => {
    return request(app.getHttpServer())
      .patch(`/items/${missingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ watched: true })
      .expect(404);
  });

  it('DELETE /items/:id without a token returns 401', () => {
    return request(app.getHttpServer())
      .delete(`/items/${createdId}`)
      .expect(401);
  });

  it('DELETE /items/:id deletes the record', async () => {
    await request(app.getHttpServer())
      .delete(`/items/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ deleted: true });
  });

  it('GET /items/:id returns 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/items/${createdId}`)
      .expect(404);
  });
});
