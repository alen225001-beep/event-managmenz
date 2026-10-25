# Sahrdaya EventHub: Campus Event & Digital Ticket/Pass Booking Portal
**MERN Stack Full Stack Application Development Project**  
**Institution:** Sahrdaya College of Engineering & Technology (SCET), Kodakara, Thrissur, Kerala  
**Student:** Alen  
**College Email:** `alen225001@sahrdaya.ac.in`  
**Academy:** Information & Communication Technology Academy of Kerala (ICTAK)  

---

## 1. Project Overview & Problem Statement

### 1.1 Problem Statement
Across higher education institutions like Sahrdaya College of Engineering & Technology, dozens of academic workshops, inter-collegiate hackathons, IEEE symposiums, cultural fests (Sargam), and sports tournaments are conducted throughout the semester. However:
1. **Scattered Information**: Event announcements are dispersed across unofficial WhatsApp groups, printed notice boards, and departmental Instagram pages, causing students to miss key deadlines.
2. **Chaotic Registrations**: Organizers use disparate Google Forms with no automatic seat capacity capping, resulting in double-bookings, overcrowded computer labs, or empty venues.
3. **Absence of Entrance Verification**: Without a verifiable digital pass, admission desks at auditoriums and laboratories face fraudulent entries, manual paper tick-sheets, and long entry queues.

### 1.2 Solution: Sahrdaya EventHub
**Sahrdaya EventHub** provides a centralized, role-based MERN web platform where:
- **Students** discover campus activities, filter by category/date, and reserve free entry passes with unique digital barcodes (`SHR-EVT-XXXXXX`).
- **Club Organizers (IEEE, CSI, IEDC, NSS)** publish campus workshops, enforce seating capacity limits, download attendee rosters, and verify arrivals with 1-click check-in.
- **College Administrators** monitor cross-departmental engagement, category distribution, and attendance rates.

---

## 2. Project Specification & Requirements (ICTAK Guidelines)

### 2.1 Target Users & Roles
| Role | Permissions & Responsibilities |
| :--- | :--- |
| **Student (Attendee)** | Browse campus events, search/filter by category/club, reserve admission passes, access personal digital ticket wallet ("My Passes"), print digital boarding passes, and cancel registrations before deadline. |
| **Club Organizer** | (e.g. IEEE Sahrdaya SB, CSI, IEDC, NSS Leads) Publish events, define venue and max seating capacity, manage event lifecycle (`upcoming`, `completed`, `cancelled`), view registered attendee roster, and verify student check-ins at hall entrance. |
| **College Administrator** | System-wide governance, track campus engagement analytics, view category distribution and club leaderboards, promote students to club organizers, manage user accounts. |

---

### 2.2 MVP Scope
- **Must Have (Delivered)**:
  - User Registration & Authentication with JWT and bcrypt password hashing.
  - Sahrdaya College email domain validation (`@sahrdaya.ac.in`).
  - Event Management: Title, category, venue, date, timing, capacity, banner image, hosting club, tags, description.
  - Dynamic Seat Availability: Real-time calculation of remaining spots; automated "Sold Out" state when capacity is reached.
  - Duplicate Booking Guard: Prevents multiple registrations by the same student for the same event.
  - Digital Ticket Pass: Generates unique pass code (`SHR-EVT-XXXXXX`), student snapshot, barcode/QR simulator, and print-ready layout.
  - Organizer Entrance Roster: Real-time search by student name/ID/pass code and 1-click check-in verification.
  - Admin Analytics: Total events, total passes issued, attendance rate, category distribution, and user role management.
  - 4-State UI across all views: Loading, Success, Empty, and Error with retry.
- **Future Enhancements**:
  - Live QR-code camera scanner for mobile devices.
  - Automated SMS and Email confirmation via Nodemailer / Twilio.
  - Certificate generation for attended students.

---

### 2.3 User Stories & Acceptance Criteria

#### Story 1: Student Books a Free Entry Pass for Hackathon
- **As a** Sahrdaya student,
- **I want to** reserve a seat for the TechNovus '26 Hackathon,
- **So that** I receive a guaranteed spot and a verifiable digital pass.
- **Acceptance Criteria**:
  - Unauthenticated users clicking "Book Pass" are redirected to login.
  - If seats are available, clicking "Book Pass" atomically increments the event's `registeredCount` and creates a Registration document.
  - The student is immediately presented with their printable digital boarding pass containing code `SHR-EVT-XXXXXX`.
  - Re-attempting to register shows a friendly message indicating an active pass already exists.

