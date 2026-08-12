# AutoLuxe — Real-Time Car Dealership & Showroom Platform

A complete, production-level full-stack real-time car dealership platform built with **Vue 3**, **Node.js/Express**, **MongoDB**, **Socket.IO**, **Redis**, and **BullMQ**.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 · Vite · Pinia · Vue Router · Socket.IO Client · Axios |
| Backend | Node.js · Express.js · MongoDB · Mongoose · JWT · bcrypt |
| Real-Time | Socket.IO (chat + live notifications + booking updates) |
| Events | Node.js EventEmitter (domain events + listeners) |
| Queue/Worker | BullMQ + Redis (email jobs · appointment reminders) |
| Caching | Redis (car catalog cache with TTL) |
| File Upload | Multer (multi-image car photos) |
| Security | JWT RBAC · bcrypt · rate limiting · CORS · input validation |

---

## ✅ Prerequisites — YOU NEED TO INSTALL THESE

### 1. Node.js v18+
Download from: https://nodejs.org

Verify:
```bash
node --version   # Should show v18.x or higher
npm --version
```

### 2. MongoDB
**Option A (Local):** Download MongoDB Community: https://www.mongodb.com/try/download/community
- Windows: Run the installer and start as a Windows Service
- Start command: `net start MongoDB`

**Option B (Atlas Cloud — Recommended):**
- Go to https://cloud.mongodb.com
- Create a free cluster
- Copy the connection string (format: `mongodb+srv://...`)

### 3. Redis
**Option A (Windows via WSL):** Install WSL2 and run Redis in it:
```bash
wsl --install
# Then inside WSL:
sudo apt-get install redis-server
redis-server
```

**Option B (Memurai for Windows):** Download from https://www.memurai.com/
- Start Memurai service from the system tray

**Option C (Redis Cloud — Free):** https://redis.com/try-free/
- Create a free database and copy the Redis URL

> **NOTE:** If Redis is unavailable, the app still runs — BullMQ jobs are logged to console and Redis caching is bypassed automatically.

---

## ⚙️ Environment Setup

### Backend `.env`

Navigate to `backend/` and edit the `.env` file (already created):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/car_dealership   # or your Atlas URI
JWT_SECRET=autoluxe_super_secret_jwt_key_2026_production
REDIS_URL=redis://127.0.0.1:6379                         # or your Redis Cloud URL
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 📦 Installation & Startup — COMPLETE STEPS

### Step 1: Install Backend Dependencies
```bash
cd d:/car-dealership-platform/backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd d:/car-dealership-platform/frontend
npm install
```

### Step 3: Start MongoDB
```bash
# Windows (if installed as service)
net start MongoDB

# OR, start manually
mongod --dbpath "C:\data\db"
```

### Step 4: Start Redis (if using local Redis/WSL)
```bash
redis-server
```

### Step 5: Seed the Database with Demo Data
```bash
cd d:/car-dealership-platform/backend
npm run seed
```

This will populate:
- 8 luxury vehicle models (Porsche Taycan, BMW M5, Mercedes AMG, etc.)
- 4 vehicle categories
- Admin and customer demo accounts
- Sample test drives, inquiries, chat messages, notifications

### Step 6: Start the Backend Server
```bash
cd d:/car-dealership-platform/backend
npm run dev
```

Backend runs at: **http://localhost:5000**

