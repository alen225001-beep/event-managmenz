# Campus Lost & Found System
**MERN Stack Full Stack Development Project**  
**Institution:** Sahrdaya College of Engineering & Technology, Kodakara, Thrissur, Kerala  
**Student:** Alen  
**Email:** `alen225001@sahrdaya.ac.in`  
**Academy:** Information & Communication Technology Academy of Kerala (ICTAK)  

---

## 1. Project Overview & Problem Statement

### Problem Statement
On busy college campuses like Sahrdaya, hundreds of personal and academic belongings (student ID cards, Casio calculators, lab records, bike keys, chargers, watches, and bags) are misplaced daily. The absence of a centralized digital lost-and-found system leads to chaotic WhatsApp group spam, unclaimed lost property languishing in security drawers, and vulnerabilities where items are claimed fraudulently without ownership verification.

**Campus Lost & Found** provides a secure, role-based digital repository and ownership verification platform tailored for the Sahrdaya College campus community.

---

## 2. Project Definition & Specifications (ICTAK Section 2)

### 2.1 Target Users & Roles
| Role | Permissions & Scope |
| :--- | :--- |
| **Student** | Report lost items, log found items, browse campus feed with filters, submit ownership verification claims with proof statements, manage personal reports and claims in dashboard. |
| **Faculty & Staff** | Report lost/found departmental materials, review verification claims for items found in departmental laboratories. |
| **Campus Security Desk** | Act as physical custodian of high-value found items (gate token tracking), review claimant proofs, approve physical handovers, and update item status to `RETURNED`. |
| **College Administrator** | System-wide oversight, manage all campus items, resolve claim disputes, monitor recovery rates, manage user roles and permissions. |

---

### 2.2 MVP Scope
- **Must Have (MVP)**:
  - User Registration & Login with JWT authentication and bcrypt password hashing.
  - Dedicated college email validation (`@sahrdaya.ac.in`).
  - Report Lost Item with title, category, campus location spot, date, description, and tags.
  - Log Found Item with physical safe custody location (e.g., Main Security Gate Desk).
  - Search & Filter Feed (by type: LOST/FOUND, category, location keyword, status).
  - Two-tier Claim Verification Workflow: Claimant submits secret identifying features; reporter/security reviews and approves or rejects claim.
  - User Dashboard: Track own reports and status of submitted claims.
  - Security & Admin Console: Campus statistics, manage items, approve handovers, manage users.
  - 4-State UI for every screen: Loading, Success, Empty, and Error states with retry capability.
- **Later Enhancements**:
  - Automated optical character recognition (OCR) for Sahrdaya student ID cards.
  - Instant automated SMS/Email notifications on claim status change.
  - QR-code generation for student equipment tagging.

---

### 2.3 User Stories & Acceptance Criteria

#### Story 1: Report a Found Casio Calculator
- **As a** student or security officer,
- **I want to** log a found Casio scientific calculator with the specific campus room and custody desk,
- **So that** the student who lost it can locate and claim it.
- **Acceptance Criteria**:
  - Required fields (title, category, type, location, description) must be validated on both client and server.
  - An empty title or missing location returns a 400 Bad Request error.
  - After saving, the report appears immediately in the campus feed.
  - Custody location defaults to "Main Security Gate Desk" for high security.

#### Story 2: Submit an Ownership Claim with Proof
- **As a** student who lost an item,
- **I want to** submit a claim describing unique distinguishing marks (e.g., sticker under battery lid, lockscreen photo),
- **So that** the finder or security officer can verify my ownership without publicly revealing identifying marks.
- **Acceptance Criteria**:
  - Claimant cannot submit a claim on an item they reported themselves.
  - Claimant cannot submit duplicate active pending claims on the same item.
  - Submitting a claim updates the item status to `CLAIM_PENDING`.
  - Item reporter and security staff can review the claim proof and click "Approve" or "Reject".
  - Approving a claim automatically updates the item to `RETURNED` and rejects other pending claims.

---

### 2.4 Data Model

