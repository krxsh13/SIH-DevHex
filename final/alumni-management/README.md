# Alumni Management System - Frontend

A modern, responsive alumni management platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Built with Radix UI components and Tailwind CSS
- **Authentication**: Complete login/signup system with role-based access
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-based Dashboards**: Different views for Admin, Alumni, and Students
- **Real-time Integration**: Connected to backend API

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env-config.txt .env.local
   ```
   Then edit `.env.local` and set your backend API URL.

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend Integration

The frontend is configured to work with the alumni management backend. Make sure your backend is running on the configured URL.

## 📱 Pages & Features

### Public Pages
- **Home**: Landing page with hero section and features
- **Login**: User authentication
- **Signup**: User registration with role selection

### Protected Pages (Requires Authentication)
- **Dashboard**: Role-specific dashboards
  - Admin Dashboard: User management, analytics
  - Alumni Dashboard: Profile, events, networking
  - Student Dashboard: Resources, mentorship
- **Profile**: User profile management
- **Directory**: Alumni directory with search/filter
- **Events**: Event listings and management
- **Jobs**: Job board and postings
- **News**: News feed and updates

## 🎨 UI Components

The project includes a comprehensive set of reusable UI components:

- **Forms**: Input, Select, Checkbox, Radio, etc.
- **Navigation**: Navbar, Sidebar, Breadcrumbs
- **Layout**: Cards, Modals, Sheets, Dialogs
- **Data Display**: Tables, Lists, Charts
- **Feedback**: Alerts, Toasts, Progress indicators

## 🔐 Authentication

The app uses JWT-based authentication with:

- **Login**: Email/password authentication
- **Signup**: Registration with role selection
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Role-based Access**: Different features based on user role
- **Session Management**: Persistent login with token refresh

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**Built with ❤️ for educational institutions**
