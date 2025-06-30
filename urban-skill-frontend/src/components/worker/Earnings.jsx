// src/components/worker/Earnings.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Payment as PaymentIcon,
  AccountBalance as BankIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  MonetizationOn as MoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { earningsService } from '../../services/earningsService';
import { formatters } from '../../utils/formatters';
import LoadingScreen from '../common/LoadingScreen';

const Earnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [filters, setFilters] = useState({
    period: 'this_month',
    status: 'all',
    service: 'all'
  });

  // Statistics
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    pendingPayments: 0,
    completedJobs: 0,
    averageJobValue: 0,
    growthRate: 0,
    nextPayoutDate: null,
    nextPayoutAmount: 0
  });

  useEffect(() => {
    fetchEarnings();
  }, [filters]);

  useEffect(() => {
    calculateStats();
  }, [earnings]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await earningsService.getWorkerEarnings(user.id, filters);
      setEarnings(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch earnings data');
      console.error('Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    
    const thisMonthEarnings = earnings
      .filter(earning => new Date(earning.date) >= currentMonth && earning.status === 'paid')
      .reduce((sum, earning) => sum + earning.amount, 0);

    const totalEarnings = earnings
      .filter(earning => earning.status === 'paid')
      .reduce((sum, earning) => sum + earning.amount, 0);

    const pendingPayments = earnings
      .filter(earning => earning.status === 'pending')
      .reduce((sum, earning) => sum + earning.amount, 0);

    const completedJobs = earnings.filter(earning => earning.status === 'paid').length;
    const averageJobValue = completedJobs > 0 ? totalEarnings / completedJobs : 0;

    // Calculate growth rate (compare with last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    
    const lastMonthEnd = new Date(currentMonth);
    lastMonthEnd.setDate(0);
    
    const lastMonthEarnings = earnings
      .filter(earning => {
        const earningDate = new Date(earning.date);
        return earningDate >= lastMonth && earningDate <= lastMonthEnd && earning.status === 'paid';
      })
      .reduce((sum, earning) => sum + earning.amount, 0);

    const growthRate = lastMonthEarnings > 0 
      ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 
      : 0;

    setStats({
      totalEarnings,
      thisMonthEarnings,
      pendingPayments,
      completedJobs,
      averageJobValue,
      growthRate,
      nextPayoutDate: getNextPayoutDate(),
      nextPayoutAmount: pendingPayments
    });
  };

  const getNextPayoutDate = () => {
    // Assuming payouts are weekly on Fridays
    const today = new Date();
    const daysUntilFriday = (5 - today.getDay() + 7) % 7;
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday));
    return nextFriday;
  };

  const handleWithdrawEarnings = async () => {
    try {
      const result = await earningsService.requestWithdrawal(user.id);
      if (result.success) {
        setSuccess('Withdrawal request submitted successfully');
        await fetchEarnings();
      }
    } catch (err) {
      setError('Failed to submit withdrawal request');
    }
  };

  const handleDownloadStatement = async (period) => {
    try {
      await earningsService.downloadStatement(user.id, period);
      setSuccess('Statement downloaded successfully');
    } catch (err) {
      setError('Failed to download statement');
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'primary', trend = null }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, mr: 2 }}>
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {trend !== null && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {trend >= 0 ? (
                <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
              )}
              <Typography 
                variant="caption" 
                color={trend >= 0 ? 'success.main' : 'error.main'}
                fontWeight="bold"
              >
                {Math.abs(trend).toFixed(1)}%
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const EarningCard = ({ earning, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card sx={{ mb: 2, '&:hover': { boxShadow: 4 } }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Avatar
                src={earning.customer?.profileImage}
                sx={{ width: 48, height: 48, mr: 2 }}
              >
                {earning.customer?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {earning.service?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer: {earning.customer?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {formatters.formatDate(earning.date)}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                ₹{earning.amount}
              </Typography>
              <Chip
                label={earning.status.toUpperCase()}
                color={earning.status === 'paid' ? 'success' : 'warning'}
                size="small"
              />
            </Box>
          </Box>

          {/* Earning Breakdown */}
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Service Amount
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  ₹{earning.serviceAmount}
                </Typography>
              </Grid>
              <Grid xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Platform Fee
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  -₹{earning.platformFee}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Payment Details */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Payment Method: {earning.paymentMethod}
              </Typography>
              {earning.transactionId && (
                <Typography variant="caption" display="block" color="text.secondary">
                  Transaction ID: {earning.transactionId}
                </Typography>
              )}
            </Box>
            
            {earning.status === 'paid' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ReceiptIcon />}
                onClick={() => handleDownloadStatement(earning.id)}
              >
                Receipt
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Earnings
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => fetchEarnings()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<BankIcon />}
              onClick={handleWithdrawEarnings}
              disabled={stats.pendingPayments === 0}
            >
              Withdraw Earnings
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Earnings"
              value={`₹${formatters.formatNumber(stats.totalEarnings)}`}
              icon={<MoneyIcon />}
              color="primary"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="This Month"
              value={`₹${formatters.formatNumber(stats.thisMonthEarnings)}`}
              icon={<TrendingUpIcon />}
              color="success"
              trend={stats.growthRate}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Payments"
              value={`₹${formatters.formatNumber(stats.pendingPayments)}`}
              icon={<ScheduleIcon />}
              color="warning"
              subtitle={`${earnings.filter(e => e.status === 'pending').length} jobs`}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Average Job Value"
              value={`₹${formatters.formatNumber(stats.averageJobValue)}`}
              icon={<PaymentIcon />}
              color="info"
              subtitle={`From ${stats.completedJobs} jobs`}
            />
          </Grid>
        </Grid>

        {/* Next Payout Info */}
        <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Next Payout
                  </Typography>
                  <Typography variant="body2">
                    {formatters.formatDate(stats.nextPayoutDate)} • ₹{formatters.formatNumber(stats.nextPayoutAmount)}
                  </Typography>
                </Box>
              </Box>
              <CheckCircleIcon sx={{ fontSize: 32 }} />
            </Box>
          </CardContent>
        </Card>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert 
                severity="error" 
                onClose={() => setError('')}
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert 
                severity="success" 
                onClose={() => setSuccess('')}
                sx={{ mb: 2 }}
              >
                {success}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={filters.period}
                onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
                label="Period"
              >
                <MenuItem value="this_week">This Week</MenuItem>
                <MenuItem value="this_month">This Month</MenuItem>
                <MenuItem value="last_month">Last Month</MenuItem>
                <MenuItem value="last_3_months">Last 3 Months</MenuItem>
                <MenuItem value="all_time">All Time</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadStatement(filters.period)}
            >
              Download Statement
            </Button>
          </Box>
        </Paper>

        {/* Earnings List */}
        {earnings.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <MoneyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Earnings Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete your first job to start earning
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {earnings.map((earning, index) => (
              <EarningCard key={earning.id} earning={earning} index={index} />
            ))}
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default Earnings;