```
+-------------------------------------------------------+
|                        User                           |
+-------------------------------------------------------+
| _id: ObjectId                                         |
| name: String (2-60 chars)                             |
| email: String (unique, indexed, lowercase)            |
| password: String (hashed via bcrypt, select: false)   |
| role: 'student' | 'faculty' | 'security_staff' | 'admin'|
| department: String                                    |
| studentId: String (e.g., 'alen225001')                |
| phone: String                                         |
| isActive: Boolean (default: true)                     |
| timestamps: createdAt, updatedAt                      |
+-------------------------------------------------------+
                          | 1
                          |
                          | has many reports
                          v N
+-------------------------------------------------------+
|                        Item                           |
+-------------------------------------------------------+
| _id: ObjectId                                         |
| title: String (max 120, indexed)                      |
| description: String (max 1500)                        |
| type: 'LOST' | 'FOUND' (indexed)                      |
| category: 'ELECTRONICS' | 'ID_CARDS_DOCUMENTS' |      |
|           'BOOKS_STATIONERY' | 'KEYS' |               |
|           'CLOTHING_ACCESSORIES' | 'BAGS_WALLETS' |   |
|           'SPORTS_EQUIPMENT' | 'OTHER'                |
| status: 'REPORTED' | 'CLAIM_PENDING' |                |
|         'RETURNED' | 'ARCHIVED'                       |
| location: String (Campus building/room)               |
| custodyLocation: String (e.g. Main Security Desk)     |
| dateLostOrFound: Date                                 |
| distinguishingMarks: String (Confidential)            |
| reportedBy: ObjectId -> Ref User                      |
| contactEmail: String                                  |
| contactPhone: String                                  |
| imageUrl: String                                      |
| resolvedAt: Date                                      |
| resolvedBy: ObjectId -> Ref User                      |
| timestamps: createdAt, updatedAt                      |
+-------------------------------------------------------+
                          | 1
                          |
                          | receives claims
                          v N
+-------------------------------------------------------+
|                        Claim                          |
+-------------------------------------------------------+
| _id: ObjectId                                         |
| item: ObjectId -> Ref Item                            |
| claimant: ObjectId -> Ref User                        |
| proofDescription: String (min 10 chars, required)    |
| status: 'PENDING' | 'APPROVED' | 'REJECTED'           |
| contactPhone: String                                  |
| reviewedBy: ObjectId -> Ref User                      |
| reviewNotes: String                                   |
| reviewedAt: Date                                      |
| timestamps: createdAt, updatedAt                      |
+-------------------------------------------------------+
```

---

### 2.5 API Contract (RESTful `/api`)

| Method | Endpoint | Description | Access | Success | Errors |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health and info check | Public | `200 OK` | `500` |
| `POST` | `/api/auth/register` | Register new campus account | Public | `201 Created` | `400, 409` |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | Public | `200 OK` | `400, 401, 403` |
| `GET` | `/api/auth/profile` | Get current user profile | Private | `200 OK` | `401, 404` |
| `PUT` | `/api/auth/profile` | Update profile info | Private | `200 OK` | `400, 401` |
| `GET` | `/api/items` | List items (pagination, filters, search) | Public | `200 OK` | `500` |
| `GET` | `/api/items/stats` | Campus metrics & recovery percentage | Public | `200 OK` | `500` |
| `GET` | `/api/items/:id` | Get item details | Public | `200 OK` | `404` |
| `POST` | `/api/items` | Create lost or found report | Private | `201 Created` | `400, 401` |
| `PUT` | `/api/items/:id` | Update item report | Owner/Admin | `200 OK` | `401, 403, 404` |
| `DELETE` | `/api/items/:id` | Delete item report & related claims | Owner/Admin | `200 OK` | `401, 403, 404` |
| `GET` | `/api/items/my/reports` | Get current user's reports | Private | `200 OK` | `401` |
| `POST` | `/api/claims` | Submit ownership verification claim | Private | `201 Created` | `400, 401, 404, 409` |
| `GET` | `/api/claims/my` | Get current user's submitted claims | Private | `200 OK` | `401` |
| `GET` | `/api/claims/item/:itemId` | Get claims on an item | Owner/Admin | `200 OK` | `401, 403, 404` |
| `PATCH` | `/api/claims/:id/status` | Approve or reject claim | Owner/Admin | `200 OK` | `400, 401, 403, 404` |
| `GET` | `/api/admin/overview` | Admin metrics & category breakdown | Admin | `200 OK` | `401, 403` |
| `GET` | `/api/admin/users` | List registered campus users | Admin | `200 OK` | `401, 403` |
| `PATCH` | `/api/admin/users/:id/role`| Update user role or active status | Admin | `200 OK` | `401, 403, 404` |

---

## 3. Project Architecture & Structure (ICTAK Section 3 & 4)

