import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Divider,
  Alert,
  Skeleton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Payment as UpiIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Star as StarIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { paymentService } from '../../services/paymentService';
import LoadingScreen from '../common/LoadingScreen';
import { formatters } from '../../utils/formatters';
import { validators } from '../../utils/validators';

const PaymentMethods = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [showCardNumber, setShowCardNumber] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    isDefault: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentMethods();
      setPaymentMethods(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch payment methods');
      console.error('Error fetching payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.type === 'card') {
      if (!validators.isValidCardNumber(formData.cardNumber)) {
        errors.cardNumber = 'Invalid card number';
      }
      if (!formData.expiryMonth || !formData.expiryYear) {
        errors.expiry = 'Expiry date is required';
      }
      if (!validators.isValidCVV(formData.cvv)) {
        errors.cvv = 'Invalid CVV';
      }
      if (!formData.cardholderName.trim()) {
        errors.cardholderName = 'Cardholder name is required';
      }
    } else if (formData.type === 'upi') {
      if (!validators.isValidUPI(formData.upiId)) {
        errors.upiId = 'Invalid UPI ID';
      }
    } else if (formData.type === 'bank') {
      if (!formData.bankName.trim()) {
        errors.bankName = 'Bank name is required';
      }
      if (!validators.isValidAccountNumber(formData.accountNumber)) {
        errors.accountNumber = 'Invalid account number';
      }
      if (!validators.isValidIFSC(formData.ifscCode)) {
        errors.ifscCode = 'Invalid IFSC code';
      }
      if (!formData.accountHolderName.trim()) {
        errors.accountHolderName = 'Account holder name is required';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      if (editingMethod) {
        await paymentService.updatePaymentMethod(editingMethod.id, formData);
        setSuccess('Payment method updated successfully');
      } else {
        await paymentService.addPaymentMethod(formData);
        setSuccess('Payment method added successfully');
      }
      
      await fetchPaymentMethods();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save payment method');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (methodId) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }
    
    try {
      await paymentService.deletePaymentMethod(methodId);
      setSuccess('Payment method deleted successfully');
      await fetchPaymentMethods();
    } catch (err) {
      setError('Failed to delete payment method');
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      await paymentService.setDefaultPaymentMethod(methodId);
      setSuccess('Default payment method updated');
      await fetchPaymentMethods();
    } catch (err) {
      setError('Failed to update default payment method');
    }
  };

  const handleOpenDialog = (method = null) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        type: method.type,
        cardNumber: method.cardNumber || '',
        expiryMonth: method.expiryMonth || '',
        expiryYear: method.expiryYear || '',
        cvv: '',
        cardholderName: method.cardholderName || '',
        upiId: method.upiId || '',
        bankName: method.bankName || '',
        accountNumber: method.accountNumber || '',
        ifscCode: method.ifscCode || '',
        accountHolderName: method.accountHolderName || '',
        isDefault: method.isDefault || false
      });
    } else {
      setEditingMethod(null);
      setFormData({
        type: 'card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: '',
        upiId: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        isDefault: false
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMethod(null);
    setFormErrors({});
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 100);
  };

  const toggleCardVisibility = (methodId) => {
    setShowCardNumber(prev => ({
      ...prev,
      [methodId]: !prev[methodId]
    }));
  };

  const getPaymentMethodIcon = (type) => {
    switch (type) {
      case 'card':
        return <CreditCardIcon />;
      case 'upi':
        return <UpiIcon />;
      case 'bank':
        return <BankIcon />;
      default:
        return <CreditCardIcon />;
    }
  };

  const getCardType = (cardNumber) => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'American Express';
    return 'Card';
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
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
            Payment Methods
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Add Payment Method
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

        {/* Payment Methods List */}
        {paymentMethods.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <CreditCardIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Payment Methods Added
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add a payment method to make bookings easier
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Your First Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {paymentMethods.map((method, index) => (
              <Grid item xs={12} md={6} key={method.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      position: 'relative',
                      border: method.isDefault ? '2px solid' : '1px solid',
                      borderColor: method.isDefault ? 'primary.main' : 'divider',
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                  >
                    {method.isDefault && (
                      <Chip
                        label="Default"
                        color="primary"
                        size="small"
                        icon={<StarIcon />}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          zIndex: 1
                        }}
                      />
                    )}
                    
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getPaymentMethodIcon(method.type)}
                        <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
                          {method.type === 'card' && getCardType(method.cardNumber)}
                          {method.type === 'upi' && 'UPI'}
                          {method.type === 'bank' && 'Bank Account'}
                        </Typography>
                      </Box>

                      {method.type === 'card' && (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                              {showCardNumber[method.id] 
                                ? formatters.formatCardNumber(method.cardNumber)
                                : maskCardNumber(method.cardNumber)
                              }
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => toggleCardVisibility(method.id)}
                              sx={{ ml: 1 }}
                            >
                              {showCardNumber[method.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {method.cardholderName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </Typography>
                        </Box>
                      )}

                      {method.type === 'upi' && (
                        <Typography variant="body1">
                          {method.upiId}
                        </Typography>
                      )}

                      {method.type === 'bank' && (
                        <Box>
                          <Typography variant="body1" gutterBottom>
                            {method.bankName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {maskCardNumber(method.accountNumber)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.accountHolderName}
                          </Typography>
                        </Box>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SecurityIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                          <Typography variant="caption" color="success.main">
                            Secured
                          </Typography>
                        </Box>
                        
                        <Box>
                          {!method.isDefault && (
                            <Tooltip title="Set as default">
                              <IconButton
                                size="small"
                                onClick={() => handleSetDefault(method.id)}
                                sx={{ mr: 1 }}
                              >
                                <StarIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(method)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(method.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Payment Method Dialog */}
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
            {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
          </DialogTitle>
          
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {/* Payment Type Selection */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  label="Payment Type"
                >
                  <MenuItem value="card">Credit/Debit Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank">Bank Account</MenuItem>
                </Select>
              </FormControl>

              {/* Card Details */}
              {formData.type === 'card' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s/g, ''))}
                      error={!!formErrors.cardNumber}
                      helperText={formErrors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      inputProps={{ maxLength: 19 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      error={!!formErrors.cardholderName}
                      helperText={formErrors.cardholderName}
                    />
                  </Grid>
                  
                  <Grid item xs={4}>
                    <FormControl fullWidth error={!!formErrors.expiry}>
                      <InputLabel>Month</InputLabel>
                      <Select
                        value={formData.expiryMonth}
                        onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                        label="Month"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <FormControl fullWidth error={!!formErrors.expiry}>
                      <InputLabel>Year</InputLabel>
                      <Select
                        value={formData.expiryYear}
                        onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                        label="Year"
                      >
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <MenuItem key={year} value={String(year)}>
                              {year}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="CVV"
                      type="password"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      error={!!formErrors.cvv}
                      helperText={formErrors.cvv}
                      inputProps={{ maxLength: 4 }}
                    />
                  </Grid>
                  
                  {formErrors.expiry && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="error">
                        {formErrors.expiry}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* UPI Details */}
              {formData.type === 'upi' && (
                <TextField
                  fullWidth
                  label="UPI ID"
                  value={formData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                  error={!!formErrors.upiId}
                  helperText={formErrors.upiId}
                  placeholder="yourname@upi"
                />
              )}

              {/* Bank Details */}
              {formData.type === 'bank' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      error={!!formErrors.bankName}
                      helperText={formErrors.bankName}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      error={!!formErrors.accountNumber}
                      helperText={formErrors.accountNumber}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="IFSC Code"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                      error={!!formErrors.ifscCode}
                      helperText={formErrors.ifscCode}
                      placeholder="ABCD0123456"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Account Holder Name"
                      value={formData.accountHolderName}
                      onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      error={!!formErrors.accountHolderName}
                      helperText={formErrors.accountHolderName}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Set as Default */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDefault}
                    onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                  />
                }
                label="Set as default payment method"
                sx={{ mt: 2 }}
              />
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
                editingMethod ? 'Update' : 'Add'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default PaymentMethods;
