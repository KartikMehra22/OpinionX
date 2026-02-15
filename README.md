# OpinionX

OpinionX is a premium, full-stack polling platform designed for seamless user interaction and real-time insights. Built with a modern monorepo architecture, it offers a high-performance experience for both users and administrators.

![OpinionX Banner](https://images.unsplash.com/photo-1540910419892-f0c74b0e8966?q=80&w=2070&auto=format&fit=crop)

## 🚀 Key Features

- **Google OAuth 2.0**: Secure and effortless social login.
- **Role-Based Access Control (RBAC)**: 
  - **Admins**: Exclusive rights to create polls, manage platform activity, and access the global Admin Panel.
  - **Users**: Personal dashboard to track participation and vote on active polls.
- **Real-Time Analytics**: Instant vote counts and platform metrics.
- **Modern UI/UX**: Built with Framer Motion for smooth animations and Tailwind CSS 4 for a sleek, glassmorphic aesthetic.
- **Scalable Infrastructure**: Powered by Prisma Accelerate for optimized database performance.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: [Express 5](https://expressjs.com/)
- **Database ORM**: [Prisma 5.22.0](https://www.prisma.io/)
- **Database**: PostgreSQL (via Prisma Accelerate)
- **Authentication**: Passport.js (Google Strategy)
- **Session Management**: express-session with PostgreSQL store
- **Real-Time**: Socket.io

## 📦 Project Structure

OpinionX uses **PNPM Workspaces** to manage the monorepo:

```text
OpinionX/
├── apps/
│   ├── frontend/     # Next.js web application
│   └── backend/      # Express API server & Prisma schema
├── packages/
│   ├── types/        # Shared TypeScript definitions
│   ├── ui/           # Shared UI components
│   └── utils/        # Shared utility functions
└── package.json      # Workspace configuration
```

## ⚙️ Setup & Installation

### Prerequisites
- [PNPM](https://pnpm.io/) (v10.29.3+)
- Node.js (v20+)
- Google Cloud Console project for OAuth credentials
- Prisma Accelerate / PostgreSQL database

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KartikMehra22/OpinionX.git
   cd OpinionX
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `apps/backend/` and `apps/frontend/` based on the provided setup.

   **Backend (`apps/backend/.env`):**
   ```env
   DATABASE_URL="your-prisma-accelerate-url"
   DIRECT_URL="your-direct-postgres-url"
   SESSION_SECRET="your-secret"
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   FRONTEND_LOCAL_URL="http://localhost:3000"
   FRONTEND_SERVER_URL="your-deployed-frontend-url"
   NODE_ENV="development"
   ```

4. **Initialize Database**:
   ```bash
   cd apps/backend
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

5. **Run the Application**:
   Open two terminals or use a task runner:
   
   **Frontend:**
   ```bash
   cd apps/frontend
   pnpm run dev
   ```

   **Backend:**
   ```bash
   cd apps/backend
   pnpm run dev
   ```

## 🛡 License
This project is licensed under the ISC License.

---
Built with ❤️ by [Kartik Mehra](https://github.com/KartikMehra22)