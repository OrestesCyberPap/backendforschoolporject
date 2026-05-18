# 🎭 Theatre Booking System
### Mobile & Distributed Systems (CN6035)
> Εφαρμογή κράτησης θέσεων σε θεατρικές παραστάσεις μέσω κινητής συσκευής

---

## 📐 Αρχιτεκτονική Συστήματος

```
┌──────────────────┐     HTTP/REST      ┌──────────────────┐     SQL        ┌──────────────┐
│   React Native   │ ◄──────────────── │   Node.js +      │ ◄──────────── │   MariaDB    │
│   (Expo)         │   JSON + JWT       │   Express API    │   Queries     │   Database   │
│   Mobile App     │ ──────────────── │                  │ ──────────── │              │
└──────────────────┘                    └──────────────────┘               └──────────────┘
     Frontend                               Backend                         Database
```

## 🛠️ Τεχνολογίες

| Layer | Τεχνολογία |
|-------|-----------|
| Frontend | React Native (Expo), React Navigation, Axios, Expo SecureStore |
| Backend | Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt |
| Database | MariaDB |
| Tools | Git/GitHub, Postman, VS Code |

---

## ⚡ Οδηγίες Εγκατάστασης & Εκτέλεσης

### Προαπαιτούμενα
- [Node.js](https://nodejs.org/) (v18+)
- [MariaDB](https://mariadb.org/) ή XAMPP (με MariaDB service ενεργό)
- [Expo Go](https://expo.dev/client) εγκατεστημένο στο κινητό (Android/iOS)
- Ο υπολογιστής και το κινητό πρέπει να είναι στο **ίδιο Wi-Fi δίκτυο**

---

### Βήμα 1: Κλωνοποίηση Repository

```bash
git clone https://github.com/OrestesCyberPap/backendforschoolporject.git
cd backendforschoolporject
```

---

### Βήμα 2: Ρύθμιση Βάσης Δεδομένων (MariaDB)

1. Ανοίξτε ένα MariaDB client (π.χ. HeidiSQL, MySQL Workbench, ή τερματικό):
```bash
mysql -u root -p
```

2. Εκτελέστε το αρχείο SQL για να δημιουργηθούν οι πίνακες και τα δοκιμαστικά δεδομένα:
```sql
SOURCE database.sql;
```

Εναλλακτικά, αντιγράψτε-επικολλήστε το περιεχόμενο του `database.sql` στο query editor.

> **Πίνακες που δημιουργούνται:** `users`, `theatres`, `shows`, `showtimes`, `reservations`

---

### Βήμα 3: Ρύθμιση Backend

1. Μεταβείτε στον φάκελο backend (root του repo):
```bash
cd backendforschoolporject
```

2. Εγκαταστήστε τα dependencies:
```bash
npm install
```

3. Δημιουργήστε ένα αρχείο `.env` στον root φάκελο:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MARIADB_PASSWORD
DB_NAME=theatre_booking_db
JWT_SECRET=your_secret_key_here
```

4. Ξεκινήστε τον server:
```bash
npm run dev
```

✅ Θα πρέπει να δείτε: `Server is running on port 3000`

---

### Βήμα 4: Ρύθμιση Frontend (React Native)

1. Ανοίξτε ένα **νέο τερματικό** και μεταβείτε στον φάκελο frontend:
```bash
cd frontend
```

2. Εγκαταστήστε τα dependencies:
```bash
npm install
```

3. **Σημαντικό:** Βρείτε την IP του υπολογιστή σας:
```bash
# Windows
ipconfig
# Ψάξτε το "IPv4 Address" (π.χ. 192.168.1.174)
```

4. Ανοίξτε το αρχείο `frontend/src/api/api.js` και αλλάξτε την IP:
```javascript
const API_URL = 'http://YOUR_IP_HERE:3000/api';
// π.χ. const API_URL = 'http://192.168.1.174:3000/api';
```

5. Ξεκινήστε το Expo:
```bash
npx expo start
```

6. Σκανάρετε το QR Code με την εφαρμογή **Expo Go** στο κινητό σας.

---

## 📱 Λειτουργίες Εφαρμογής

### Authentication (Ταυτοποίηση)
- Εγγραφή νέου χρήστη (email + password)
- Σύνδεση με JWT token
- Ασφαλής αποθήκευση token στη συσκευή (Expo SecureStore)
- Αυτόματη επισύναψη token σε κάθε αίτημα (Axios Interceptor)

### Παραστάσεις & Θέατρα
- Προβολή λίστας θεάτρων και παραστάσεων
- Λεπτομέρειες παράστασης (Synopsis, Cast, Τιμή)
- Επιλογή ημερομηνίας και ώρας

### Κράτηση Θέσεων
- Διαδραστικός χάρτης θέσεων (Seat Map)
- 3 καταστάσεις θέσεων: Διαθέσιμη, Επιλεγμένη, Κρατημένη
- Real-time υπολογισμός κόστους
- Φόρμα πληρωμής (Checkout)

### Προφίλ Χρήστη
- Προβολή ιστορικού κρατήσεων (My Tickets)
- QR Code εισιτηρίου

---

## 🔌 API Endpoints

### Public (Χωρίς Authentication)
| Method | Endpoint | Περιγραφή |
|--------|----------|-----------|
| POST | `/api/auth/register` | Εγγραφή χρήστη |
| POST | `/api/auth/login` | Σύνδεση (επιστρέφει JWT) |
| GET | `/api/theatres` | Λίστα θεάτρων |
| GET | `/api/shows` | Λίστα παραστάσεων |
| GET | `/api/shows?title=X` | Αναζήτηση παράστασης |
| GET | `/api/shows/:id/showtimes` | Ημερομηνίες/ώρες παράστασης |

### Protected (Απαιτείται JWT Token)
| Method | Endpoint | Περιγραφή |
|--------|----------|-----------|
| POST | `/api/reservations` | Δημιουργία κράτησης |
| GET | `/api/reservations/user` | Κρατήσεις χρήστη |
| DELETE | `/api/reservations/:id` | Ακύρωση κράτησης |

---

## 🗄️ Δομή Βάσης Δεδομένων

```sql
users (user_id PK, name, email UNIQUE, password_hash, created_at)
  │
  └── reservations (reservation_id PK, user_id FK, showtime_id FK, number_of_tickets, created_at)
                                          │
theatres (theatre_id PK, name, location, description)
  │
  └── shows (show_id PK, theatre_id FK, title, description, duration, age_rating)
              │
              └── showtimes (showtime_id PK, show_id FK, date_time, price)
```

---

## 📂 Δομή Φακέλων

```
backendforschoolporject/
│
├── config/
│   └── db.js                  # Σύνδεση MariaDB (connection pool)
├── controllers/
│   ├── authController.js      # Register & Login logic
│   ├── theatreController.js   # Theatre queries
│   ├── showController.js      # Shows & Showtimes queries
│   └── reservationController.js # Reservation CRUD
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
├── routes/
│   ├── authRoutes.js
│   ├── theatreRoutes.js
│   ├── showRoutes.js
│   └── reservationRoutes.js
├── frontend/                  # React Native Mobile App
│   ├── App.js                 # Navigation & Auth State
│   └── src/
│       ├── api/api.js         # Axios + JWT Interceptor
│       ├── context/AuthContext.js # Auth State Management
│       └── screens/
│           ├── LoginScreen.js
│           ├── RegisterScreen.js
│           ├── HomeScreen.js
│           ├── ShowDetailsScreen.js
│           ├── SeatSelectionScreen.js
│           ├── CheckoutScreen.js
│           └── MyTicketsScreen.js
├── server.js                  # Express entry point
├── database.sql               # Full DB schema + mock data
├── package.json
├── .env                       # Environment variables (not in repo)
└── README.md                  # This file
```

---

## 🔐 Ασφάλεια

- **Passwords:** Κρυπτογραφημένα με Bcrypt (salt rounds: 10)
- **Authentication:** JWT tokens (10h expiry)
- **Mobile Storage:** Expo SecureStore (κρυπτογραφημένο στο Keychain/Keystore)
- **API Protection:** Middleware ελέγχει JWT σε κάθε protected endpoint
- **SQL Injection:** Parameterized queries (prepared statements)

---

## 📜 Changelog

### v2.0 — [18-05-2026] Frontend Implementation
- **[Frontend]** Δημιουργία React Native (Expo) mobile app
- **[Screens]** Login, Register, Home, ShowDetails, SeatSelection, Checkout, MyTickets
- **[Security]** JWT token αποθήκευση μέσω Expo SecureStore
- **[Navigation]** Protected navigation (αυτόματο redirect αν δεν υπάρχει token)
- **[UI/UX]** Dark mode σχεδιασμός με κινηματογραφική αισθητική

### v1.0 — [28-04-2026] Backend & Database
- **[Setup]** Δημιουργία δομής Backend (Express.js, nodemon, dotenv)
- **[Database]** Σχεδιασμός πινάκων MariaDB με FK relationships
- **[Security]** JWT + Bcrypt authentication
- **[API]** REST endpoints για auth, theatres, shows, reservations
- **[Git]** Αρχικοποίηση Git repository

---

## 👤 Φοιτητής

**Μάθημα:** Mobile & Distributed Systems (CN6035)  
**Εργασία:** Ανάπτυξη Εφαρμογής Κράτησης Θέσεων σε Θεατρικές Παραστάσεις
