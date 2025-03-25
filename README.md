# Camber Robotics' Battery Management System

[![NextJS](https://img.shields.io/badge/Built%20with-Next.js-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Redis](https://img.shields.io/badge/Database-Redis-DC382D?style=flat-square&logo=redis)](https://redis.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Style-TailwindCSS-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

A modern web application for FRC robotics teams to track, manage, and maintain their robot batteries. This system helps teams ensure they always have charged batteries ready for matches and practice sessions.

![Battery Management UI](https://camber-batteries.tajhans.com/preview.png)

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Customization Guide](#customization-guide)
  - [Adding More Batteries](#adding-more-batteries)
  - [Modifying Battery Statuses](#modifying-battery-statuses)
  - [Adding Additional Battery Data](#adding-additional-battery-data)
  - [Deployment](#deployment)
- [License](#license)

## Features

- Real-time battery status tracking (Charged, Charging, Needs Charging)
- Battery voltage monitoring
- Simple, intuitive UI for quick status updates
- Automatic data refreshing (every 10 seconds)
- Responsive design for use on various devices in the pit area

## Technology Stack

- **Frontend**: Next.js with React
- **Backend**: Next.js API Routes
- **Database**: Redis (via Upstash)
- **UI Components**: Custom components with Tailwind CSS
- **Form Management**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Upstash Redis account (or any Redis instance)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-team/frc-battery-manager.git
cd frc-battery-manager
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with your Redis credentials
```
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization Guide

### Adding More Batteries

Edit the `app/api/batteries/route.ts` file to change the number of default batteries:

```typescript
// Change the number in the Array.from to adjust battery count
const defaultBatteries = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    status: "needs-charging",
    voltage: 0,
}));
```

### Modifying Battery Statuses

To add or modify battery statuses, update the `batteryStatusSchema` in `lib/schema.ts`:

```typescript
export const batteryStatusSchema = z.enum([
    "charging",
    "needs-charging",
    "charged",
    "in-use",   // Added new status here
    "damaged"   // Added new status here
]);
```

Then update the UI in `components/battery-form.tsx` to include the new statuses in the radio group.

### Adding Additional Battery Data

To track additional information for each battery:

1. Update the `batterySchema` in `lib/schema.ts`:
```typescript
export const batterySchema = z.object({
    id: z.number(),
    status: batteryStatusSchema,
    voltage: z.number().min(0).max(50),
    cycleCount: z.number().optional(), // Add new field
    lastTestedDate: z.string().optional(), // Add new field
});
```

2. Update API handlers and UI components to use the new fields.

### Deployment

The application can be deployed to various platforms:

- Vercel (recommended for Next.js)
- Netlify
- Any platform supporting Node.js applications

Make sure to set the environment variables for your Redis instance on your hosting platform.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed with ❤️ for FRC teams. Feel free to submit issues or pull requests to help improve this tool!
