# Spotlight Frontend

A travel & dining guide web app built with **Next.js** and **Tailwind CSS**.
This is the frontend for [spotlight-backend](https://github.com/Teruakii/spotlight-backend).

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Project Structure

```
.
├── src/                  # Application source code
├── .env.local.example    # Example environment variables
├── jsconfig.json         # JS path aliases
├── next.config.mjs       # Next.js configuration
├── postcss.config.mjs    # PostCSS configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A running instance of [spotlight-backend](https://github.com/Teruakii/spotlight-backend)

### Installation

```bash
git clone https://github.com/Teruakii/spotlight-frontend.git
cd spotlight-frontend
npm install
```

### Environment Variables

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your own values.

| Variable | Description |
| -------- | ----------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Related Projects

- [spotlight-backend](https://github.com/Teruakii/spotlight-backend) – REST API (Node.js, Express, Prisma)

## License

MIT
