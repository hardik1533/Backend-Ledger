# 💳 Backend Ledger

> ⚡ A **production-ready financial ledger & transaction REST API** built with **Node.js, Express.js, MongoDB, and Mongoose**.  
> Secure 🔐 | Atomic 💰 | Idempotent 🔄 | Immutable 🛡️ | Deployed 🚀

---

## 🌐 Live Demo

- **API Endpoint** → [backend-ledger-jim8.onrender.com](https://backend-ledger-jim8.onrender.com)  
- **GitHub Repo** → [Backend-Ledger](https://github.com/hardik1533/Backend-Ledger)  
- **Testing Tool** → Postman ✅

---

## ✨ Features

### 🔐 Authentication & Security
- User registration & login  
- Secure password hashing (**bcrypt**)  
- JWT-based authentication + HTTP-only cookies  
- Token blacklist mechanism for logout  
- Protected routes + system-user authorization  

### 👤 User Management
- Unique email validation  
- Secure password storage  
- JWT session management  
- User timestamps  

### 🏦 Account Management
- Create & fetch accounts  
- Account ownership validation  
- Statuses: `ACTIVE` | `FROZEN` | `CLOSED`  
- INR as default currency 💵  
- Ledger-based balance calculation  

### 💰 Ledger-Based Balance
Balances are **derived from immutable ledger entries**:

```text
Balance = Total Credits - Total Debits
```

Example:

```text
Account A
 ├── CREDIT ₹10,000
 ├── DEBIT ₹100
 └── DEBIT ₹500
Balance = ₹9,400
```

---

### 🔄 Atomic Transactions
- MongoDB sessions & transactions  
- Rollback on failure  
- Idempotency key to prevent duplicates  

### 📊 Transaction Lifecycle
`PENDING` → `COMPLETED` → `FAILED` → `REVERSED`

### 🛡️ Immutable Ledger
- No update/delete allowed  
- Debit & credit entries per transaction  

### 🏛️ System Initial Funds
- Protected endpoint for system-user fund injection  

### 📧 Email Notifications
- **Nodemailer + Gmail OAuth2**  
- Registration & transaction notifications  

### ⚡ Database Indexing
- Indexes on email, accounts, transactions, ledger  
- TTL index for expired blacklisted tokens  

---

## 🛠️ Tech Stack

| Category | Tools |
|----------|-------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth & Security | JWT, bcryptjs, Cookies, Middleware |
| Email | Nodemailer, Gmail OAuth2 |
| Testing | Postman |
| Deployment | Render |
| Dev Tools | Git, GitHub, VS Code, npm |

---

## 🏗️ Project Architecture

```text
Backend-Ledger/
 ├── src/
 │   ├── config/ (db.js)
 │   ├── controllers/ (accounts, auth, transactions)
 │   ├── middleware/ (auth.middleware.js)
 │   ├── models/ (account, user, ledger, transaction, blacklist)
 │   ├── routes/ (accounts, auth, transactions)
 │   ├── services/ (email.service.js)
 │   └── app.js
 ├── server.js
 ├── package.json
 └── README.md
```

---

## 🔐 Authentication Flow

**Registration → Login → Protected Request**  
Flow includes password hashing, JWT generation, cookie setup, blacklist check, and middleware validation.

---

## 💳 Transaction Flow

```text
POST /api/transactions
   │ Validate Request
   │ Validate Accounts + Status
   │ Check Idempotency Key
   │ Calculate Balance
   │ Check Funds
   │ Start MongoDB Transaction
   │ Create Transaction Record
   ├── Debit Ledger
   └── Credit Ledger
   │ Mark COMPLETED
   │ Commit Transaction
   │ Send Notification
```

---

## 📚 Data Models

- **User** → name, email, hashed password, timestamps  
- **Account** → user ref, status, currency  
- **Transaction** → source, destination, amount, status, idempotencyKey  
- **Ledger** → account ref, transaction ref, amount, entry type (`CREDIT`/`DEBIT`)  
- **Blacklist** → invalidated JWTs (TTL auto-cleanup)  

---

## 🌐 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` → Register user  
- `POST /api/auth/login` → Login user  
- `POST /api/auth/logout` → Logout user  

### 🏦 Accounts
- `POST /api/accounts` → Create account  
- `GET /api/accounts` → Get all accounts  
- `GET /api/accounts/balance/:accountId` → Get balance  

### 💰 Transactions
- `POST /api/transactions` → Create transaction  
- `POST /api/transactions/system/initial-funds` → Add system funds  

---

## 🔧 Environment Variables

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
EMAIL_USER=your_email_address
```

⚠️ Never commit `.env` to GitHub.

---

## 💻 Local Setup

```bash
git clone https://github.com/hardik1533/Backend-Ledger.git
cd Backend-Ledger
npm install
npm run dev   # Development
npm start     # Production
```

Server → `http://localhost:3000`

---

## 🚀 Deployment

Deployed on **Render** → [Live API](https://backend-ledger-jim8.onrender.com)  
CI/CD enabled via GitHub → Render auto-deploy.

---

## 📈 Future Improvements

- Refresh token rotation  
- Rate limiting  
- Joi/Zod validation  
- Centralized error handling  
- Swagger/OpenAPI docs  
- Pagination for history  
- Docker + CI/CD pipeline  
- Audit logging  

---

## 👨‍💻 Author

**Hardik Vanza**  
Computer Engineering Student | Backend & Full-Stack Developer  

- GitHub → [hardik1533](https://github.com/hardik1533)  
- Project Repo → [Backend-Ledger](https://github.com/hardik1533/Backend-Ledger)  
- Live API → [backend-ledger-jim8.onrender.com](https://backend-ledger-jim8.onrender.com)  

---

## ⭐ Highlights

```text
✓ RESTful API
✓ Node.js + Express.js
✓ MongoDB + Mongoose
✓ JWT + Cookies
✓ Token Blacklisting
✓ Ledger-Based Balance
✓ Idempotent Transactions
✓ Atomic MongoDB Transactions
✓ Email Notifications
✓ Render Deployment
```