```
campus-lost-and-found/
├── package.json               # Root scripts for client and server orchestration
├── .gitignore                 # Excludes node_modules, .env, build artifacts
├── README.md                  # Comprehensive documentation and guidelines
│
├── client/                    # React 19 Frontend (Vite)
│   ├── index.html             # HTML entry with Sahrdaya typography
│   ├── vite.config.js         # Vite configuration
│   ├── package.json           # Frontend dependencies (React Router, Lucide, etc.)
│   ├── .env.example           # Example frontend environment variables
│   └── src/
│       ├── main.jsx           # React DOM mounting
│       ├── App.jsx            # Application layout, routes, protected routes
│       ├── index.css          # Design system, cards, badges, modal, animations
│       ├── components/
│       │   ├── Navbar.jsx         # Navigation header with role badges & mobile drawer
│       │   ├── Footer.jsx         # Sahrdaya institutional footer & student credits
│       │   ├── ItemCard.jsx       # Reusable item card with status pills & tags
│       │   ├── ClaimModal.jsx     # Ownership verification proof questionnaire
│       │   ├── LoadingSpinner.jsx # Loading state indicator
│       │   ├── EmptyState.jsx     # Empty state display with action buttons
│       │   ├── ErrorMessage.jsx   # Error alert with retry action
│       │   └── ProtectedRoute.jsx # Role and authentication route guard
│       ├── pages/
│       │   ├── Home.jsx           # Landing page with stats, search & 3-step SOP
│       │   ├── ItemList.jsx       # Campus directory with search & category pills
│       │   ├── ItemDetails.jsx    # Full item specifications & claims management
│       │   ├── CreateItem.jsx     # Form to report Lost or Found belongings
│       │   ├── EditItem.jsx       # Update report details or change status
│       │   ├── Dashboard.jsx      # User profile, reported items & submitted claims
│       │   ├── AdminDashboard.jsx # Security administration and dispute console
│       │   ├── Login.jsx          # Sign In with 1-click Demo Account filler
│       │   ├── Register.jsx       # Student/Staff registration form
│       │   └── NotFound.jsx       # 404 page
│       ├── context/
│       │   └── AuthContext.jsx    # Global authentication & user state
│       ├── hooks/
│       │   └── useAuth.js         # Hook for accessing AuthContext
│       └── services/
│           ├── api.js             # Central fetch client with JWT injection
│           ├── authService.js     # Auth & token persistence API calls
│           ├── itemService.js     # Item CRUD & stats API calls
│           ├── claimService.js    # Claim submission & status API calls
│           └── adminService.js    # Administrator console API calls
│
└── server/                    # Express & Node.js API
    ├── package.json           # Backend dependencies (express, mongoose, bcrypt, jwt)
    ├── .env.example           # Example backend environment variables
    ├── tests/
    │   └── api.test.js        # Automated integration test suite (12 test cases)
    └── src/
        ├── server.js          # Express entry point, CORS, routes, health check
        ├── config/
        │   └── db.js          # Resilient Mongoose connection + memory fallback
        ├── models/
        │   ├── User.js        # User model with bcrypt pre-save hashing
        │   ├── Item.js        # Item model with text search & compound indexes
        │   └── Claim.js       # Claim verification model with proof details
        ├── middleware/
        │   ├── authMiddleware.js   # JWT protect and authorize middleware
        │   └── errorMiddleware.js  # Centralized error handler (400, 401, 404, 409, 500)
        ├── controllers/
        │   ├── authController.js   # Register, login, profile management
        │   ├── itemController.js   # CRUD, search, filter, pagination, stats
        │   ├── claimController.js  # Submit claims, approve/reject workflow
        │   └── adminController.js  # Admin metrics, audit items, manage users
        ├── routes/
        │   ├── authRoutes.js       # /api/auth
        │   ├── itemRoutes.js       # /api/items
        │   ├── claimRoutes.js      # /api/claims
        │   └── adminRoutes.js      # /api/admin
        └── seed/
            ├── seedData.js         # Realistic Sahrdaya College demo data
            └── seedRunner.js       # Database seeder execution script
```

---

## 4. Setup & Running Locally (ICTAK Appendix A)

### Prerequisites
- **Node.js**: v18+ (verified on v24.22.0)
- **npm**: v9+ (verified on v11.19.1)
- **Git**: v2+

### Quick Start (Two Terminal Setup)

#### Step 1: Install Dependencies
```bash
# In project root:
npm run install:all

# Or separately:
cd server && npm install
cd ../client && npm install
```

