import React, { useState, useEffect } from 'react';
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
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  Badge,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  Receipt,
  TrendingUp,
  TrendingDown,
  Search,
  FilterList,
  GetApp,
  Visibility,
  Refresh,
  Warning,
  CheckCircle,
  Cancel,
  AttachMoney,
  SwapHoriz,
  AccountBalanceWallet,
  Payment,
  MonetizationOn,
  Error,
  Schedule,
  Download
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
  ResponsiveContainer
} from 'recharts';

const PaymentManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    dateFrom: null,
    dateTo: null,
    amountFrom: '',
    amountTo: ''
  });
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'TXN001',
      bookingId: 'BK001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210'
      },
      worker: {
        name: 'Mike Wilson',
        email: 'mike@example.com'
      },
      amount: 1500,
      platformFee: 150,
      workerEarning: 1275,
      tax: 75,
      paymentMethod: 'Credit Card',
      paymentGateway: 'Razorpay',
      status: 'completed',
      transactionId: 'pay_MkL9N8O7P6Q5R4',
      gatewayTransactionId: 'rzp_test_1234567890',
      createdAt: '2025-06-28T10:30:00Z',
      completedAt: '2025-06-28T10:31:15Z',
      service: 'House Cleaning',
      refundable: true,
      refunded: false
    },
    {
      id: 'TXN002',
      bookingId: 'BK002',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+91 9765432108'
      },
      worker: {
        name: 'David Brown',
        email: 'david@example.com'
      },
      amount: 800,
      platformFee: 80,
      workerEarning: 680,
      tax: 40,
      paymentMethod: 'UPI',
      paymentGateway: 'Razorpay',
      status: 'pending',
      transactionId: 'pay_NkM0O9P8Q7R6S5',
      gatewayTransactionId: 'rzp_test_0987654321',
      createdAt: '2025-06-28T14:20:00Z',
      completedAt: null,
      service: 'Plumbing Repair',
      refundable: false,
      refunded: false
    },
    {
      id: 'TXN003',
      bookingId: 'BK003',
      customer: {
        name: 'Emma Davis',
        email: 'emma@example.com',
        phone: '+91 9654321087'
      },
      worker: {
        name: 'John Smith',
        email: 'johnsmith@example.com'
      },
      amount: 2200,
      platformFee: 220,
      workerEarning: 1870,
      tax: 110,
      paymentMethod: 'Debit Card',
      paymentGateway: 'Stripe',
      status: 'failed',
      transactionId: 'pay_OkN1P0Q9R8S7T6',
      gatewayTransactionId: 'pi_1234567890abcdef',
      createdAt: '2025-06-27T16:45:00Z',
      completedAt: null,
      service: 'Electrical Installation',
      refundable: false,
      refunded: false
    },
    {
      id: 'TXN004',
      bookingId: 'BK004',
      customer: {
        name: 'Michael Brown',
        email: 'michael@example.com',
        phone: '+91 9543210976'
      },
      worker: {
        name: 'Sarah Wilson',
        email: 'sarahw@example.com'
      },
      amount: 3500,
      platformFee: 350,
      workerEarning: 2975,
      tax: 175,
      paymentMethod: 'Net Banking',
      paymentGateway: 'Razorpay',
      status: 'completed',
      transactionId: 'pay_PkO2Q1R0S9T8U7',
      gatewayTransactionId: 'rzp_test_abcdef123456',
      createdAt: '2025-06-26T11:20:00Z',
      completedAt: '2025-06-26T11:22:30Z',
      service: 'House Painting',
      refundable: true,
      refunded: false
    },
    {
      id: 'TXN005',
      bookingId: 'BK005',
      customer: {
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
        phone: '+91 9432109865'
      },
      worker: {
        name: 'Tom Johnson',
        email: 'tom@example.com'
      },
      amount: 1200,
      platformFee: 120,
      workerEarning: 1020,
      tax: 60,
      paymentMethod: 'Wallet',
      paymentGateway: 'Paytm',
      status: 'refunded',
      transactionId: 'pay_QkP3R2S1T0U9V8',
      gatewayTransactionId: 'ptm_123456789012',
      createdAt: '2025-06-25T13:10:00Z',
      completedAt: '2025-06-25T13:11:45Z',
      refundedAt: '2025-06-27T10:15:00Z',
      service: 'AC Repair',
      refundable: false,
      refunded: true,
      refundAmount: 1200,
      refundReason: 'Service cancelled by customer'
    }
  ];

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 245680,
      totalTransactions: 1250,
      successRate: 94.5,
      averageTransaction: 1965,
      platformEarnings: 24568,
      workerEarnings: 196544,
      pendingPayouts: 15420
    },
    revenueChart: [
      { month: 'Jan', revenue: 18500, transactions: 420 },
      { month: 'Feb', revenue: 22300, transactions: 510 },
      { month: 'Mar', revenue: 28900, transactions: 680 },
      { month: 'Apr', revenue: 31200, transactions: 750 },
      { month: 'May', revenue: 35800, transactions: 820 },
      { month: 'Jun', revenue: 42100, transactions: 950 }
    ],
    paymentMethods: [
      { name: 'Credit Card', value: 35, amount: 85988, color: '#6366f1' },
      { name: 'UPI', value: 30, amount: 73704, color: '#f59e0b' },
      { name: 'Debit Card', value: 20, amount: 49136, color: '#10b981' },
      { name: 'Net Banking', value: 10, amount: 24568, color: '#ef4444' },
      { name: 'Wallet', value: 5, amount: 12284, color: '#8b5cf6' }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchTransactions = async () => {
      setLoading(true);
      setTimeout(() => {
        setTransactions(mockTransactions);
        setLoading(false);
      }, 1000);
    };

    fetchTransactions();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      completed: '#10b981',
      failed: '#ef4444',
      refunded: '#8b5cf6',
      processing: '#6366f1'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      refunded: 'Refunded',
      processing: 'Processing'
    };
    return labels[status] || status;
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  const handleRefund = (transaction) => {
    setSelectedTransaction(transaction);
    setRefundAmount(transaction.amount.toString());
    setRefundDialogOpen(true);
  };

  const processRefund = () => {
    if (!refundAmount || !refundReason) {
      setSnackbar({
        open: true,
        message: 'Please enter refund amount and reason',
        severity: 'error'
      });
      return;
    }

    // Update transaction status
    setTransactions(prev =>
      prev.map(txn =>
        txn.id === selectedTransaction.id
          ? {
              ...txn,
              status: 'refunded',
              refunded: true,
              refundAmount: parseFloat(refundAmount),
              refundReason,
              refundedAt: new Date().toISOString()
            }
          : txn
      )
    );

    setSnackbar({
      open: true,
      message: `Refund of ₹${refundAmount} processed successfully`,
      severity: 'success'
    });

    setRefundDialogOpen(false);
    setRefundAmount('');
    setRefundReason('');
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || transaction.status === filters.status;
    const matchesMethod = !filters.method || transaction.paymentMethod === filters.method;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <Card sx={{ height: '100%' }}>
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
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend > 0 ? (
                  <TrendingUp sx={{ color: '#10b981', fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: '#ef4444', fontSize: 16, mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={trend > 0 ? '#10b981' : '#ef4444'}
                  fontWeight="medium"
                >
                  {Math.abs(trend)}% vs last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color, fontSize: 32 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Payment Management</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="#6366f1">
            Payment Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<FilterList />}>
              Filters
            </Button>
            <Button variant="outlined" startIcon={<GetApp />}>
              Export
            </Button>
            <Button variant="contained" startIcon={<Refresh />}>
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Transactions" />
            <Tab label="Analytics" />
            <Tab label="Payouts" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Revenue"
                  value={`₹${analyticsData.overview.totalRevenue.toLocaleString()}`}
                  subtitle="This month"
                  icon={MonetizationOn}
                  color="#6366f1"
                  trend={12.5}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Transactions"
                  value={analyticsData.overview.totalTransactions.toLocaleString()}
                  subtitle="Total processed"
                  icon={Receipt}
                  color="#f59e0b"
                  trend={8.3}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Success Rate"
                  value={`${analyticsData.overview.successRate}%`}
                  subtitle="Payment success"
                  icon={CheckCircle}
                  color="#10b981"
                  trend={2.1}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Avg Transaction"
                  value={`₹${analyticsData.overview.averageTransaction.toLocaleString()}`}
                  subtitle="Per booking"
                  icon={TrendingUp}
                  color="#ef4444"
                  trend={-1.2}
                />
              </Grid>
            </Grid>

            {/* Search and Filters */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                  <TextField
                    placeholder="Search transactions..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ minWidth: 300 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                      <MenuItem value="refunded">Refunded</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={filters.method}
                      label="Payment Method"
                      onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
                    >
                      <MenuItem value="">All Methods</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Debit Card">Debit Card</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Net Banking">Net Banking</MenuItem>
                      <MenuItem value="Wallet">Wallet</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Booking</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((transaction) => (
                        <TableRow key={transaction.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {transaction.id}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {transaction.transactionId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {transaction.bookingId}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {transaction.service}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ bgcolor: '#6366f1', width: 32, height: 32 }}>
                                {transaction.customer.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {transaction.customer.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {transaction.customer.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="#10b981">
                              ₹{transaction.amount.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Fee: ₹{transaction.platformFee}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Payment sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {transaction.paymentMethod}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                              {transaction.paymentGateway}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(transaction.status)}
                              sx={{
                                backgroundColor: getStatusColor(transaction.status),
                                color: 'white',
                                fontWeight: 'medium'
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(transaction.createdAt).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" gap={1}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewDetails(transaction)}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              {transaction.refundable && !transaction.refunded && (
                                <Tooltip title="Process Refund">
                                  <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() => handleRefund(transaction)}
                                  >
                                    <SwapHoriz />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Download Receipt">
                                <IconButton size="small" color="primary">
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredTransactions.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
              />
            </Card>
          </>
        )}

        {tabValue === 1 && (
          <Grid container spacing={3}>
            {/* Revenue Chart */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Revenue Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.revenueChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Payment Methods */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Payment Methods
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.paymentMethods}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {analyticsData.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Financial Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Financial Summary
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2}>
                        <Typography variant="h4" color="#6366f1" fontWeight="bold">
                          ₹{analyticsData.overview.platformEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Platform Earnings
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2}>
                        <Typography variant="h4" color="#10b981" fontWeight="bold">
                          ₹{analyticsData.overview.workerEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Worker Earnings
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2}>
                        <Typography variant="h4" color="#f59e0b" fontWeight="bold">
                          ₹{analyticsData.overview.pendingPayouts.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Pending Payouts
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2}>
                        <Typography variant="h4" color="#ef4444" fontWeight="bold">
                          {analyticsData.overview.successRate}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Success Rate
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Worker Payouts
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Payout management functionality will be implemented here.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Transaction Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Transaction Details - {selectedTransaction?.id}</Typography>
              <Chip
                label={getStatusLabel(selectedTransaction?.status)}
                sx={{
                  backgroundColor: getStatusColor(selectedTransaction?.status),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedTransaction && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Transaction Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1} mb={3}>
                    <Typography><strong>Transaction ID:</strong> {selectedTransaction.transactionId}</Typography>
                    <Typography><strong>Gateway ID:</strong> {selectedTransaction.gatewayTransactionId}</Typography>
                    <Typography><strong>Booking ID:</strong> {selectedTransaction.bookingId}</Typography>
                    <Typography><strong>Service:</strong> {selectedTransaction.service}</Typography>
                    <Typography><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</Typography>
                    <Typography><strong>Gateway:</strong> {selectedTransaction.paymentGateway}</Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom color="primary">
                    Amount Breakdown
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Total Amount:</strong> ₹{selectedTransaction.amount.toLocaleString()}</Typography>
                    <Typography><strong>Platform Fee:</strong> ₹{selectedTransaction.platformFee.toLocaleString()}</Typography>
                    <Typography><strong>Worker Earning:</strong> ₹{selectedTransaction.workerEarning.toLocaleString()}</Typography>
                    <Typography><strong>Tax:</strong> ₹{selectedTransaction.tax.toLocaleString()}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Customer Details
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1} mb={3}>
                    <Typography><strong>Name:</strong> {selectedTransaction.customer.name}</Typography>
                    <Typography><strong>Email:</strong> {selectedTransaction.customer.email}</Typography>
                    <Typography><strong>Phone:</strong> {selectedTransaction.customer.phone}</Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom color="primary">
                    Timeline
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Created:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</Typography>
                    {selectedTransaction.completedAt && (
                      <Typography><strong>Completed:</strong> {new Date(selectedTransaction.completedAt).toLocaleString()}</Typography>
                    )}
                    {selectedTransaction.refundedAt && (
                      <Typography><strong>Refunded:</strong> {new Date(selectedTransaction.refundedAt).toLocaleString()}</Typography>
                    )}
                  </Box>

                  {selectedTransaction.refunded && (
                    <>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                        Refund Details
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography><strong>Refund Amount:</strong> ₹{selectedTransaction.refundAmount?.toLocaleString()}</Typography>
                        <Typography><strong>Reason:</strong> {selectedTransaction.refundReason}</Typography>
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
            <Button variant="contained" color="primary">
              Download Receipt
            </Button>
          </DialogActions>
        </Dialog>

        {/* Refund Dialog */}
        <Dialog
          open={refundDialogOpen}
          onClose={() => setRefundDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Process Refund</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} pt={2}>
              <Alert severity="warning">
                This action will process a refund for transaction {selectedTransaction?.id}
              </Alert>
              <TextField
                label="Refund Amount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                }}
              />
              <TextField
                label="Refund Reason"
                multiline
                rows={3}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                fullWidth
                placeholder="Enter reason for refund..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRefundDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="warning" onClick={processRefund}>
              Process Refund
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default PaymentManagement;