### Step 7: Start the Frontend Dev Server
Open a **NEW terminal window**:
```bash
cd d:/car-dealership-platform/frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔑 Demo Accounts (created by seed script)

| Role | Email | Password |
|---|---|---|
| 👑 Admin / Dealer | `admin@autoluxe.com` | `Admin123!` |
| 👤 Customer | `john@example.com` | `Customer123!` |
| 👤 Customer 2 | `sarah@example.com` | `Customer123!` |

> **Quick Login:** The Login page has one-click "Fill Admin" and "Fill Customer" buttons to automatically fill the credentials.

---

## 🔧 Testing the Complete Business Flow

1. **Open**: http://localhost:5173
2. **Browse** the public showroom — hero search, car cards, filters, car detail pages
3. **Login as Customer** (`john@example.com / Customer123!`)
4. **Book a test drive** from any Car Detail page
5. **Open a NEW browser tab** → Login as **Admin** (`admin@autoluxe.com / Admin123!`)
6. **Admin Dashboard** → Go to "Test Drive Bookings" → Click **Confirm** on the booking
7. **Switch back to Customer tab** → Watch the **real-time Socket.IO notification** appear instantly
8. **Chat**: Customer → Dashboard → "Live Chat" → Send a message → Admin sees it instantly in "Customer Support Console"
9. **Backend console**: Watch BullMQ worker logs showing email jobs being processed

---

## 📁 Project Structure

```
car-dealership-platform/
├── backend/
│   ├── src/
│   │   ├── config/         # db.js, redis.js, multer.js, env.js
│   │   ├── models/         # User, Car, Category, TestDrive, Favorite, Inquiry, Message, Notification, Appointment, ActivityLog
│   │   ├── services/       # auth, car, testDrive, inquiry, chat, notification, redis, stats
│   │   ├── controllers/    # auth, car, category, testDrive, inquiry, chat, notification, stats, user
│   │   ├── routes/         # auth, car, category, testDrive, inquiry, chat, notification, stats, user
│   │   ├── middleware/     # auth, validate, rateLimiter, error
│   │   ├── validators/     # auth, car, testDrive, inquiry
│   │   ├── events/         # appEvents.js, eventTypes.js
│   │   ├── listeners/      # notification.listener, activityLog.listener, queueProducer.listener
│   │   ├── queues/         # emailQueue.js, reminderQueue.js
│   │   ├── workers/        # emailWorker.js, reminderWorker.js
│   │   ├── sockets/        # socketManager.js, chatSocket.js
│   │   ├── seeds/          # runSeed.js, seedData.js
│   │   ├── utils/          # apiResponse.js
│   │   └── server.js       # Main Express + Socket.IO server
│   ├── uploads/            # Multer uploaded car images
│   ├── .env                # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/            # axios, auth, car, testDrive, inquiry, chat, notification, stats
    │   ├── assets/styles/  # main.css, website.css, dashboard.css
    │   ├── components/     # Navbar, Footer, Toast, CarCard, StatCard
    │   ├── composables/    # useSocket.js, useToast.js
    │   ├── layouts/        # DefaultLayout, CustomerLayout, AdminLayout
    │   ├── router/         # index.js (public, customer, admin routes + guards)
    │   ├── stores/         # auth, car, chat, notification, compare (Pinia)
    │   ├── views/
    │   │   ├── public/     # Home, Cars, CarDetail, Categories, Compare, About, Contact, Login, Register
    │   │   ├── customer/   # Dashboard, TestDrives, Favorites, Inquiries, Messages, Notifications, Profile
    │   │   └── admin/      # Dashboard, Cars, CarForm, Categories, TestDrives, Inquiries, Messages, Customers, ActivityLogs
    │   ├── App.vue
    │   └── main.js
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register new customer |
| POST | `/api/auth/login` | None | Login (returns JWT) |
| GET | `/api/auth/me` | JWT | Get logged-in user profile |
| PUT | `/api/auth/profile` | JWT | Update profile & preferences |

### Cars
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/cars` | None | Get all cars (filterable + paginated) |
| GET | `/api/cars/:id` | None | Get single car details |
| POST | `/api/cars` | Admin JWT | Create car (multipart/form-data) |
| PUT | `/api/cars/:id` | Admin JWT | Update car |
| DELETE | `/api/cars/:id` | Admin JWT | Delete car |
| POST | `/api/cars/:id/favorite` | JWT | Toggle favorite |
| GET | `/api/cars/favorites` | JWT | Get user favorites |

### Test Drives
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/test-drives` | JWT | Book test drive (triggers real-time notif) |
| GET | `/api/test-drives/my-bookings` | JWT | Get customer bookings |
| PUT | `/api/test-drives/:id/cancel` | JWT | Cancel booking |
| GET | `/api/test-drives/admin/all` | Admin JWT | All bookings |
| PUT | `/api/test-drives/admin/:id/status` | Admin JWT | Update status (triggers Socket.IO) |

### Chat (REST history — real-time via Socket.IO)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/chat/conversations` | JWT | Active conversations list |
| GET | `/api/chat/conversation/:peerId` | JWT | Load chat history + mark read |

### Socket.IO Events
| Event | Direction | Description |
|---|---|---|
| `send_message` | Client → Server | Send chat message |
| `receive_message` | Server → Client | Delivered message (both sender + recipient) |
| `notification_received` | Server → Client | New notification pushed to user room |
| `test_drive_updated` | Server → Client | Booking status change pushed to customer |
| `user_typing` | Client → Server/Client | Typing indicator |

---

## ⚡ Real-Time Architecture Flow

```
Customer Books Test Drive
         ↓
TestDriveService.bookTestDrive()
         ↓
appEvents.emit('TEST_DRIVE_BOOKED', data)
         ↓
┌─────────────────────────────────────┐
│ notification.listener               │ → Creates Notification → Socket.IO → Admin room
│ activityLog.listener                │ → Creates ActivityLog entry
│ queueProducer.listener              │ → BullMQ emailQueue.add('sendTestDriveConfirmation')
└─────────────────────────────────────┘
         ↓
Admin confirms booking via Dashboard
         ↓
TestDriveService.updateStatus()
         ↓
appEvents.emit('TEST_DRIVE_STATUS_CHANGED', data)
         ↓
notification.listener → Socket.IO → user:customerId room
                      → 'notification_received' event
                      → 'test_drive_updated' event
         ↓
Customer sees instant update without page refresh ✓
```
