import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { SnackbarProvider } from "notistack";

// Theme and Styles
import theme from "./theme/index";
import "./styles/globals.css";
import "./styles/variables.css";
import "./styles/animations.css";
import "./styles/components.css";
import "./styles/responsive.css";

// Context Providers
import AuthProvider from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

// Layout Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LoadingScreen from "./components/common/LoadingScreen";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ChatWidget from "./components/common/ChatWidget";

// Lazy load pages for better performance
const Home = React.lazy(() => import("./pages/Home"));
const Services = React.lazy(() => import("./pages/Services"));
const ServiceDetails = React.lazy(() => import("./pages/ServiceDetails"));
// const WorkerProfile = React.lazy(() => import("./pages/WorkerProfile"));
const WorkerProfile = React.lazy(() =>
  import("./pages/WorkerProfile").catch(() => ({
    default: () => (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Worker Profile Loading...</Typography>
      </Box>
    ),
  }))
);
const Booking = React.lazy(() => import("./pages/Booking"));
const BookingConfirmation = React.lazy(() =>
  import("./pages/BookingConfirmation")
);
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const HowItWorks = React.lazy(() => import("./pages/HowItWorks"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Terms = React.lazy(() => import("./pages/Terms"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Auth Components
const Login = React.lazy(() => import("./components/auth/Login"));
const Register = React.lazy(() => import("./components/auth/Register"));
const ForgotPassword = React.lazy(() =>
  import("./components/auth/ForgotPassword")
);
const ResetPassword = React.lazy(() =>
  import("./components/auth/ResetPassword")
);
const VerifyOTP = React.lazy(() => import("./components/auth/VerifyOTP"));

// Dashboard Components
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const CustomerDashboard = React.lazy(() =>
  import("./components/customer/Dashboard")
);
const WorkerDashboard = React.lazy(() =>
  import("./components/worker/WorkerDashboard")
);
const AdminDashboard = React.lazy(() =>
  import("./components/admin/AdminDashboard")
);

// Protected Route Component
const ProtectedRoute = ({
  children,
  requiredRole = null,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();

  console.log("🔍 ProtectedRoute Check:", { isAuthenticated, loading, user });

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    console.log("❌ No required role, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ Access granted");
  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children, redirectTo = "/dashboard" }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
const AdminRoutes = React.lazy(() => import("./components/admin/AdminRoutes"));

// Role-based Dashboard Router
const DashboardRouter = () => {
  const { user, hasRole } = useAuth();

  if (hasRole("admin") || hasRole("super_admin")) {
    return <AdminDashboard />;
  }

  if (hasRole("worker")) {
    return <WorkerDashboard />;
  }

  if (hasRole("customer")) {
    return <CustomerDashboard />;
  }

  return <Dashboard />;
};

// Main App Layout
const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
      {isAuthenticated && <ChatWidget />}
    </Box>
  );
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:category" element={<Services />} />
      <Route path="/service/:id" element={<ServiceDetails />} />
      <Route path="/worker/:id" element={<WorkerProfile />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      {/* Auth Routes (Public - redirect if authenticated) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <PublicRoute>
            <VerifyOTP />
          </PublicRoute>
        }
      />
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/confirmation/:id"
        element={
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
      {/* Worker Routes */}
      <Route
        path="/worker/*"
        element={
          <ProtectedRoute requiredRole="worker">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
      {/* Customer Routes */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      {/* Unauthorized Route */}
      <Route
        path="/unauthorized"
        element={
          <Box sx={{ textAlign: "center", py: 8 }}>
            <h1>Unauthorized Access</h1>
            <p>You don't have permission to access this page.</p>
          </Box>
        }
      />
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Main App Component
const App = () => {
  // Handle global errors
  useEffect(() => {
    const handleError = (event) => {
      console.error("Global error:", event.error);
    };

    const handleUnhandledRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            autoHideDuration={5000}
          >
            <AuthProvider>
              <Router>
                <AppLayout>
                  <Suspense fallback={<LoadingScreen />}>
                    <AppRoutes />
                  </Suspense>
                </AppLayout>
              </Router>
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
        {/* React Query Devtools - only in development */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
