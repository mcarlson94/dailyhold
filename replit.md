# DailyHold.co

## Overview

DailyHold.co is a mobile-friendly web application that presents users with a daily 1-minute hold challenge. Users click a START button to begin a 60-second countdown timer, and upon completion, they can share their achievement via the Web Share API or clipboard. The app tracks daily completion using localStorage and shows a countdown to the next available challenge at midnight.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth transitions and timer animations
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: Minimal REST API (primarily `/api/status` endpoint)
- **Core Logic Location**: Client-side (timer, localStorage persistence)

### Data Storage
- **Primary Storage**: Browser localStorage for tracking daily completion
- **Database**: PostgreSQL with Drizzle ORM (minimal usage - schema exists for future user sync features)
- **Schema Location**: `shared/schema.ts`

### Key Design Decisions

1. **Client-Side Logic**: Timer functionality and completion tracking are entirely client-side using localStorage. This reduces server load and provides instant feedback.

2. **Monorepo Structure**: Single repository with clear separation:
   - `client/` - React frontend application
   - `server/` - Express backend
   - `shared/` - Shared types, schemas, and route definitions

3. **Path Aliases**: TypeScript path aliases configured for clean imports:
   - `@/` → `client/src/`
   - `@shared/` → `shared/`
   - `@assets/` → `attached_assets/`

4. **Build Process**: Custom build script (`script/build.ts`) that bundles the server with esbuild and client with Vite.

## External Dependencies

### Database
- **PostgreSQL**: Connected via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit for type-safe queries
- **connect-pg-simple**: Session storage (available if needed)

### Frontend Libraries
- **date-fns**: Date manipulation for countdown calculations
- **canvas-confetti**: Celebration effects on timer completion
- **lucide-react**: Icon library

### Development Tools
- **Vite**: Development server with HMR
- **Replit plugins**: Runtime error overlay, cartographer, dev banner (development only)