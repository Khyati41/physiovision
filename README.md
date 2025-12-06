# Physio Vision

An AI-powered physiotherapy prescription and exercise tracking platform that helps physiotherapists create personalized treatment plans and monitor patient progress.

## ✨ Features

### For Doctors
- **Separate Sign-Up/Sign-In**: Dedicated authentication flow for healthcare professionals
- **AI-Powered Prescription**: Voice dictation and AI-generated exercise plans
- **Real-time Stats**: Track active patients, plans created, and completion rates
- **Easy Prescription Creation**: Create and send exercise plans instantly

### For Patients
- **Secure Patient Portal**: Separate authentication for patients
- **Exercise Plans**: View prescriptions assigned by doctors
- **Progress Tracking**: Monitor completed exercises and overall progress
- **Interactive UI**: Beautiful, mobile-friendly interface

## 🛠 Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **MediaPipe** - Pose detection and tracking
- **React Hook Form** - Form management
- **Zod** - Schema validation

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher) & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

1. **Clone the repository**
```sh
git clone https://github.com/Khyati41/physiovision.git
cd physiovision
```

2. **Install dependencies**
```sh
npm install
```

3. **Start the development server**
```sh
npm run dev
```

The app will be available at `http://localhost:8080`

## 📖 Usage

### Doctor Workflow

1. **Sign Up**: Go to `/doctor/signup` and create a doctor account with your medical license number
2. **Sign In**: Access your dashboard at `/doctor/signin`
3. **Create Prescription**: 
   - Dictate or type clinical notes
   - AI generates an exercise plan
   - Review and customize exercises
   - Send prescription to patient
4. **Track Progress**: View stats on active patients and completion rates

### Patient Workflow

1. **Sign Up**: Go to `/patient/signup` and create a patient account
2. **Sign In**: Access your exercise plan at `/patient/signin`
3. **View Exercises**: See prescriptions assigned by your doctor
4. **Complete Exercises**: Click play to start an exercise and track progress
5. **Monitor Progress**: View completion stats

## 📁 Project Structure

```
physiovision/
├── src/
│   ├── components/
│   │   ├── doctor/              # Doctor dashboard components
│   │   │   ├── DoctorDashboard.tsx
│   │   │   ├── DictationInput.tsx
│   │   │   └── PrescriptionCard.tsx
│   │   ├── patient/             # Patient view components
│   │   │   ├── PatientView.tsx
│   │   │   └── ExerciseModal.tsx
│   │   ├── ui/                  # shadcn-ui components
│   │   ├── Header.tsx           # Main header with auth
│   │   └── ProtectedRoute.tsx   # Route protection
│   ├── context/
│   │   └── PhysioContext.tsx    # Global state + Supabase integration
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client setup
│   │   └── utils.ts             # Utility functions
│   ├── pages/
│   │   ├── auth/                # Authentication pages
│   │   │   ├── DoctorSignIn.tsx
│   │   │   ├── DoctorSignUp.tsx
│   │   │   ├── PatientSignIn.tsx
│   │   │   └── PatientSignUp.tsx
│   │   ├── Landing.tsx          # Landing page with role selection
│   │   ├── DoctorDashboard.tsx  # Doctor dashboard page
│   │   ├── PatientDashboard.tsx # Patient dashboard page
│   │   └── NotFound.tsx         # 404 page
│   ├── App.tsx                  # Main app with routing
│   └── main.tsx                 # Entry point
├── public/
│   └── favicon.svg              # App icon
├── SUPABASE_SETUP.md            # Detailed Supabase setup guide
├── env-template.txt             # Environment variables template
└── README.md                    # This file
```

## 💾 Data Persistence

All data is stored in browser **localStorage**, including:
- ✅ User accounts (email/password)
- ✅ Authentication state (stays logged in after refresh)
- ✅ Appointments
- ✅ Exercise prescriptions
- ✅ Patient plans

**Debug Utilities** (available in browser console):
```javascript
PhysioVision.clearAllData()     // Clear all data and restart
PhysioVision.exportData()        // Export data as JSON
PhysioVision.getStorageInfo()    // View storage usage
```

## 🔒 Security Features

- **Separate Authentication**: Different sign-up/sign-in for doctors and patients
- **Role-based Access**: Separate routes for doctors and patients
- **Protected Routes**: Authentication required for dashboards
- **Persistent Sessions**: Stay logged in across page refreshes

## 📜 Available Scripts

- `npm run dev` - Start development server (port 8080)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Authentication not working
- Make sure you've created an account via sign-up first
- Use the same email and password you signed up with
- Data persists in localStorage - clear browser data if needed

### Data not saving
- Check if localStorage is enabled in your browser
- Some browsers in private/incognito mode may not persist localStorage
- Use `PhysioVision.getStorageInfo()` in console to check storage

### Need to reset everything
- Open browser console (F12)
- Run: `PhysioVision.clearAllData()`
- This will clear all data and reload the app

### Exercises not showing
- Doctor needs to create and send prescription first
- Check the Prescriptions tab to send exercises to patients

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Pose detection by [MediaPipe](https://mediapipe.dev/)
