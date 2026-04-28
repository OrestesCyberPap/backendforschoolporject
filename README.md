# Theatre Booking Mobile App - Backend

Αυτό είναι το Backend API για την εφαρμογή κράτησης θέσεων σε θεατρικές παραστάσεις. 
Αναπτύχθηκε με Node.js, Express και MariaDB.

## 📜 Changelog (Ιστορικό Αλλαγών)

### Ημέρα 1η: [28-04-2026] (Ολοκληρώθηκε το Backend)
- **[Setup]** Δημιουργία δομής Backend (Express.js, nodemon, dotenv).
- **[Database]** Σχεδιασμός πινάκων στη MariaDB (`users`, `theatres`, `shows`, `showtimes`, `reservations`) και αυτόματη εισαγωγή mock δεδομένων (database.sql).
- **[Security]** Προσθήκη JWT (JSON Web Tokens) για ασφαλή ταυτοποίηση των endpoints και Bcrypt για hashing των κωδικών των χρηστών.
- **[API Routes]** Ολοκληρώθηκαν τα:
  - `POST /api/auth/register` & `/login` (Auth)
  - `GET /api/theatres` & `GET /api/shows` (Public)
  - `POST /api/reservations` & `GET /api/reservations/user` (Protected via JWT)
- **[Git]** Αρχικοποίηση Git και Push στο GitHub repository.

---
*Σημείωση: Το αρχείο αυτό θα ενημερώνεται αυτόματα με κάθε νέα σημαντική προσθήκη στο σύστημα (όπως το Frontend).*