#### Story 2: Club Organizer Verifies Entrance Admission
- **As an** IEEE club coordinator,
- **I want to** search an attendee by their student ID or pass code and click "Check In",
- **So that** only legitimate students enter the laboratory.
- **Acceptance Criteria**:
  - Roster displays real-time attendance status (`Confirmed` vs `Attended`).
  - Clicking "Check In" updates registration status to `attended` and records timestamp `attendedAt`.
  - Attendance rate percentage updates live in the dashboard.

---

## 3. Architecture & Data Model

### 3.1 MERN Stack Flow
```
+-------------------------------------------------------------------+
|                        React 19 Frontend                          |
|  (Vite, Tailwind CSS, Lucide Icons, React Router 7, Auth Context) |
+-------------------------------------------------------------------+
                                  |
                                  | HTTPS / REST (JSON) + JWT Bearer
                                  v
+-------------------------------------------------------------------+
|                     Node.js & Express API                         |
|   (Auth Routes, Event Routes, Registration Routes, Admin Routes)  |
+-------------------------------------------------------------------+
                                  |
                                  | Mongoose ODM (Atomic operations)
                                  v
+-------------------------------------------------------------------+
|                   MongoDB Atlas Cloud Database                    |
|      Collections: users, events, registrations (indexes & TTL)    |
+-------------------------------------------------------------------+
```

### 3.2 Database Schema

#### User Model (`User.js`)
- `_id`: ObjectId
- `name`: String (2-60 chars)
- `email`: String (unique, indexed, validated `@sahrdaya.ac.in`)
- `password`: String (hashed via bcryptjs, select: false)
- `role`: Enum `['student', 'organizer', 'admin']` (default: `'student'`)
- `department`: String (e.g. `'Computer Science & Engineering'`)
- `studentId`: String (e.g. `'alen225001'`)
- `phone`: String
- `clubName`: String (e.g. `'IEEE Sahrdaya SB'`)
- `isActive`: Boolean (default: true)

#### Event Model (`Event.js`)
- `_id`: ObjectId
- `title`: String (indexed, max 120 chars)
- `description`: String (max 3000 chars)
- `category`: Enum `['Technical Workshop', 'Hackathon', 'Cultural Fest', 'National Seminar', 'Sports Tournament', 'Guest Lecture', 'Career & Placement', 'Other']`
- `venue`: String (e.g. `'Decennial Hall, Main Block'`)
- `date`: Date (indexed)
- `time`: String (e.g. `'09:30 AM - 04:30 PM'`)
- `registrationDeadline`: Date
- `capacity`: Number (min 1, default 100)
- `registeredCount`: Number (default 0)
- `bannerImage`: String (URL)
- `organizer`: ObjectId (ref: `User`)
- `clubName`: String
- `status`: Enum `['upcoming', 'ongoing', 'completed', 'cancelled']`
- `ticketType`: Enum `['free', 'paid']`
- `price`: Number (default 0)
- `tags`: Array of Strings
- Virtual: `spotsLeft` (`capacity - registeredCount`)

#### Registration Model (`Registration.js`)
- `_id`: ObjectId
- `event`: ObjectId (ref: `Event`, indexed)
- `user`: ObjectId (ref: `User`, indexed)
- `ticketCode`: String (unique, e.g. `'SHR-EVT-749201'`)
- `status`: Enum `['confirmed', 'attended', 'cancelled']`
- `studentName`: String
- `studentEmail`: String
- `studentDepartment`: String
- `studentId`: String
- `registeredAt`: Date (default: Date.now)
- `attendedAt`: Date
- Unique Compound Index: `{ event: 1, user: 1 }` (prevents duplicate passes)

---

