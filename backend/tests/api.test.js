process.env.NODE_ENV = 'test';
import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../server.js';
import http from 'http';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('Health Check API returns healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
});

test('Public Universities API returns seeded universities', async () => {
  const res = await fetch(`${baseUrl}/api/universities?lang=ar`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length >= 4);
});

test('Public Programs API returns seeded academic programs', async () => {
  const res = await fetch(`${baseUrl}/api/programs?lang=ar`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length >= 4);
});

test('Admin Auth Login with valid credentials returns JWT token', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@soraedu-tr.com',
      password: 'Admin@2026!',
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.token);
  assert.equal(data.user.role, 'SUPER_ADMIN');

  // Test accessing protected dashboard metrics with token
  const metricsRes = await fetch(`${baseUrl}/api/admin/dashboard/metrics`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  assert.equal(metricsRes.status, 200);
  const metricsData = await metricsRes.json();
  assert.equal(metricsData.success, true);
  assert.ok(metricsData.data.applications.total >= 4);
});

test('Student Application Submission returns success with application number', async () => {
  const res = await fetch(`${baseUrl}/api/applications/public-submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test International Scholar',
      email: 'scholar.test@example.com',
      phone: '+90 555 123 4567',
      nationality: 'Jordan',
      degreeLevel: 'BACHELOR',
      desiredProgram: 'Computer Engineering',
      preferredUniversity: 'Bahçeşehir University',
      studyLanguage: 'ENGLISH',
      consentPrivacy: true,
    }),
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.applicationNumber.startsWith('SORA-'));
});
