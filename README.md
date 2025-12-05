# Physio Vision

An AI-powered physiotherapy prescription and exercise tracking platform that helps physiotherapists create personalized treatment plans and monitor patient progress.

## Features

- **Doctor Dashboard**: Voice-powered prescription creation with AI dictation
- **Patient View**: Interactive exercise tracking with real-time pose detection using MediaPipe
- **Exercise Library**: Comprehensive collection of physiotherapy exercises
- **Progress Tracking**: Monitor patient compliance and exercise completion

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **MediaPipe** - Pose detection and tracking
- **React Hook Form** - Form management
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone https://github.com/Khyati41/physiovision.git

# Navigate to the project directory
cd physiovision

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
physiovision/
├── src/
│   ├── components/
│   │   ├── doctor/        # Doctor dashboard components
│   │   ├── patient/       # Patient view components
│   │   └── ui/            # shadcn-ui components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── pages/             # Page components
├── public/                # Static assets
└── ...
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.