## 4. API Endpoints Contract

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register student or club organizer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/profile` | Private | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user contact info |
| `GET` | `/api/events` | Public | Search and filter campus events (pagination) |
| `GET` | `/api/events/featured` | Public | Top spotlight events for homepage |
| `GET` | `/api/events/:id` | Public/Auth | Full event details & user registration status |
| `POST` | `/api/events` | Organizer/Admin | Publish new workshop or fest |
| `PUT` | `/api/events/:id` | Organizer/Admin | Edit event details, timing, or venue |
| `DELETE` | `/api/events/:id` | Organizer/Admin | Remove/cancel event |
| `GET` | `/api/events/:id/attendees` | Organizer/Admin | View registered attendee roster |
| `POST` | `/api/registrations/:eventId` | Student/Auth | Reserve free entry pass & generate ticket code |
| `GET` | `/api/registrations/my-passes` | Student/Auth | Get student's digital passes wallet |
| `GET` | `/api/registrations/ticket/:code` | Public | Verify validity of ticket pass |
| `PATCH` | `/api/registrations/:id/cancel` | Student/Auth | Cancel reservation & restore available seat |
| `PATCH` | `/api/registrations/:id/checkin` | Organizer/Admin | Check in attendee at hall entrance |
| `GET` | `/api/admin/stats` | Admin | Campus engagement & category analytics |
| `GET` | `/api/admin/users` | Admin | User directory and role list |
| `PATCH` | `/api/admin/users/:id` | Admin | Promote user to organizer or toggle status |
| `GET` | `/api/health` | Public | Server uptime & MongoDB connection health |

---

## 5. Security & Data Integrity

1. **Password Encryption**: All passwords hashed using `bcryptjs` with salt factor 10. Passwords never returned in queries (`select: false`).
2. **JWT Authorization**: Stateless authorization using JSON Web Tokens passed via `Authorization: Bearer <token>`.
3. **Role-Based Access Control (RBAC)**: Custom `authorize(...roles)` middleware protects administrative and organizer operations.
4. **CORS Hardening**: Configured with dynamic `origin: true` and credentials support to eliminate cross-origin request blocks in production and local development.
5. **Atomic Seat Reservation**: Seat count updates performed using MongoDB `$inc` operators to eliminate race conditions.
6. **Unique Compound Indexing**: MongoDB compound index `{ event: 1, user: 1 }` strictly forbids duplicate registrations.

---

## 6. Local Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB Atlas account or local MongoDB

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/<your-username>/sahrdaya-eventhub.git
cd sahrdaya-eventhub

# Install all root, server, and client dependencies
npm --prefix server install
npm --prefix client install
```

### 2. Configure Environment Variables
Create `server/.env`:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sahrdaya-eventhub?retryWrites=true&w=majority
JWT_SECRET=sahrdaya_campus_eventhub_secret_key_2026
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Seed Database with Realistic Sahrdaya Data
```bash
npm run seed
```

### 4. Run API Test Suite
```bash
npm test
```
*Executes all 8 integration test suites verifying auth, CRUD, capacity constraints, pass issuance, and check-ins.*

### 5. Start Development Servers
```bash
# Terminal 1: Backend API (runs on port 5001)
npm run server

# Terminal 2: React Frontend (runs on http://localhost:5173)
npm run client
```

---

## 7. Demo Accounts for Evaluation & Viva

| Account | Email | Password | Role & Purpose |
| :--- | :--- | :--- | :--- |
| **Student Lead (Alen)** | `alen225001@sahrdaya.ac.in` | `password123` | **Organizer**: Publish events, manage IEEE roster, check-in attendees |
| **College Dean** | `admin@sahrdaya.ac.in` | `password123` | **Admin**: View campus statistics, category distribution, manage users |
| **Student (Anjali)** | `anjali@sahrdaya.ac.in` | `password123` | **Student**: Has active pass for TechNovus & attended PyTorch workshop |
| **Student (Rahul)** | `rahul@sahrdaya.ac.in` | `password123` | **Student**: Registered for BME Seminar & Sargam Cultural Fest |

---

## 8. Deployment on Render & MongoDB Atlas

1. **MongoDB Atlas**:
   - Create cluster on MongoDB Atlas.
   - Whitelist IP addresses: `0.0.0.0/0` (Network Access).
   - Copy connection string into Render Environment Variables as `MONGODB_URI`.
2. **Render Web Service**:
   - Connect GitHub repository.
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
   - Environment Variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
     - `MONGODB_URI`: `<Atlas Connection String>`
     - `JWT_SECRET`: `<Secret>`
     - `JWT_EXPIRES_IN`: `7d`

---

## 9. Viva Questions & Project Defense Guide

**Q1: How does Sahrdaya EventHub prevent race conditions when two students book the last available seat simultaneously?**  
*Answer:* The application uses atomic MongoDB update operations (`$inc: { registeredCount: 1 }`) combined with a unique compound index `{ event: 1, user: 1 }` on the `Registration` collection. The API checks `registeredCount < capacity` prior to reservation and rejects requests exceeding the threshold with HTTP 400.

**Q2: How does the application handle CORS in production on Render?**  
*Answer:* In production, Express is configured to serve both the compiled Vite React frontend (`client/dist`) and the API routes from the same origin. For cross-origin requests, `cors({ origin: true, credentials: true })` dynamically matches the incoming request origin, ensuring browser security headers without static whitelisting failures.

**Q3: How are the 4-State UI requirements satisfied?**  
*Answer:* Every view incorporates explicit component states:
1. **Loading**: Centered spinning indicator (`LoadingSpinner.jsx`).
2. **Success**: Formatted event cards, pass details, or roster table.
3. **Empty**: Informative illustration and call-to-action button (`EmptyState.jsx`).
4. **Error**: User-friendly alert banner with retry callback (`ErrorMessage.jsx`).

---

**Developed with ❤️ by Alen (`alen225001@sahrdaya.ac.in`) for ICTAK Full Stack Development Evaluation.**
