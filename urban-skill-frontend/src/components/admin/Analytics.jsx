import React, { useState, useEffect } from "react";
import { useApi, useLocalStorage, useDebounce } from "../../hooks";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  People,
  Work,
  AttachMoney,
  Star,
  Visibility,
  GetApp,
  DateRange,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const [timeRange, setTimeRange] = useLocalStorage(
    "analytics_timeRange",
    "30"
  );
  const debouncedTimeRange = useDebounce(timeRange, 500);
  // const [loading, setLoading] = useState(true);
  const {
    data: analyticsData,
    loading,
    error,
  } = useApi(`/admin/analytics?timeRange=${debouncedTimeRange}`, {
    dependencies: [debouncedTimeRange],
    onSuccess: (data) => {
      console.log("Analytics data loaded:", data);
    },
  });
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  // Add this after your error check and before the return statement:
  if (!analyticsData || !analyticsData.overview) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Alert severity="warning">
          No analytics data available for the selected time range.
        </Alert>
      </Box>
    );
  }

  // const [analyticsData, setAnalyticsData] = useState({
  //   overview: {
  //     totalUsers: 15420,
  //     totalWorkers: 2840,
  //     totalBookings: 8950,
  //     totalRevenue: 245680,
  //     growthMetrics: {
  //       users: 12.5,
  //       workers: 8.3,
  //       bookings: 15.7,
  //       revenue: 22.1
  //     }
  //   },
  //   revenueData: [
  //     { month: 'Jan', revenue: 18500, bookings: 420 },
  //     { month: 'Feb', revenue: 22300, bookings: 510 },
  //     { month: 'Mar', revenue: 28900, bookings: 680 },
  //     { month: 'Apr', revenue: 31200, bookings: 750 },
  //     { month: 'May', revenue: 35800, bookings: 820 },
  //     { month: 'Jun', revenue: 42100, bookings: 950 }
  //   ],
  //   serviceDistribution: [
  //     { name: 'Cleaning', value: 35, color: '#6366f1' },
  //     { name: 'Plumbing', value: 25, color: '#f59e0b' },
  //     { name: 'Electrical', value: 20, color: '#10b981' },
  //     { name: 'Painting', value: 12, color: '#ef4444' },
  //     { name: 'Others', value: 8, color: '#8b5cf6' }
  //   ],
  //   topWorkers: [
  //     { id: 1, name: 'John Smith', avatar: '', rating: 4.9, jobs: 156, earnings: 12450 },
  //     { id: 2, name: 'Sarah Johnson', avatar: '', rating: 4.8, jobs: 142, earnings: 11200 },
  //     { id: 3, name: 'Mike Wilson', avatar: '', rating: 4.7, jobs: 138, earnings: 10850 },
  //     { id: 4, name: 'Emma Davis', avatar: '', rating: 4.9, jobs: 134, earnings: 10600 },
  //     { id: 5, name: 'David Brown', avatar: '', rating: 4.6, jobs: 129, earnings: 9800 }
  //   ],
  //   userActivity: [
  //     { time: '00:00', users: 120 },
  //     { time: '04:00', users: 80 },
  //     { time: '08:00', users: 450 },
  //     { time: '12:00', users: 680 },
  //     { time: '16:00', users: 520 },
  //     { time: '20:00', users: 380 }
  //   ]
  // });

  // useEffect(() => {
  //   // Simulate API call
  //   const fetchAnalytics = async () => {
  //     setLoading(true);
  //     // Replace with actual API call
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 1000);
  //   };

  //   fetchAnalytics();
  // }, [timeRange]);

  const StatCard = ({ title, value, growth, icon: Icon, color }) => (
    <Card sx={{ height: "100%", position: "relative", overflow: "visible" }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              {growth > 0 ? (
                <TrendingUp sx={{ color: "#10b981", fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDown
                  sx={{ color: "#ef4444", fontSize: 16, mr: 0.5 }}
                />
              )}
              <Typography
                variant="body2"
                color={growth > 0 ? "#10b981" : "#ef4444"}
                fontWeight="medium"
              >
                {Math.abs(growth)}% vs last month
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: "50%",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color, fontSize: 32 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // if (loading) {
  //   return (
  //     <Box sx={{ p: 3 }}>
  //       <Typography variant="h4" gutterBottom>
  //         Analytics Dashboard
  //       </Typography>
  //       <LinearProgress sx={{ mt: 2 }} />
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ p: 3, maxWidth: "100%" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold" color="#6366f1">
          Analytics Dashboard
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 3 months</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Export Data">
            <IconButton color="primary">
              <GetApp />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={analyticsData.overview.totalUsers}
            growth={analyticsData.overview.growthMetrics.users}
            icon={People}
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Workers"
            value={analyticsData.overview.totalWorkers}
            growth={analyticsData.overview.growthMetrics.workers}
            icon={Work}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={analyticsData.overview.totalBookings}
            growth={analyticsData.overview.growthMetrics.bookings}
            icon={DateRange}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={`₹${analyticsData.overview.totalRevenue.toLocaleString()}`}
            growth={analyticsData.overview.growthMetrics.revenue}
            icon={AttachMoney}
            color="#ef4444"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={4}>
        {/* Revenue Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Revenue & Bookings Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                    name="Revenue (₹)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="Bookings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Service Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.serviceDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {analyticsData.serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Top Workers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top Performing Workers
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Worker</TableCell>
                      <TableCell align="center">Rating</TableCell>
                      <TableCell align="center">Jobs</TableCell>
                      <TableCell align="right">Earnings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.topWorkers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: "#6366f1" }}>
                              {worker.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" fontWeight="medium">
                              {worker.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={<Star sx={{ fontSize: 16 }} />}
                            label={worker.rating}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {worker.jobs}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="#10b981"
                          >
                            ₹{worker.earnings.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Daily User Activity
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
