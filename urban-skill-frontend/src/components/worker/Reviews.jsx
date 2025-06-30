// src/components/worker/Reviews.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  Chip,
  Divider,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Star as StarIcon,
  Reply as ReplyIcon,
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  Flag as FlagIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import { formatters } from '../../utils/formatters';
import LoadingScreen from '../common/LoadingScreen';

const WorkerReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openResponseDialog, setOpenResponseDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    rating: 'all',
    status: 'all',
    sortBy: 'newest'
  });

  // Statistics
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    responseRate: 0,
    pendingResponses: 0,
    recentTrend: 0
  });

  const tabLabels = [
    { label: 'All Reviews', value: 'all', count: reviews.length },
    { label: 'Pending Response', value: 'pending', count: stats.pendingResponses },
    { label: 'Recent', value: 'recent' },
    { label: 'High Rated', value: 'high_rated' },
    { label: 'Low Rated', value: 'low_rated' }
  ];

  useEffect(() => {
    fetchReviews();
  }, [filters, selectedTab]);

  useEffect(() => {
    calculateStats();
  }, [reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getWorkerReviews(user.id, {
        ...filters,
        tab: tabLabels[selectedTab].value
      });
      setReviews(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / totalReviews 
      : 0;

    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.overallRating] = (dist[review.overallRating] || 0) + 1;
      return dist;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    const respondedReviews = reviews.filter(review => review.workerResponse).length;
    const responseRate = totalReviews > 0 ? (respondedReviews / totalReviews) * 100 : 0;
    const pendingResponses = reviews.filter(review => !review.workerResponse).length;

    // Calculate recent trend (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentReviews = reviews.filter(review => new Date(review.createdAt) >= thirtyDaysAgo);
    const previousReviews = reviews.filter(review => {
      const reviewDate = new Date(review.createdAt);
      return reviewDate >= sixtyDaysAgo && reviewDate < thirtyDaysAgo;
    });

    const recentAvg = recentReviews.length > 0 
      ? recentReviews.reduce((sum, review) => sum + review.overallRating, 0) / recentReviews.length 
      : 0;
    const previousAvg = previousReviews.length > 0 
      ? previousReviews.reduce((sum, review) => sum + review.overallRating, 0) / previousReviews.length 
      : 0;

    const recentTrend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

    setStats({
      averageRating,
      totalReviews,
      ratingDistribution,
      responseRate,
      pendingResponses,
      recentTrend
    });
  };

  const handleRespondToReview = async () => {
    if (!responseText.trim()) {
      setError('Please enter a response');
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.respondToReview(selectedReview.id, {
        response: responseText.trim(),
        workerId: user.id
      });
      
      setSuccess('Response submitted successfully');
      setResponseText('');
      setOpenResponseDialog(false);
      await fetchReviews();
    } catch (err) {
      setError('Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenResponseDialog = (review) => {
    setSelectedReview(review);
    setResponseText(review.workerResponse || '');
    setOpenResponseDialog(true);
  };

  const handleCloseResponseDialog = () => {
    setOpenResponseDialog(false);
    setSelectedReview(null);
    setResponseText('');
    setError('');
  };

  const handleMenuClick = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const getFilteredReviews = () => {
    let filtered = reviews;
    
    if (filters.rating !== 'all') {
      filtered = filtered.filter(review => review.overallRating >= parseInt(filters.rating));
    }
    
    if (filters.status === 'responded') {
      filtered = filtered.filter(review => review.workerResponse);
    } else if (filters.status === 'pending') {
      filtered = filtered.filter(review => !review.workerResponse);
    }
    
    // Sort reviews
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest_rated':
        filtered.sort((a, b) => b.overallRating - a.overallRating);
        break;
      case 'lowest_rated':
        filtered.sort((a, b) => a.overallRating - b.overallRating);
        break;
    }
    
    return filtered;
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

  const ReviewCard = ({ review, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card sx={{ 
        mb: 2, 
        '&:hover': { boxShadow: 3 },
        border: !review.workerResponse ? 2 : 1,
        borderColor: !review.workerResponse ? 'warning.main' : 'divider'
      }}>
        <CardContent>
          {/* Review Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={review.customer?.profileImage}
                sx={{ width: 48, height: 48, mr: 2 }}
              >
                {review.customer?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {review.customer?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={review.service?.name}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatters.formatDate(review.createdAt)}
                  </Typography>
                  {!review.workerResponse && (
                    <Chip
                      label="Needs Response"
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                value={review.overallRating}
                readOnly
                size="small"
                sx={{ mr: 1 }}
              />
              <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, review)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Review Content */}
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {review.comment}
          </Typography>

          {/* Detailed Ratings */}
          {(review.serviceQuality || review.punctuality || review.professionalism || review.valueForMoney) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Detailed Ratings
              </Typography>
              <Grid container spacing={2}>
                {review.serviceQuality && (
                  <Grid xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Service Quality
                      </Typography>
                      <Rating
                        value={review.serviceQuality}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </Grid>
                )}
                {review.punctuality && (
                  <Grid xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Punctuality
                      </Typography>
                      <Rating
                        value={review.punctuality}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </Grid>
                )}
                {review.professionalism && (
                  <Grid xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Professionalism
                      </Typography>
                      <Rating
                        value={review.professionalism}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </Grid>
                )}
                {review.valueForMoney && (
                  <Grid xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Value for Money
                      </Typography>
                      <Rating
                        value={review.valueForMoney}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Your Response */}
          {review.workerResponse ? (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'primary.light', 
              borderRadius: 1,
              mb: 2
            }}>
              <Typography variant="subtitle2" gutterBottom>
                Your Response
              </Typography>
              <Typography variant="body2">
                {review.workerResponse}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Responded on {formatters.formatDate(review.responseDate)}
              </Typography>
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              This review is waiting for your response. Responding to reviews helps build trust with customers.
            </Alert>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant={review.workerResponse ? "outlined" : "contained"}
              startIcon={<ReplyIcon />}
              onClick={() => handleOpenResponseDialog(review)}
              size="small"
            >
              {review.workerResponse ? 'Edit Response' : 'Respond'}
            </Button>
          </Box>

          {/* Review Stats */}
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThumbUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {review.helpfulCount || 0} found helpful
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Job completed {formatters.formatRelativeTime(review.jobCompletedAt)}
              </Typography>
            </Box>
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
            Customer Reviews
          </Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={() => fetchReviews()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Average Rating"
              value={stats.averageRating.toFixed(1)}
              subtitle={`From ${stats.totalReviews} reviews`}
              icon={<StarIcon />}
              color="primary"
              trend={stats.recentTrend}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Response Rate"
              value={`${stats.responseRate.toFixed(0)}%`}
              subtitle={`${stats.totalReviews - stats.pendingResponses} responded`}
              icon={<ReplyIcon />}
              color="success"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Responses"
              value={stats.pendingResponses}
              subtitle="Need your attention"
              icon={<FlagIcon />}
              color="warning"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Reviews"
              value={stats.totalReviews}
              subtitle="All time"
              icon={<ThumbUpIcon />}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Rating Distribution */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rating Distribution
            </Typography>
            <Grid container spacing={2}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Grid xs={12} sm={2.4} key={rating}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1, minWidth: 20 }}>
                      {rating}
                    </Typography>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main', mr: 1 }} />
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {stats.ratingDistribution[rating]}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
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

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabLabels.map((tab, index) => (
              <Tab
                key={tab.value}
                label={
                  <Badge badgeContent={tab.count} color="primary">
                    {tab.label}
                  </Badge>
                }
              />
            ))}
          </Tabs>
        </Paper>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rating</InputLabel>
              <Select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                label="Rating"
              >
                <MenuItem value="all">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4+ Stars</MenuItem>
                <MenuItem value="3">3+ Stars</MenuItem>
                <MenuItem value="2">2+ Stars</MenuItem>
                <MenuItem value="1">1+ Stars</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                <MenuItem value="all">All Reviews</MenuItem>
                <MenuItem value="pending">Pending Response</MenuItem>
                <MenuItem value="responded">Responded</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                label="Sort By"
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="highest_rated">Highest Rated</MenuItem>
                <MenuItem value="lowest_rated">Lowest Rated</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Reviews List */}
        {getFilteredReviews().length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <StarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Reviews Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete your first job to start receiving reviews from customers
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {getFilteredReviews().map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </Box>
        )}

        {/* Review Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleOpenResponseDialog(selectedReview);
            handleMenuClose();
          }}>
            <ReplyIcon sx={{ mr: 1 }} />
            {selectedReview?.workerResponse ? 'Edit Response' : 'Respond'}
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <FlagIcon sx={{ mr: 1 }} />
            Report Issue
          </MenuItem>
        </Menu>

        {/* Response Dialog */}
        <Dialog
          open={openResponseDialog}
          onClose={handleCloseResponseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>
            {selectedReview?.workerResponse ? 'Edit Your Response' : 'Respond to Review'}
          </DialogTitle>
          
          <DialogContent>
            {selectedReview && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Review from {selectedReview.customer?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={selectedReview.overallRating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {selectedReview.overallRating}/5
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  "{selectedReview.comment}"
                </Typography>
              </Box>
            )}
            
            <TextField
              fullWidth
              label="Your Response"
              multiline
              rows={4}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Thank the customer and address any specific points they mentioned..."
              helperText="Be professional, courteous, and address any concerns raised in the review"
            />
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseResponseDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleRespondToReview}
              disabled={submitting || !responseText.trim()}
              startIcon={<SendIcon />}
              sx={{ minWidth: 120 }}
            >
              {submitting ? 'Sending...' : 'Send Response'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default WorkerReviews;
