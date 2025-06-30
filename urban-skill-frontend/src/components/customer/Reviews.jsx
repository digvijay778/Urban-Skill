// src/components/customer/Reviews.jsx
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
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  Reply as ReplyIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { reviewService } from '../../services/reviewService';
import { formatters } from '../../utils/formatters';
import LoadingScreen from '../common/LoadingScreen';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    serviceQuality: 5,
    punctuality: 5,
    professionalism: 5,
    valueForMoney: 5
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getCustomerReviews(user.id);
      setReviews(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.rating === 0) {
      errors.rating = 'Please provide a rating';
    }
    
    if (!formData.comment.trim()) {
      errors.comment = 'Please write a review comment';
    } else if (formData.comment.trim().length < 10) {
      errors.comment = 'Review must be at least 10 characters long';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const reviewData = {
        ...formData,
        customerId: user.id,
        overallRating: formData.rating
      };
      
      if (editingReview) {
        await reviewService.updateReview(editingReview.id, reviewData);
        setSuccess('Review updated successfully');
      } else {
        await reviewService.createReview(reviewData);
        setSuccess('Review submitted successfully');
      }
      
      await fetchReviews();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await reviewService.deleteReview(reviewId);
      setSuccess('Review deleted successfully');
      await fetchReviews();
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  const handleOpenDialog = (review = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        rating: review.overallRating,
        comment: review.comment,
        serviceQuality: review.serviceQuality || 5,
        punctuality: review.punctuality || 5,
        professionalism: review.professionalism || 5,
        valueForMoney: review.valueForMoney || 5
      });
    } else {
      setEditingReview(null);
      setFormData({
        rating: 0,
        comment: '',
        serviceQuality: 5,
        punctuality: 5,
        professionalism: 5,
        valueForMoney: 5
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReview(null);
    setFormErrors({});
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 100);
  };

  const handleMenuClick = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const getServiceTypeColor = (serviceType) => {
    const colors = {
      'cleaning': 'primary',
      'plumbing': 'secondary',
      'electrical': 'warning',
      'appliance': 'info',
      'beauty': 'success'
    };
    return colors[serviceType] || 'default';
  };

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
            My Reviews
          </Typography>
          <Button
            variant="contained"
            startIcon={<StarIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Write Review
          </Button>
        </Box>

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

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <StarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Reviews Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Share your experience with services you've used
              </Typography>
              <Button
                variant="contained"
                startIcon={<StarIcon />}
                onClick={() => handleOpenDialog()}
              >
                Write Your First Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {reviews.map((review, index) => (
              <Grid xs={12} key={review.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card sx={{ '&:hover': { boxShadow: 3 } }}>
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
                            src={review.worker?.profileImage}
                            sx={{ width: 48, height: 48, mr: 2 }}
                          >
                            {review.worker?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {review.worker?.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={review.service?.name}
                                color={getServiceTypeColor(review.service?.category)}
                                size="small"
                              />
                              <Typography variant="caption" color="text.secondary">
                                {formatters.formatDate(review.createdAt)}
                              </Typography>
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

                      {/* Review Actions */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Tooltip title="Helpful">
                            <IconButton size="small">
                              <ThumbUpIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Typography variant="caption">
                            {review.helpfulCount || 0} found helpful
                          </Typography>
                        </Box>
                        
                        {review.workerResponse && (
                          <Chip
                            icon={<ReplyIcon />}
                            label="Worker Responded"
                            variant="outlined"
                            size="small"
                            color="primary"
                          />
                        )}
                      </Box>

                      {/* Worker Response */}
                      {review.workerResponse && (
                        <Box sx={{ 
                          mt: 2, 
                          p: 2, 
                          bgcolor: 'grey.50', 
                          borderRadius: 1,
                          borderLeft: 3,
                          borderColor: 'primary.main'
                        }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Response from {review.worker?.name}
                          </Typography>
                          <Typography variant="body2">
                            {review.workerResponse}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatters.formatDate(review.responseDate)}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Review Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleOpenDialog(selectedReview);
            handleMenuClose();
          }}>
            <EditIcon sx={{ mr: 1 }} />
            Edit Review
          </MenuItem>
          <MenuItem onClick={() => {
            handleDelete(selectedReview?.id);
            handleMenuClose();
          }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Review
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <FlagIcon sx={{ mr: 1 }} />
            Report Issue
          </MenuItem>
        </Menu>

        {/* Add/Edit Review Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>
            {editingReview ? 'Edit Review' : 'Write Review'}
          </DialogTitle>
          
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {/* Overall Rating */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Overall Rating *
                </Typography>
                <Rating
                  value={formData.rating}
                  onChange={(event, value) => handleInputChange('rating', value)}
                  size="large"
                  sx={{ mb: 1 }}
                />
                {formErrors.rating && (
                  <Typography variant="caption" color="error">
                    {formErrors.rating}
                  </Typography>
                )}
              </Box>

              {/* Review Comment */}
              <TextField
                fullWidth
                label="Write your review *"
                multiline
                rows={4}
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                error={!!formErrors.comment}
                helperText={formErrors.comment || 'Share your experience with this service'}
                sx={{ mb: 3 }}
              />

              {/* Detailed Ratings */}
              <Typography variant="subtitle1" gutterBottom>
                Detailed Ratings (Optional)
              </Typography>
              
              <Grid container spacing={3}>
                <Grid xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Service Quality
                  </Typography>
                  <Rating
                    value={formData.serviceQuality}
                    onChange={(event, value) => handleInputChange('serviceQuality', value)}
                  />
                </Grid>
                
                <Grid xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Punctuality
                  </Typography>
                  <Rating
                    value={formData.punctuality}
                    onChange={(event, value) => handleInputChange('punctuality', value)}
                  />
                </Grid>
                
                <Grid xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Professionalism
                  </Typography>
                  <Rating
                    value={formData.professionalism}
                    onChange={(event, value) => handleInputChange('professionalism', value)}
                  />
                </Grid>
                
                <Grid xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Value for Money
                  </Typography>
                  <Rating
                    value={formData.valueForMoney}
                    onChange={(event, value) => handleInputChange('valueForMoney', value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ minWidth: 120 }}
            >
              {submitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">Saving...</Typography>
                </Box>
              ) : (
                editingReview ? 'Update Review' : 'Submit Review'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default Reviews;
