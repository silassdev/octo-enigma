# 📦 Micro-CRM

Micro-CRM is a sleek, all-in-one CRM, Invoicing, and Expense manager designed specifically for freelancers. It combines lead management, project tracking, professional billing, and expense logging into a single, high-performance web dashboard.

## 🚀 Features

### Smart CRM
Manage your contacts with tags and status tracking. Seamlessly transition leads into clients as you close deals.

### Project & Task Tracking
Keep your work organized with dedicated project boards, due dates, and budget tracking.

### Professional Invoicing
Create detailed invoices with custom line items, automated tax calculation, and professional PDF generation (serverless).

### Expense Management
Log business expenses, categorize spending, and snapshot receipts to keep your accounts tax-ready.

### Real-time Analytics
Visualize your business health with revenue trends, expense reports, and profit margins.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Framer Motion |
| **Backend** | Firebase Cloud Functions (Node.js) |
| **Database** | Firebase Firestore (Real-time NoSQL) |
| **Auth** | Firebase Auth (Google & Email/Password) |
| **Storage** | Firebase Storage (Receipts & PDFs) |
| **Payments** | Stripe Integration |

---

## 📂 Project Structure

- `/web`: Next.js dashboard and landing page.
- `/functions`: Firebase Cloud Functions for heavy lifting (PDFs, Webhooks).
- `/android`: Native Android app for on-the-go management (Future).

---

## 🛠️ Getting Started

1. **Clone the repository**
2. **Setup Firebase**: Create a project in Firebase Console and grab your config.
3. **Environment Variables**: Create a `.env.local` in `/web` with:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   // etc
   ```
4. **Install & Run**:
   ```bash
   cd web
   npm install
   npm run dev
   ```

---

## 🛡️ Best Practices
Built with **TypeScript** for type-safety, **Firebase Rules** for data security, and **Tailwind CSS** for a premium, responsive UI experience.