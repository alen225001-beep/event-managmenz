const assert = require('assert');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Item = require('../src/models/Item');
const Claim = require('../src/models/Claim');
const app = require('../src/server');

dotenv.config();

const runTests = async () => {
  console.log('\n=========================================');
  console.log('🧪 RUNNING CAMPUS LOST & FOUND API TEST SUITE');
  console.log('=========================================');

  let server;
  const PORT = 5055;
  const BASE_URL = `http://localhost:${PORT}`;

  try {
    await connectDB();
    server = app.listen(PORT);
    console.log(`[Test Server] Listening on ${BASE_URL}`);

    // Clean test database records
    await User.deleteMany({ email: /test.*@sahrdaya\.ac\.in/ });
    await Item.deleteMany({ title: /\[TEST\]/ });
    await Claim.deleteMany({});

    // Test 1: Health check
    console.log('\n[Test 1] GET /api/health');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(healthRes.status, 200, 'Health endpoint should return 200 OK');
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'healthy');
    console.log('✅ Passed: Health check returns 200 and healthy status');

    // Test 2: Register User
    console.log('\n[Test 2] POST /api/auth/register (Valid user)');
    const regPayload = {
      name: 'Test Student Alen',
      email: 'test.alen@sahrdaya.ac.in',
      password: 'password123',
      department: 'Computer Science',
      studentId: 'test22cs999',
    };
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload),
    });
    assert.strictEqual(regRes.status, 201, 'Register should return 201 Created');
    const regData = await regRes.json();
    assert.ok(regData.token, 'Response must include JWT token');
    assert.strictEqual(regData.user.email, regPayload.email);
    const userToken = regData.token;
    console.log('✅ Passed: User registration returned 201 and valid JWT token');

    // Test 3: Duplicate Registration Conflict Check (409)
    console.log('\n[Test 3] POST /api/auth/register (Duplicate email conflict)');
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload),
    });
    assert.strictEqual(dupRes.status, 409, 'Duplicate user should return 409 Conflict');
    console.log('✅ Passed: Duplicate registration correctly rejected with 409 Conflict');

    // Test 4: User Login (200)
    console.log('\n[Test 4] POST /api/auth/login (Valid credentials)');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regPayload.email,
        password: regPayload.password,
      }),
    });
    assert.strictEqual(loginRes.status, 200, 'Login should return 200 OK');
    const loginData = await loginRes.json();
    assert.ok(loginData.token);
    console.log('✅ Passed: Login successful with 200 OK');

    // Test 5: Invalid Password Login (401)
    console.log('\n[Test 5] POST /api/auth/login (Invalid password)');
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regPayload.email,
        password: 'wrongpassword',
      }),
    });
    assert.strictEqual(badLoginRes.status, 401, 'Bad credentials should return 401 Unauthorized');
    console.log('✅ Passed: Invalid password rejected with 401 Unauthorized');

    // Test 6: Protected Profile Route
    console.log('\n[Test 6] GET /api/auth/profile (Authenticated with Bearer token)');
    const profRes = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(profRes.status, 200, 'Profile fetch should return 200 OK');
    const profData = await profRes.json();
    assert.strictEqual(profData.user.email, regPayload.email);
    console.log('✅ Passed: Authenticated profile retrieved successfully');

    // Test 7: Unauthorized Item Creation without Token (401)
    console.log('\n[Test 7] POST /api/items without token (Security check)');
    const unauthRes = await fetch(`${BASE_URL}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '[TEST] Lost Earphones' }),
    });
    assert.strictEqual(unauthRes.status, 401, 'Unauthenticated request should return 401');
    console.log('✅ Passed: Missing token rejected with 401 Unauthorized');

    // Test 8: Create Lost Item (201)
    console.log('\n[Test 8] POST /api/items (Authenticated report)');
    const itemPayload = {
      title: '[TEST] Sony Wireless Earbuds Case',
      description: 'Black Sony WF-1000XM4 charging case misplaced near Library.',
      type: 'LOST',
      category: 'ELECTRONICS',
      location: 'Central Library 1st Floor',
      distinguishingMarks: 'Small red sticker on top lid',
    };
    const itemRes = await fetch(`${BASE_URL}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(itemPayload),
    });
    assert.strictEqual(itemRes.status, 201, 'Item creation should return 201 Created');
    const createdItemData = await itemRes.json();
    assert.strictEqual(createdItemData.data.title, itemPayload.title);
    const createdItemId = createdItemData.data._id;
    console.log('✅ Passed: Created item successfully with 201 Created');

    // Test 9: Get Items List with Query & Pagination
    console.log('\n[Test 9] GET /api/items?type=LOST&page=1&limit=10');
    const listRes = await fetch(`${BASE_URL}/api/items?type=LOST&page=1&limit=10`);
    assert.strictEqual(listRes.status, 200, 'List should return 200 OK');
    const listData = await listRes.json();
    assert.ok(Array.isArray(listData.data), 'Data should be an array');
    assert.ok(listData.total >= 1, 'Total items should be at least 1');
    console.log(`✅ Passed: Item list returned 200 OK with ${listData.count} items on page ${listData.page}`);

    // Test 10: Get Stats
    console.log('\n[Test 10] GET /api/items/stats');
    const statsRes = await fetch(`${BASE_URL}/api/items/stats`);
    assert.strictEqual(statsRes.status, 200, 'Stats should return 200 OK');
    const statsData = await statsRes.json();
    assert.ok(statsData.stats.totalReports >= 1);
    console.log('✅ Passed: Statistics calculated and returned successfully');

    // Test 11: Update Item by Owner
    console.log('\n[Test 11] PUT /api/items/:id (Owner update)');
    const updateRes = await fetch(`${BASE_URL}/api/items/${createdItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        location: 'Central Library 2nd Floor Reading Room',
      }),
    });
    assert.strictEqual(updateRes.status, 200, 'Update should return 200 OK');
    const updateData = await updateRes.json();
    assert.strictEqual(updateData.data.location, 'Central Library 2nd Floor Reading Room');
    console.log('✅ Passed: Item successfully updated by owner');

    // Test 12: Admin Route Protection (Non-admin user forbidden)
    console.log('\n[Test 12] GET /api/admin/overview (Role check for standard student)');
    const adminRes = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(adminRes.status, 403, 'Non-admin should return 403 Forbidden');
    console.log('✅ Passed: Student user correctly forbidden (403) from accessing admin overview');

    // Cleanup test data
    await User.deleteMany({ email: /test.*@sahrdaya\.ac\.in/ });
    await Item.deleteMany({ title: /\[TEST\]/ });

    console.log('\n=========================================');
    console.log('🎉 ALL 12 API INTEGRATION TESTS PASSED!');
    console.log('=========================================\n');

    server.close();
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST FAILURE:', err);
    if (server) server.close();
    await disconnectDB();
    process.exit(1);
  }
};

runTests();
