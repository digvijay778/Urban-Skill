import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  GetApp,
  Print,
  Email,
  Schedule,
  DateRange,
  PictureAsPdf,
  TableChart,
  BarChart,
  PieChart,
  ShowChart,
  Visibility,
  ExpandMore,
  FilterList,
  Refresh,
  Share,
  Save,
  Settings,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    from: dayjs("2025-01-01"), // ✅ Use dayjs
    to: dayjs("2025-06-28"), // ✅ Use dayjs
  });

  const [reportType, setReportType] = useState("overview");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Mock report data
  const reportData = {
    overview: {
      totalRevenue: 1245680,
      totalBookings: 8950,
      totalUsers: 15420,
      totalWorkers: 2840,
      avgRating: 4.7,
      completionRate: 94.5,
      growthMetrics: {
        revenue: 22.1,
        bookings: 15.7,
        users: 12.5,
        workers: 8.3,
      },
    },
    monthlyData: [
      {
        month: "Jan",
        revenue: 185000,
        bookings: 1420,
        users: 2100,
        workers: 380,
        rating: 4.6,
      },
      {
        month: "Feb",
        revenue: 223000,
        bookings: 1510,
        users: 2350,
        workers: 420,
        rating: 4.7,
      },
      {
        month: "Mar",
        revenue: 289000,
        bookings: 1680,
        users: 2800,
        workers: 480,
        rating: 4.8,
      },
      {
        month: "Apr",
        revenue: 312000,
        bookings: 1750,
        users: 3100,
        workers: 520,
        rating: 4.7,
      },
      {
        month: "May",
        revenue: 358000,
        bookings: 1820,
        users: 3400,
        workers: 580,
        rating: 4.8,
      },
      {
        month: "Jun",
        revenue: 421000,
        bookings: 1950,
        users: 3850,
        workers: 640,
        rating: 4.9,
      },
    ],
    servicePerformance: [
      {
        service: "House Cleaning",
        bookings: 3200,
        revenue: 480000,
        avgRating: 4.8,
        workers: 850,
      },
      {
        service: "Plumbing",
        bookings: 2100,
        revenue: 315000,
        avgRating: 4.7,
        workers: 520,
      },
      {
        service: "Electrical",
        bookings: 1800,
        revenue: 360000,
        avgRating: 4.6,
        workers: 420,
      },
      {
        service: "Painting",
        bookings: 1200,
        revenue: 240000,
        avgRating: 4.9,
        workers: 280,
      },
      {
        service: "Appliance Repair",
        bookings: 650,
        revenue: 130000,
        avgRating: 4.5,
        workers: 180,
      },
    ],
    workerPerformance: [
      {
        name: "John Smith",
        bookings: 156,
        revenue: 234000,
        rating: 4.9,
        completion: 98,
      },
      {
        name: "Sarah Johnson",
        bookings: 142,
        revenue: 213000,
        rating: 4.8,
        completion: 96,
      },
      {
        name: "Mike Wilson",
        bookings: 138,
        revenue: 207000,
        rating: 4.7,
        completion: 95,
      },
      {
        name: "Emma Davis",
        bookings: 134,
        revenue: 201000,
        rating: 4.9,
        completion: 97,
      },
      {
        name: "David Brown",
        bookings: 129,
        revenue: 193500,
        rating: 4.6,
        completion: 94,
      },
    ],
    customerAnalytics: [
      { segment: "New Customers", count: 4200, revenue: 315000, avgSpend: 75 },
      {
        segment: "Returning Customers",
        count: 8950,
        revenue: 671250,
        avgSpend: 75,
      },
      {
        segment: "Premium Customers",
        count: 2270,
        revenue: 340500,
        avgSpend: 150,
      },
    ],
    geographicData: [
      { city: "Mumbai", bookings: 2850, revenue: 427500, workers: 680 },
      { city: "Delhi", bookings: 2100, revenue: 315000, workers: 520 },
      { city: "Bangalore", bookings: 1950, revenue: 292500, workers: 480 },
      { city: "Chennai", bookings: 1200, revenue: 180000, workers: 320 },
      { city: "Pune", bookings: 850, revenue: 127500, workers: 240 },
    ],
    timeAnalytics: [
      { hour: "06:00", bookings: 45 },
      { hour: "08:00", bookings: 120 },
      { hour: "10:00", bookings: 280 },
      { hour: "12:00", bookings: 350 },
      { hour: "14:00", bookings: 420 },
      { hour: "16:00", bookings: 380 },
      { hour: "18:00", bookings: 290 },
      { hour: "20:00", bookings: 180 },
    ],
  };

  useEffect(() => {
    // Simulate API call
    const fetchReports = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchReports();
  }, [dateRange, reportType]);

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
    onClick,
  }) => (
    <Card
      sx={{
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { boxShadow: 4 } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" mt={1}>
                {subtitle}
              </Typography>
            )}
            {trend !== undefined && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend > 0 ? (
                  <TrendingUp
                    sx={{ color: "#10b981", fontSize: 16, mr: 0.5 }}
                  />
                ) : (
                  <TrendingDown
                    sx={{ color: "#ef4444", fontSize: 16, mr: 0.5 }}
                  />
                )}
                <Typography
                  variant="body2"
                  color={trend > 0 ? "#10b981" : "#ef4444"}
                  fontWeight="medium"
                >
                  {Math.abs(trend)}% vs last period
                </Typography>
              </Box>
            )}
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

  const handleExport = (format) => {
    setSnackbar({
      open: true,
      message: `Report exported as ${format.toUpperCase()}`,
      severity: "success",
    });
    setExportDialogOpen(false);
  };

  const generateScheduledReport = () => {
    setSnackbar({
      open: true,
      message: "Scheduled report created successfully",
      severity: "success",
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports & Analytics
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold" color="#6366f1">
            Reports & Analytics
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              }
              label="Auto Refresh"
            />
            <Button
              variant="outlined"
              startIcon={<Schedule />}
              onClick={generateScheduledReport}
            >
              Schedule Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              onClick={() => setExportDialogOpen(true)}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Date Range and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <DatePicker
                label="From Date"
                value={dateRange.from}
                onChange={(date) =>
                  setDateRange((prev) => ({ ...prev, from: date }))
                }
                slotProps={{ textField: { size: "small" } }} // ✅ New API
              />
              <DatePicker
                label="To Date"
                value={dateRange.to}
                onChange={(date) =>
                  setDateRange((prev) => ({ ...prev, to: date }))
                }
                slotProps={{ textField: { size: "small" } }} // ✅ New API
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="overview">Overview</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="operational">Operational</MenuItem>
                  <MenuItem value="customer">Customer Analytics</MenuItem>
                  <MenuItem value="worker">Worker Performance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
          >
            <Tab label="Overview" />
            <Tab label="Performance" />
            <Tab label="Geographic" />
            <Tab label="Time Analysis" />
            <Tab label="Custom Reports" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        {tabValue === 0 && (
          <>
            {/* Key Metrics */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Revenue"
                  value={`₹${(
                    reportData.overview.totalRevenue / 100000
                  ).toFixed(1)}L`}
                  subtitle="Last 6 months"
                  icon={TrendingUp}
                  color="#6366f1"
                  trend={reportData.overview.growthMetrics.revenue}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Bookings"
                  value={reportData.overview.totalBookings.toLocaleString()}
                  subtitle="Completed services"
                  icon={Assessment}
                  color="#f59e0b"
                  trend={reportData.overview.growthMetrics.bookings}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Users"
                  value={reportData.overview.totalUsers.toLocaleString()}
                  subtitle="Registered customers"
                  icon={TrendingUp}
                  color="#10b981"
                  trend={reportData.overview.growthMetrics.users}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Workers"
                  value={reportData.overview.totalWorkers.toLocaleString()}
                  subtitle="Verified professionals"
                  icon={TrendingUp}
                  color="#ef4444"
                  trend={reportData.overview.growthMetrics.workers}
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
                    <ResponsiveContainer width="100%" height={390}>
                      <ComposedChart data={reportData.monthlyData}>
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
                          fill="#6366f1"
                          fillOpacity={0.3}
                          stroke="#6366f1"
                          name="Revenue (₹)"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="bookings"
                          fill="#f59e0b"
                          name="Bookings"
                        />
                      </ComposedChart>
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
                    <ResponsiveContainer width="100%" height={350}>
                      <RechartsPieChart>
                        <Pie
                          data={reportData.servicePerformance}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="bookings"
                          label={({ service, bookings }) =>
                            `${service}: ${bookings}`
                          }
                        >
                          {reportData.servicePerformance.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                [
                                  "#6366f1",
                                  "#f59e0b",
                                  "#10b981",
                                  "#ef4444",
                                  "#8b5cf6",
                                ][index]
                              }
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Service Performance Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Service Performance Summary
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell align="center">Bookings</TableCell>
                        <TableCell align="center">Revenue</TableCell>
                        <TableCell align="center">Avg Rating</TableCell>
                        <TableCell align="center">Active Workers</TableCell>
                        <TableCell align="center">Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.servicePerformance.map((service, index) => (
                        <TableRow key={service.service} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {service.service}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="#6366f1"
                            >
                              {service.bookings.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="#10b981"
                            >
                              ₹{(service.revenue / 1000).toFixed(0)}K
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={service.avgRating}
                              size="small"
                              sx={{
                                backgroundColor:
                                  service.avgRating >= 4.7
                                    ? "#10b981"
                                    : service.avgRating >= 4.5
                                    ? "#f59e0b"
                                    : "#ef4444",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {service.workers}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <LinearProgress
                              variant="determinate"
                              value={
                                (service.bookings /
                                  Math.max(
                                    ...reportData.servicePerformance.map(
                                      (s) => s.bookings
                                    )
                                  )) *
                                100
                              }
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#f3f4f6",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "#6366f1",
                                },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Performance Tab */}
        {tabValue === 1 && (
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
                          <TableCell align="center">Jobs</TableCell>
                          <TableCell align="center">Revenue</TableCell>
                          <TableCell align="center">Rating</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.workerPerformance.map((worker, index) => (
                          <TableRow key={worker.name}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Chip
                                  label={index + 1}
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      index < 3 ? "#f59e0b" : "#6b7280",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                />
                                <Typography variant="body2" fontWeight="medium">
                                  {worker.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight="bold">
                                {worker.bookings}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                color="#10b981"
                                fontWeight="bold"
                              >
                                ₹{(worker.revenue / 1000).toFixed(0)}K
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={worker.rating}
                                size="small"
                                sx={{
                                  backgroundColor: "#6366f1",
                                  color: "white",
                                  fontWeight: "bold",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Customer Analytics */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Customer Segments
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {reportData.customerAnalytics.map((segment) => (
                      <Box
                        key={segment.segment}
                        p={2}
                        sx={{ backgroundColor: "#f8fafc", borderRadius: 2 }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="body1" fontWeight="bold">
                            {segment.segment}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#6366f1"
                            fontWeight="bold"
                          >
                            {segment.count.toLocaleString()} customers
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="textSecondary">
                            Revenue: ₹{(segment.revenue / 1000).toFixed(0)}K
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Avg Spend: ₹{segment.avgSpend}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Monthly Performance Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Monthly Performance Metrics
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#6366f1"
                        strokeWidth={3}
                        name="New Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="workers"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        name="New Workers"
                      />
                      <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Avg Rating"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Geographic Tab */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Geographic Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsBarChart data={reportData.geographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="city" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="bookings" fill="#6366f1" name="Bookings" />
                      <Bar dataKey="workers" fill="#f59e0b" name="Workers" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    City Rankings
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {reportData.geographicData.map((city, index) => (
                      <Box
                        key={city.city}
                        p={2}
                        sx={{ backgroundColor: "#f8fafc", borderRadius: 2 }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Chip
                              label={index + 1}
                              size="small"
                              sx={{
                                backgroundColor:
                                  index < 3 ? "#f59e0b" : "#6b7280",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                            <Typography variant="body1" fontWeight="bold">
                              {city.city}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="textSecondary">
                            {city.bookings} bookings
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#10b981"
                            fontWeight="bold"
                          >
                            ₹{(city.revenue / 1000).toFixed(0)}K
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Time Analysis Tab */}
        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Booking Time Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={reportData.timeAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Custom Reports Tab */}
        {tabValue === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Custom Report Builder
                  </Typography>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Create custom reports by selecting metrics, filters, and
                    visualization options.
                  </Alert>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6">Report Configuration</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel>Metrics</InputLabel>
                            <Select multiple value={[]} label="Metrics">
                              <MenuItem value="revenue">Revenue</MenuItem>
                              <MenuItem value="bookings">Bookings</MenuItem>
                              <MenuItem value="users">Users</MenuItem>
                              <MenuItem value="workers">Workers</MenuItem>
                              <MenuItem value="ratings">Ratings</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel>Grouping</InputLabel>
                            <Select value="" label="Grouping">
                              <MenuItem value="daily">Daily</MenuItem>
                              <MenuItem value="weekly">Weekly</MenuItem>
                              <MenuItem value="monthly">Monthly</MenuItem>
                              <MenuItem value="service">By Service</MenuItem>
                              <MenuItem value="location">By Location</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel>Chart Type</InputLabel>
                            <Select value="" label="Chart Type">
                              <MenuItem value="line">Line Chart</MenuItem>
                              <MenuItem value="bar">Bar Chart</MenuItem>
                              <MenuItem value="area">Area Chart</MenuItem>
                              <MenuItem value="pie">Pie Chart</MenuItem>
                              <MenuItem value="table">Table</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Box mt={3} display="flex" gap={2}>
                        <Button variant="contained" startIcon={<Assessment />}>
                          Generate Report
                        </Button>
                        <Button variant="outlined" startIcon={<Save />}>
                          Save Template
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Export Dialog */}
        <Dialog
          open={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Export Report</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} pt={2}>
              <Typography variant="body2" color="textSecondary">
                Choose the format for exporting your report:
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdf />}
                  onClick={() => handleExport("pdf")}
                  fullWidth
                >
                  Export as PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TableChart />}
                  onClick={() => handleExport("excel")}
                  fullWidth
                >
                  Export as Excel
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShowChart />}
                  onClick={() => handleExport("csv")}
                  fullWidth
                >
                  Export as CSV
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;
