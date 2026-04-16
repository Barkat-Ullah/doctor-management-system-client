# 🏥 Novena Doctor Management System

A comprehensive healthcare management platform built with Next.js, featuring role-based access control for patients, doctors, and administrators.

![Novena Doctor Management](https://i.ibb.co/Fqd7dv1s/Novena-Doctor-Appointment-Booking-06-24-2025-08-07-PM.png)

## 🌟 Live Demo

**🔗 [View Live Application](https://doctor-management-novena.vercel.app)**

## 🔐 Demo Credentials

### Patient Access
- **Email:** `patient@gmail.com`
- **Password:** `patient123`

### Doctor Access
- **Email:** `doctor3@mail.com`
- **Password:** `doctor123`

### Admin Access
- **Email:** `admin@mail.com`
- **Password:** `admin123`

## ✨ Key Features

### 👨‍⚕️ For Doctors
- **Dashboard Overview** - Comprehensive analytics and insights
- **Schedule Management** - Create, update, and manage appointments
- **Patient Records** - Access and update patient information
- **Profile Management** - Update professional details and credentials
- **Appointment History** - Track past and upcoming consultations

### 👤 For Patients
- **Book Appointments** - Easy scheduling with preferred doctors
- **Medical History** - Access personal health records
- **Profile Management** - Update personal information and preferences
- **Appointment Tracking** - View upcoming and past appointments
- **Health Blog Access** - Educational content and health tips

### 👨‍💼 For Administrators
- **User Management** - Manage doctors, patients, and staff
- **System Analytics** - Comprehensive reporting and insights
- **Content Management** - Update website content and blog posts
- **Payment Processing** - Handle billing and payment transactions
- **System Configuration** - Manage application settings
- **Medicine Managment** - Manage application Medicine

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Context + Hooks

### Backend & Database
- **API:** Express Js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Custom
- **File Upload:** Cloudinary

### Payment Integration
- **Payment Gateway:** SSL Commerce
- **Currency:** BDT (Bangladeshi Taka)
- **Features:** Secure payment processing with success/failure handling

### Deployment & DevOps
- **Hosting:** Vercel
- **Database:** NeonDB
- **CDN:** Cloudinary for media assets
- **Monitoring:** Vercel Analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL Database

### Installation

1. **Clone the client repository**
```bash
git clone https://github.com/Barkat-Ullah/doctor-management-system-client
cd doctor-management-novena
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```env

NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_IMAGE_HOSTING_KEY=""
NEXT_PUBLIC_CLIENT_SECRET=""
NEXT_PUBLIC_SERVER_SECRET=""

//videoId
NEXT_PUBLIC_AGORA_APP_ID=""

```

Open [http://localhost:3000](http://localhost:3000) to view the application.

. **Clone the server repository**
```bash
git clone https://github.com/Barkat-Ullah/doctor-management-backend
cd doctor-management-backend
```
5. **Database Setup .env**
```bash
# DATABASE_URL=""
NODE_ENV="development"
PORT=5000
JWT_SECRET=""
EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=""
REFRESH_TOKEN_EXPIRES_IN=30d
RESET_PASS_TOKEN=""
RESET_PASS_TOKEN_EXPIRES_IN=5m
RESET_PASS_LINK="https://localhost:3000/reset-pass"
EMAIL=""
APP_PASS=""
# SSL Commerce (Payment)
STORE_ID =""
STORE_PASS =""
SUCCESS_URL = "http://localhost:3000/success"
CANCEL_URL = "http://localhost:3030/cancel"
FAIL_URL = "http://localhost:3030/fail"
SSL_PAYMENT_API = ""
SSL_VALIDATIOIN_API = ""
# Cloudinary
CLOUDINARY_CLOUD_NAME=dqvxeyzat
CLOUDINARY_API_KEY=453134649918479
CLOUDINARY_API_SECRET=TsG1evMcXY6oSNRm7XnIQQSA50g
#for production
FRONTEND_URL=""
BACKEND_URL=""
```

6. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:5000](http://localhost:5000) to view the application.

## 📱 Features Overview

### 🔐 Authentication & Authorization
- Role-based access control (Patient, Doctor, Admin)
- Secure login/logout functionality
- Password reset and email verification

### 📅 Appointment Management
- Real-time appointment scheduling
- Calendar integration
- Automated notifications
- Conflict detection and resolution

### 💳 Payment Processing
- Secure SSL Commerce integration
- Multiple payment methods
- Transaction history
- Automated receipt generation

### 📊 Analytics & Reporting
- Dashboard analytics for all user roles
- Appointment statistics
- Revenue tracking
- User engagement metrics

### 📱 Responsive Design
- Mobile-first approach
- Cross-browser compatibility
- Progressive Web App (PWA) features
- Optimized performance

## 🏗️ Project Structure

```
doctor-management-novena/
├── app/                    # Next.js App Router
│   ├── (withCommonLayout)/ # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/                # Shadcn/ui components
│   ├── auth/              # Authentication components
│   └── dashboard/         # Dashboard components
├── lib/                   # Utility functions
│   ├── auth.ts            # Authentication config
│   ├── db.ts              # Database connection
│   └── utils.ts           # Helper functions
├── services/              # API service functions
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── prisma/                # Database schema
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Shadcn/ui** - For the beautiful UI components
- **SSL Commerce** - For secure payment processing
- **Vercel** - For seamless deployment platform

---

<div align="center">
  <p>Built with ❤️ for better healthcare management</p>
  <p>© 2024 Novena Doctor Management System</p>
</div>

```

This README provides a comprehensive overview of your doctor management application with:

- **Professional presentation** with badges and emojis
- **Clear demo credentials** for easy testing
- **Detailed feature breakdown** by user role
- **Complete tech stack** information
- **Step-by-step setup** instructions
- **Project structure** overview
- **Contributing guidelines**
- **Professional formatting** with proper sections

The README is designed to attract contributors and users while providing all necessary information for setup and usage.

