import React, { useState, useEffect } from "react";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Alert,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Dashboard,
  People,
  Work,
  Assignment,
  Payment,
  TrendingUp,
  TrendingDown,
  Verified,
  Warning,
  CheckCircle,
  Cancel,
  MoreVert,
  Visibility,
  Edit,
  Block,
  Analytics,
  Notifications,
  Settings,
  Security,
  Report,
  MonetizationOn,
  PersonAdd,
  BusinessCenter,
  Support,
  Flag,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@context/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  // State management
  const [dashboardStats, setDashboardStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data (replace with API calls)
  const mockDashboardStats = {
    totalUsers: 15420,
    totalWorkers: 2850,
    totalBookings: 8750,
    totalRevenue: 2450000,
    activeBookings: 156,
    pendingVerifications: 23,
    monthlyGrowth: {
      users: 12.5,
      workers: 8.3,
      bookings: 15.7,
      revenue: 22.1,
    },
    todayStats: {
      newUsers: 45,
      newBookings: 89,
      completedBookings: 67,
      revenue: 15600,
    },
  };

  const mockRecentUsers = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@example.com",
      role: "customer",
      joinDate: "2025-06-25",
      status: "active",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      totalBookings: 5,
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      role: "worker",
      joinDate: "2025-06-24",
      status: "pending_verification",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      profession: "Electrician",
    },
    {
      id: 3,
      name: "Amit Singh",
      email: "amit@example.com",
      role: "customer",
      joinDate: "2025-06-23",
      status: "active",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      totalBookings: 12,
    },
  ];

  const mockRecentBookings = [
    {
      id: 1,
      serviceType: "Home Cleaning",
      customerName: "Sunita Patel",
      workerName: "Priya Sharma",
      amount: 299,
      status: "completed",
      date: "2025-06-26",
      commission: 45,
    },
    {
      id: 2,
      serviceType: "Electrical Repair",
      customerName: "Vikash Gupta",
      workerName: "Rajesh Kumar",
      amount: 650,
      status: "in_progress",
      date: "2025-06-26",
      commission: 98,
    },
    {
      id: 3,
      serviceType: "Plumbing",
      customerName: "Meera Singh",
      workerName: "Amit Singh",
      amount: 450,
      status: "scheduled",
      date: "2025-06-27",
      commission: 68,
    },
  ];

  const mockPendingVerifications = [
    {
      id: 1,
      workerName: "Rohit Sharma",
      profession: "Electrician",
      experience: "5 years",
      documentsSubmitted: 4,
      requiredDocuments: 4,
      submissionDate: "2025-06-24",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      workerName: "Kavita Patel",
      profession: "Cleaning Specialist",
      experience: "3 years",
      documentsSubmitted: 3,
      requiredDocuments: 4,
      submissionDate: "2025-06-23",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
  ];

  // Load dashboard data
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setDashboardStats(mockDashboardStats);
      setRecentUsers(mockRecentUsers);
      setRecentBookings(mockRecentBookings);
      setPendingVerifications(mockPendingVerifications);
      setLoading(false);
    }, 1000);
  }, []);

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case "active":
        return { color: "success", icon: <CheckCircle />, label: "Active" };
      case "pending_verification":
        return {
          color: "warning",
          icon: <Warning />,
          label: "Pending Verification",
        };
      case "suspended":
        return { color: "error", icon: <Block />, label: "Suspended" };
      case "completed":
        return { color: "success", icon: <CheckCircle />, label: "Completed" };
      case "in_progress":
        return { color: "info", icon: <Work />, label: "In Progress" };
      case "scheduled":
        return { color: "warning", icon: <Assignment />, label: "Scheduled" };
      case "cancelled":
        return { color: "error", icon: <Cancel />, label: "Cancelled" };
      default:
        return { color: "default", icon: <CheckCircle />, label: "Unknown" };
    }
  };

  // Handle menu actions
  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleUserAction = (action, userId) => {
    console.log(`${action} user ${userId}`);
    handleMenuClose();
  };

  const handleVerifyWorker = (workerId, action) => {
    console.log(`${action} worker verification ${workerId}`);
    if (action === "approve") {
      setPendingVerifications((prev) => prev.filter((w) => w.id !== workerId));
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: "Total Users",
      value: dashboardStats.totalUsers?.toLocaleString(),
      growth: dashboardStats.monthlyGrowth?.users,
      icon: <People />,
      color: "primary",
      subtitle: `+${dashboardStats.todayStats?.newUsers} today`,
    },
    {
      title: "Total Workers",
      value: dashboardStats.totalWorkers?.toLocaleString(),
      growth: dashboardStats.monthlyGrowth?.workers,
      icon: <BusinessCenter />,
      color: "info",
      subtitle: `${dashboardStats.pendingVerifications} pending verification`,
    },
    {
      title: "Total Bookings",
      value: dashboardStats.totalBookings?.toLocaleString(),
      growth: dashboardStats.monthlyGrowth?.bookings,
      icon: <Assignment />,
      color: "success",
      subtitle: `${dashboardStats.activeBookings} active`,
    },
    {
      title: "Total Revenue",
      value: `₹${(dashboardStats.totalRevenue / 100000)?.toFixed(1)}L`,
      growth: dashboardStats.monthlyGrowth?.revenue,
      icon: <MonetizationOn />,
      color: "warning",
      subtitle: `₹${dashboardStats.todayStats?.revenue?.toLocaleString()} today`,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.firstName}! Here's what's happening on Urban
            Skill today.
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  background: `linear-gradient(135deg, ${
                    theme.palette[stat.color].light
                  }20 0%, ${theme.palette[stat.color].main}10 100%)`,
                  border: `1px solid ${theme.palette[stat.color].light}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: `${stat.color}.main`,
                        color: "white",
                        mr: 2,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {stat.growth > 0 ? (
                        <TrendingUp
                          sx={{ fontSize: 16, color: "success.main", mr: 0.5 }}
                        />
                      ) : (
                        <TrendingDown
                          sx={{ fontSize: 16, color: "error.main", mr: 0.5 }}
                        />
                      )}
                      <Typography
                        variant="caption"
                        color={stat.growth > 0 ? "success.main" : "error.main"}
                        fontWeight="bold"
                      >
                        {stat.growth}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Recent Users
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => navigate("/admin/users")}
                    endIcon={<People />}
                  >
                    View All
                  </Button>
                </Box>

                {loading ? (
                  <LinearProgress />
                ) : (
                  <List>
                    {recentUsers.map((user, index) => {
                      const statusInfo = getStatusInfo(user.status);
                      return (
                        <React.Fragment key={user.id}>
                          <ListItem
                            sx={{
                              px: 0,
                              py: 2,
                              "&:hover": { backgroundColor: "action.hover" },
                              borderRadius: 2,
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={user.avatar} alt={user.name} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                  >
                                    {user.name}
                                  </Typography>
                                  <Chip
                                    label={user.role}
                                    size="small"
                                    color={
                                      user.role === "worker"
                                        ? "primary"
                                        : "default"
                                    }
                                  />
                                  <Chip
                                    label={statusInfo.label}
                                    color={statusInfo.color}
                                    size="small"
                                    icon={statusInfo.icon}
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {user.email}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Joined:{" "}
                                    {new Date(
                                      user.joinDate
                                    ).toLocaleDateString()}
                                  </Typography>
                                  {user.role === "worker" &&
                                    user.profession && (
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Profession: {user.profession}
                                      </Typography>
                                    )}
                                  {user.totalBookings && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Bookings: {user.totalBookings}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, user)}
                              size="small"
                            >
                              <MoreVert />
                            </IconButton>
                          </ListItem>
                          {index < recentUsers.length - 1 && <Divider />}
                        </React.Fragment>
                      );
                    })}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Recent Bookings
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => navigate("/admin/bookings")}
                    endIcon={<Assignment />}
                  >
                    View All
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Worker</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Commission</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentBookings.map((booking) => {
                        const statusInfo = getStatusInfo(booking.status);
                        return (
                          <TableRow key={booking.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {booking.serviceType}
                              </Typography>
                            </TableCell>
                            <TableCell>{booking.customerName}</TableCell>
                            <TableCell>{booking.workerName}</TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                ₹{booking.amount}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="success.main"
                                fontWeight="bold"
                              >
                                ₹{booking.commission}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={statusInfo.label}
                                color={statusInfo.color}
                                size="small"
                                icon={statusInfo.icon}
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(booking.date).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PersonAdd />}
                      onClick={() => navigate("/admin/users/add")}
                      sx={{ py: 2, flexDirection: "column", gap: 1 }}
                    >
                      Add User
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Verified />}
                      onClick={() => {
                        console.log("Navigate to verifications");
                        navigate("/admin/verifications");
                      }}
                      sx={{ py: 2, flexDirection: "column", gap: 1 }}
                    >
                      Verifications
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Analytics />}
                      onClick={() => navigate("/admin/analytics")}
                      sx={{ py: 2, flexDirection: "column", gap: 1 }}
                    >
                      Analytics
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Report />}
                      onClick={() => navigate("/admin/reports")}
                      sx={{ py: 2, flexDirection: "column", gap: 1 }}
                    >
                      Reports
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Verifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Pending Verifications ({pendingVerifications.length})
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => navigate("/admin/verifications")}
                    endIcon={<Verified />}
                  >
                    View All
                  </Button>
                </Box>

                {pendingVerifications.length === 0 ? (
                  <Alert severity="success">No pending verifications!</Alert>
                ) : (
                  <List>
                    {pendingVerifications.map((worker, index) => (
                      <React.Fragment key={worker.id}>
                        <ListItem sx={{ px: 0, py: 2 }}>
                          <ListItemAvatar>
                            <Avatar
                              src={worker.avatar}
                              alt={worker.workerName}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="bold">
                                {worker.workerName}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {worker.profession} • {worker.experience}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Documents: {worker.documentsSubmitted}/
                                  {worker.requiredDocuments}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Submitted:{" "}
                                  {new Date(
                                    worker.submissionDate
                                  ).toLocaleDateString()}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        <Box sx={{ display: "flex", gap: 1, px: 0, pb: 2 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() =>
                              handleVerifyWorker(worker.id, "approve")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              handleVerifyWorker(worker.id, "reject")
                            }
                          >
                            Reject
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            startIcon={<Visibility />}
                            onClick={() =>
                              navigate(`/admin/worker/${worker.id}/verify`)
                            }
                          >
                            Review
                          </Button>
                        </Box>
                        {index < pendingVerifications.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  System Status
                </Typography>

                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="API Services"
                      secondary="All systems operational"
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment Gateway"
                      secondary="Processing normally"
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="SMS Service"
                      secondary="Minor delays reported"
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Database" secondary="Healthy" />
                  </ListItem>
                </List>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Settings />}
                  onClick={() => navigate("/admin/system")}
                  sx={{ mt: 2 }}
                >
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* User Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleUserAction("view", selectedItem?.id)}>
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleUserAction("edit", selectedItem?.id)}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          Edit User
        </MenuItem>
        <MenuItem onClick={() => handleUserAction("suspend", selectedItem?.id)}>
          <ListItemIcon>
            <Block />
          </ListItemIcon>
          Suspend User
        </MenuItem>
        <MenuItem onClick={() => handleUserAction("delete", selectedItem?.id)}>
          <ListItemIcon>
            <Flag />
          </ListItemIcon>
          Report User
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default AdminDashboard;
