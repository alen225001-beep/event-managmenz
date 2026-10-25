const assert = require('assert');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Event = require('../src/models/Event');
const Registration = require('../src/models/Registration');
const app = require('../src/server');

const runTests = async () => {
  console.log('\n======================================================');
  console.log('🧪 SAHRDAYA CAMPUS EVENTHUB - API TEST SUITE');
  console.log('Student: Alen (alen225001@sahrdaya.ac.in)');
  console.log('======================================================\n');

  let server;
  const PORT = 5099;
  const BASE_URL = `http://localhost:${PORT}`;

  try {
    await connectDB();
    server = app.listen(PORT);
    console.log(`[Test Server] Running on ${BASE_URL}`);

    // Clean any previous test artifacts
    await User.deleteMany({ email: /test.*@sahrdaya\.ac\.in/ });
    await Event.deleteMany({ title: /\[TEST\]/ });
    await Registration.deleteMany({ studentEmail: /test.*@sahrdaya\.ac\.in/ });

    // Test 1: Health Check Endpoint
    console.log('\n[Test 1] GET /api/health');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(healthRes.status, 200, 'Health endpoint should return 200 OK');
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'healthy');
    assert.strictEqual(healthData.developer, 'Alen (alen225001@sahrdaya.ac.in)');
    console.log('✅ Passed: Health check returns 200 and Alen developer attribution');

    // Test 2: Student Registration
    console.log('\n[Test 2] POST /api/auth/register (New student registration)');
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student Jose',
        email: 'test.jose@sahrdaya.ac.in',
        password: 'password123',
        department: 'Computer Science & Engineering',
        studentId: 'test22cs099',
      }),
    });
    assert.strictEqual(regRes.status, 201, 'Registration should return 201 Created');
    const regData = await regRes.json();
    assert.ok(regData.token, 'Should return JWT token');
    assert.strictEqual(regData.user.email, 'test.jose@sahrdaya.ac.in');
    const studentToken = regData.token;
    console.log('✅ Passed: Student registration issues valid JWT token');

    // Test 3: User Login
    console.log('\n[Test 3] POST /api/auth/login');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.jose@sahrdaya.ac.in',
        password: 'password123',
      }),
    });
    assert.strictEqual(loginRes.status, 200, 'Login should return 200 OK');
    const loginData = await loginRes.json();
    assert.ok(loginData.token, 'Login should return token');
    console.log('✅ Passed: Authentication succeeds with correct password');

    // Test 4: Organizer Registration & Create Free Event
    console.log('\n[Test 4] POST /api/events (Organizer publishes new campus workshop)');
    const orgRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Organizer Alen',
        email: 'test.alen.org@sahrdaya.ac.in',
        password: 'password123',
        role: 'organizer',
        clubName: 'IEEE Sahrdaya SB',
        department: 'Computer Science & Engineering',
      }),
    });
    const orgData = await orgRes.json();
    const organizerToken = orgData.token;

    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 10);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 5);

    const createEventRes = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${organizerToken}`,
      },
      body: JSON.stringify({
        title: '[TEST] Full Stack Web Development Bootcamp',
        description: 'Hands-on training session on MERN Stack and cloud deployment.',
        category: 'Technical Workshop',
        venue: 'Decennial Hall Lab 2',
        date: eventDate,
        time: '10:00 AM - 04:00 PM',
        registrationDeadline: deadline,
        capacity: 50,
        clubName: 'IEEE Sahrdaya SB',
        ticketType: 'free',
        price: 0,
      }),
    });
    assert.strictEqual(createEventRes.status, 201, 'Event creation should return 201');
    const eventData = await createEventRes.json();
    const testEventId = eventData.event._id;
    console.log('✅ Passed: Organizer successfully created event');

    // Test 5: Student Registers for Free Event & Receives Digital Pass
    console.log('\n[Test 5] POST /api/registrations/:eventId (Student books free pass)');
    const bookRes = await fetch(`${BASE_URL}/api/registrations/${testEventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({}),
    });
    assert.strictEqual(bookRes.status, 201, 'Booking should return 201 Created');
    const bookData = await bookRes.json();
    assert.ok(bookData.registration.ticketCode.startsWith('SHR-EVT-'), 'Ticket code should have SHR-EVT- prefix');
    const passId = bookData.registration._id;
    console.log(`✅ Passed: Free ticket pass issued successfully (${bookData.registration.ticketCode})`);

    // Test 6: Duplicate Registration Check
    console.log('\n[Test 6] Duplicate Registration Prevention');
    const dupRes = await fetch(`${BASE_URL}/api/registrations/${testEventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({}),
    });
    assert.strictEqual(dupRes.status, 409, 'Duplicate booking should return 409 Conflict');
    console.log('✅ Passed: System blocks duplicate pass booking for the same student');

    // Test 7: Get Student's Passes
    console.log('\n[Test 7] GET /api/registrations/my-passes');
    const passesRes = await fetch(`${BASE_URL}/api/registrations/my-passes`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.strictEqual(passesRes.status, 200);
    const passesData = await passesRes.json();
    assert.strictEqual(passesData.count, 1);
    console.log('✅ Passed: "My Passes" returns active registrations');

    // Test 8: Organizer Check-in Verification
    console.log('\n[Test 8] PATCH /api/registrations/:id/checkin (Entrance scan & verification)');
    const checkinRes = await fetch(`${BASE_URL}/api/registrations/${passId}/checkin`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${organizerToken}` },
    });
    assert.strictEqual(checkinRes.status, 200, 'Checkin should return 200');
    const checkinData = await checkinRes.json();
    assert.strictEqual(checkinData.pass.status, 'attended');
    console.log('✅ Passed: Attendee checked in successfully');

    // Test 9: Paid Event Registration & Payment Verification
    console.log('\n[Test 9] Paid Event Workflow & Payment Portal Gateway');
    // Create paid event (₹250)
    const paidEventRes = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${organizerToken}`,
      },
      body: JSON.stringify({
        title: '[TEST] Robotics Masterclass VIP Pass',
        description: 'Advanced robotics hands-on masterclass with hardware kit.',
        category: 'Technical Workshop',
        venue: 'Mechatronics Lab',
        date: eventDate,
        time: '10:00 AM - 05:00 PM',
        registrationDeadline: deadline,
        capacity: 30,
        clubName: 'IEEE Robotics Chapter',
        ticketType: 'paid',
        price: 250,
      }),
    });
    const paidEventData = await paidEventRes.json();
    const paidEventId = paidEventData.event._id;

    // Student registers for paid event WITH payment details
    const payBookingRes = await fetch(`${BASE_URL}/api/registrations/${paidEventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        paymentMethod: 'UPI / QR',
        paymentId: 'SHR-PAY-TEST999',
      }),
    });
    assert.strictEqual(payBookingRes.status, 201, 'Paid registration should return 201');
    const payBookingData = await payBookingRes.json();
    assert.strictEqual(payBookingData.registration.status, 'confirmed', 'Ticket should be confirmed after payment');
    assert.strictEqual(payBookingData.registration.isPaid, true, 'isPaid should be true');
    assert.strictEqual(payBookingData.registration.paymentAmount, 250, 'Amount should match event price');
    assert.strictEqual(payBookingData.registration.paymentId, 'SHR-PAY-TEST999');
    console.log('✅ Passed: Paid event requires payment and ticket confirms with transaction ID');

    // Clean up test records
    await User.deleteMany({ email: /test.*@sahrdaya\.ac\.in/ });
    await Event.deleteMany({ title: /\[TEST\]/ });
    await Registration.deleteMany({ studentEmail: /test.*@sahrdaya\.ac\.in/ });

    console.log('\n======================================================');
    console.log('🎉 ALL 9 TEST SUITES (INCLUDING PAYMENT PORTAL) PASSED!');
    console.log('======================================================\n');

    server.close();
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test Failure:', error);
    if (server) server.close();
    await disconnectDB();
    process.exit(1);
  }
};

runTests();