#### Step 2: Environment Configuration
Create `.env` in `server/` (copied from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campus_lost_and_found
JWT_SECRET=sahrdaya_campus_lost_and_found_secret_key_2026
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Create `.env` in `client/` (copied from `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 3: Seed Database with Sahrdaya Demo Data
```bash
npm run seed --prefix server
```

#### Step 4: Run the Apps
**Terminal 1 (Backend API):**
```bash
npm run dev --prefix server
# Server starts on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev --prefix client
# Client runs on http://localhost:5173
```

---

## 5. Demo Credentials

The database seeder pre-configures accounts for testing:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Student (Alen)** | `alen225001@sahrdaya.ac.in` | `password123` | Computer Science student; owns demo reports and active claims. |
| **Campus Security Desk** | `security@sahrdaya.ac.in` | `password123` | Security staff managing physical custody of found items. |
| **College Administrator** | `admin@sahrdaya.ac.in` | `password123` | Full access to the Admin Console. |
| **Student (Sneha)** | `sneha.cs@sahrdaya.ac.in` | `password123` | Computer Science student with lost bike key report. |
| **Student (Rahul)** | `rahul.bme@sahrdaya.ac.in` | `password123` | Biomedical student with found Titan watch and lost record. |

*(Note: The login page provides 1-click autofill buttons for convenience!)*

---

## 6. Testing & Quality Assurance (ICTAK Section 8)

Run the automated integration test suite:
```bash
npm test --prefix server
```
The test suite validates:
1. `GET /api/health` - 200 OK and JSON health message.
2. `POST /api/auth/register` - 201 Created and valid JWT token.
3. `POST /api/auth/register` - 409 Conflict rejection for duplicate email.
4. `POST /api/auth/login` - 200 OK authentication.
5. `POST /api/auth/login` - 401 Unauthorized for incorrect password.
6. `GET /api/auth/profile` - Protected Bearer token authentication.
7. `POST /api/items` - 401 Unauthorized rejection when token is missing.
8. `POST /api/items` - 201 Created item logging.
9. `GET /api/items` - 200 OK with pagination, search, and category filter.
10. `GET /api/items/stats` - 200 OK aggregate statistics.
11. `PUT /api/items/:id` - 200 OK report update by authorized owner.
12. `GET /api/admin/overview` - 403 Forbidden role defense against unauthorized students.

---

## 7. Security & Privacy Implementations (ICTAK Section 10)
- **Password Protection**: Salted hash using `bcryptjs` (salt rounds: 10). Plain-text passwords are never stored, logged, or returned.
- **JWT Authorization**: Cryptographically signed tokens with expiration (`7d`).
- **Least Privilege Access**: Students cannot access `/api/admin/*` routes; users cannot modify items reported by others; claimants cannot approve their own claims.
- **Sanitization & Validation**: Strong Mongoose schema constraints, email regex matching, and sanitized regex search against NoSQL injection.
- **Centralized Error Handling**: Generic safe messages returned to clients; detailed stacks logged only on the server in development mode.
- **Confidential Distinguishing Marks**: Identifying marks are kept confidential and exposed only to the reporter and campus security to prevent fraudulent claims.

---

## 8. Final Submission Checklist (ICTAK Section 13)

- [x] Problem statement and MVP strictly defined and documented.
- [x] Client (React 19 Vite) and Server (Express/Node) cleanly separated.
- [x] Git repository initialized with strict `.gitignore` ignoring `.env` and `node_modules/`.
- [x] `.env.example` templates committed in both client and server folders.
- [x] Centralized API client (`services/api.js`) consuming `import.meta.env.VITE_API_URL`.
- [x] Every screen supports 4 core states: Loading, Success, Empty, and Error.
- [x] Complete RESTful API with status codes (200, 201, 400, 401, 403, 404, 409, 500).
- [x] Ownership checks enforced on both server controllers and frontend UI.
- [x] Automated test script included and verified.
- [x] Student developer details (`Alen`, `alen225001@sahrdaya.ac.in`) included.

---

## 9. Self-Review Questions (ICTAK Section 14)

1. **Can I explain the problem my project solves and who it is for in two sentences?**  
   *Yes: Campus Lost & Found eliminates chaotic lost-property communication at Sahrdaya College by providing a centralized digital portal where students and staff can log lost/found items and verify ownership with campus security through distinguishing proofs.*
2. **Does the MVP work from start to finish without manual workarounds?**  
   *Yes: A student can report an item, another student can find and claim it with proof, and security can approve the handover to complete the lifecycle.*
3. **Can I trace one request from the React component to the database and back?**  
   *Yes: Form submission in `CreateItem.jsx` calls `itemService.createItem()`, which sends a `POST /api/items` with Bearer JWT to Express. `authMiddleware` verifies the token, `itemController.createItem` validates inputs and saves to MongoDB via Mongoose `Item.create()`, returning 201 Created and JSON data back to React.*
4. **What happens if the user enters bad input, loses internet, or the API fails?**  
   *Forms have inline input validation; API errors return standardized `{ success: false, message: ... }` rendered gracefully in the UI; network drops display `<ErrorMessage />` with a 1-click retry button.*
5. **Which data is protected, and how do I stop one user from reaching another user's data?**  
   *Distinguishing marks and claim proofs are protected. Server-side authorization checks ensure only the item reporter and admin can view proof statements or approve handovers.*
6. **Where are secrets stored?**  
   *All secrets (`JWT_SECRET`, database URIs) reside strictly in `.env` files, which are excluded from Git via `.gitignore`.*
