# Spotlight Backend

RESTful API backend built with **Node.js**, **Express**, and **Prisma**.
The architecture follows **Clean Architecture** and **Hexagonal (Ports & Adapters)**
principles for high testability, scalability, and maintainability.

Used by [spotlight-frontend](https://github.com/Teruakii/spotlight-frontend).

## Tech Stack

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Jest](https://jestjs.io/) for testing

## Project Structure

```
.
├── prisma/            # Prisma schema and migrations
├── src/               # Application source code
├── tests/
│   └── domain/        # Domain layer unit tests
├── .env.example       # Example environment variables
├── jest.config.js     # Jest configuration
├── prisma.config.js   # Prisma configuration
└── server.js          # Application entry point
```

## Architecture

The project separates concerns into layers, with dependencies pointing inward:

- **Domain** – entities and core business rules, independent of any framework
- **Application** – use cases that orchestrate the domain
- **Adapters** – HTTP (Express) and persistence (Prisma) implementations

Ports define what the core needs, and adapters implement them. This makes it easy
to swap infrastructure and to test business logic in isolation.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A database supported by Prisma

### Installation

```bash
git clone https://github.com/Teruakii/spotlight-backend.git
cd spotlight-backend
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

Then edit `.env` with your own values (for example `DATABASE_URL`).

### Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### Run the Server

```bash
npm start
```

## Testing

```bash
npm test
```

## Related Projects

- [spotlight-frontend](https://github.com/Teruakii/spotlight-frontend) – Next.js + Tailwind CSS web app

## License

MIT
