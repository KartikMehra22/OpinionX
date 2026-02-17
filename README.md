# OpinionX

OpinionX is a high-performance, real-time polling platform designed for speed, anonymity, and seamless interaction. It allows anyone to create polls and collect instant feedback without the friction of authentication.

## 🚀 Key Features

- **Anonymous Polling**: No sign-up required. Users are tracked via secure, persistent `voterId` cookies.
- **Real-Time Updates**: Instant vote counts powered by WebSockets (Socket.io).
- **Fair Voting**: Multi-layered protection against double voting using browser `localStorage`, secure cookies, and database constraints.
- **Modern UI/UX**: A sleek, minimalist interface built with Inter typography and smooth Framer Motion animations.
- **Monorepo Architecture**: Cleanly separated frontend and backend for maximum scalability.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Real-Time**: [Socket.io Client](https://socket.io/)
- **API Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: Node.js
- **Framework**: [Express 5](https://expressjs.com/)
- **Database ORM**: [Prisma 5.22.0](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Real-Time**: [Socket.io](https://socket.io/)
- **Voter Tracking**: UUID + Cookie-based identification

##  Project Structure

```text
OpinionX/
├── apps/
│   ├── frontend/     # Next.js 16 application
│   └── backend/      # Express 5 API & Prisma schema
├── packages/
│   ├── types/        # Shared TypeScript definitions
│   ├── ui/           # Shared UI components
│   └── utils/        # Shared utility functions
└── package.json      # PNPM Workspaces configuration
```

##  Setup & Installation

### Prerequisites
- [PNPM](https://pnpm.io/) (v10.29.3+)
- Node.js (v20+)
- PostgreSQL Database

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

3. **Configure Environment**:

   **Backend (`apps/backend/.env`):**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/opinionx"
   DIRECT_URL="postgresql://user:password@localhost:5432/opinionx"
   SERVER_PORT=5001
   FRONTEND_LOCAL_URL="http://localhost:3000"
   ```

   **Frontend (`apps/frontend/.env`):**
   ```env
   NEXT_PUBLIC_BACKEND_LOCAL_URL="http://localhost:5001"
   ```

4. **Initialize Database**:
   ```bash
   cd apps/backend
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

5. **Run Development Servers**:
   ```bash
   # In root directory
   pnpm --filter frontend dev
   pnpm --filter backend dev
   ```

##  License
This project is licensed under the ISC License.

---
Built with ❤️ by [Kartik Mehra](https://github.com/KartikMehra22)
