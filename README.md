# AutoLuxe — Production Car Dealership Platform

A production-ready full-stack dealership system with real-time capabilities.

## 🚀 Core Features

- **Live Chat** — Instant customer-dealer communication
- **Real-Time Notifications** — Live updates for bookings and messages
- **Test Drive Management** — Booking, confirmation, status tracking
- **Car Inventory** — Full CRUD with image uploads
- **Role-Based Access** — Admin and customer dashboards
- **Background Processing** — Email queues and reminders
- **Responsive UI** — Mobile-first design

## 🛠️ Technology Stack

**Frontend:** Vue 3 · Pinia · Vue Router · Socket.IO Client
**Backend:** Node.js · Express · MongoDB · JWT Auth
**Real-Time:** Socket.IO · EventEmitter · Redis · BullMQ

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB (Local or Atlas)
- Redis (Optional for queues)

### 2. Environment Setup
```bash
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car_dealership
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Installation
```bash
# Backend
cd backend
npm install
npm run seed

# Frontend  
cd frontend
npm install
```

### 4. Run
```bash
# Backend (Port 5000)
cd backend
npm run dev

# Frontend (Port 5173)
cd frontend  
npm run dev
```

## 🔐 Demo Accounts

**Admin:** `admin@autoluxe.com` / `Admin123!`
**Customer:** `john@example.com` / `Customer123!`

## 📞 Real-Time Features

### Live Chat
- Customer ↔ Dealer instant messaging
- Typing indicators
- Message history

### Live Notifications
- Booking confirmations
- Chat messages
- Status updates

### Event System
- Automatic notifications on actions
- Email queue processing
- Activity logging

## 🔧 System Architecture

### Backend Layers
- **API Layer** — REST endpoints with validation
- **Socket Layer** — Real-time communication
- **Event Layer** — Automatic action triggers
- **Queue Layer** — Background job processing
- **Database Layer** — MongoDB with Mongoose

### Frontend Structure
- **Public Pages** — Showroom, search, car details
- **Customer Dashboard** — Bookings, chat, favorites
- **Admin Dashboard** — Inventory, bookings, customers

## 📋 Key Models

- **User** — Customers and admin accounts
- **Car** — Vehicle inventory with images
- **TestDrive** — Booking system with status
- **Message** — Chat conversations
- **Notification** — Real-time alerts
- **Inquiry** — Customer inquiries

## 🛡️ Security Features

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- File upload security with Multer

## 📱 Mobile Responsive

- All pages optimized for mobile
- Touch-friendly interfaces
- Adaptive layouts for all devices

## 🚦 Deployment Ready

- Environment-based configuration
- Production error handling
- Graceful Redis fallback
- Optimized build process

## 📊 Monitoring & Logging

- Real-time socket connection tracking
- Queue job processing logs
- API request logging
- Error tracking and reporting

---

**Note:** Redis is optional. System includes fallback mechanisms when Redis is unavailable.
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
