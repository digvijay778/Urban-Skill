// src/components/worker/DocumentUpload.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DocumentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Camera as CameraIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { documentService } from '../../services/documentService';
import { uploadService } from '../../services/uploadService';
import LoadingScreen from '../common/LoadingScreen';

const DocumentUpload = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewDialog, setPreviewDialog] = useState({ open: false, document: null });
  const [uploadProgress, setUploadProgress] = useState({});

  // Required documents configuration
  const requiredDocuments = [
    {
      id: 'identity_proof',
      name: 'Identity Proof',
      description: 'Aadhaar Card, Passport, Voter ID, or Driving License',
      required: true,
      maxSize: 5, // MB
      formats: ['jpg', 'jpeg', 'png', 'pdf'],
      examples: ['Front and back of Aadhaar card', 'Passport photo page', 'Voter ID card']
    },
    {
      id: 'address_proof',
      name: 'Address Proof',
      description: 'Utility bill, Bank statement, or Rental agreement',
      required: true,
      maxSize: 5,
      formats: ['jpg', 'jpeg', 'png', 'pdf'],
      examples: ['Electricity bill (last 3 months)', 'Bank statement', 'Rental agreement']
    },
    {
      id: 'professional_certificate',
      name: 'Professional Certificate',
      description: 'Skill certificates, Training certificates, or Experience letters',
      required: false,
      maxSize: 10,
      formats: ['jpg', 'jpeg', 'png', 'pdf'],
      examples: ['Trade certificates', 'Training completion certificates', 'Experience letters']
    },
    {
      id: 'police_verification',
      name: 'Police Verification',
      description: 'Police clearance certificate or Character certificate',
      required: true,
      maxSize: 5,
      formats: ['jpg', 'jpeg', 'png', 'pdf'],
      examples: ['Police clearance certificate', 'Character certificate from local authority']
    },
    {
      id: 'bank_details',
      name: 'Bank Account Proof',
      description: 'Bank passbook or Cancelled cheque',
      required: true,
      maxSize: 5,
      formats: ['jpg', 'jpeg', 'png', 'pdf'],
      examples: ['Bank passbook first page', 'Cancelled cheque', 'Bank statement with account details']
    }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getWorkerDocuments(user.id);
      setDocuments(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file, documentType) => {
    const document = requiredDocuments.find(d => d.id === documentType);
    
    // Check file size
    if (file.size > document.maxSize * 1024 * 1024) {
      throw new Error(`File size should be less than ${document.maxSize}MB`);
    }
    
    // Check file format
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!document.formats.includes(fileExtension)) {
      throw new Error(`Only ${document.formats.join(', ')} files are allowed`);
    }
    
    return true;
  };

  const handleFileUpload = async (file, documentType) => {
    try {
      validateFile(file, documentType);
      
      setUploading(true);
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
      
      // Upload file with progress tracking
      const uploadResult = await uploadService.uploadDocument(
        file, 
        `worker-documents/${user.id}`,
        (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [documentType]: progress }));
        }
      );
      
      // Save document record
      const documentData = {
        workerId: user.id,
        documentType,
        fileName: file.name,
        fileUrl: uploadResult.url,
        fileSize: file.size,
        mimeType: file.type,
        status: 'pending_verification',
        uploadedAt: new Date().toISOString()
      };
      
      const result = await documentService.uploadDocument(documentData);
      
      if (result.success) {
        setSuccess(`${requiredDocuments.find(d => d.id === documentType)?.name} uploaded successfully`);
        await fetchDocuments();
      }
      
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      await documentService.deleteDocument(documentId);
      setSuccess('Document deleted successfully');
      await fetchDocuments();
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const handlePreviewDocument = (document) => {
    setPreviewDialog({ open: true, document });
  };

  const getDocumentStatus = (documentType) => {
    const document = documents.find(d => d.documentType === documentType);
    if (!document) return 'not_uploaded';
    return document.status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending_verification':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'not_uploaded':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon />;
      case 'pending_verification':
        return <WarningIcon />;
      case 'rejected':
        return <CancelIcon />;
      case 'not_uploaded':
        return <DocumentIcon />;
      default:
        return <DocumentIcon />;
    }
  };

  const getVerificationProgress = () => {
    const totalRequired = requiredDocuments.filter(d => d.required).length;
    const uploadedRequired = requiredDocuments
      .filter(d => d.required)
      .filter(d => getDocumentStatus(d.id) !== 'not_uploaded').length;
    
    return Math.round((uploadedRequired / totalRequired) * 100);
  };

  const isVerificationComplete = () => {
    return requiredDocuments
      .filter(d => d.required)
      .every(d => getDocumentStatus(d.id) === 'verified');
  };

  const FileUploadZone = ({ documentType, document }) => {
    const status = getDocumentStatus(documentType);
    const isUploaded = status !== 'not_uploaded';
    const progress = uploadProgress[documentType];
    
    return (
      <Box
        sx={{
          border: 2,
          borderStyle: 'dashed',
          borderColor: isUploaded ? 'success.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          bgcolor: isUploaded ? 'success.light' : 'grey.50',
          position: 'relative',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.light'
          }
        }}
      >
        {progress > 0 && progress < 100 && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}
        
        <input
          type="file"
          id={`upload-${documentType}`}
          hidden
          accept={document.formats.map(f => `.${f}`).join(',')}
          onChange={(e) => {
            if (e.target.files[0]) {
              handleFileUpload(e.target.files[0], documentType);
            }
          }}
          disabled={uploading}
        />
        
        <label htmlFor={`upload-${documentType}`} style={{ cursor: 'pointer' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isUploaded ? (
              <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            ) : (
              <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            )}
            
            <Typography variant="h6" gutterBottom>
              {isUploaded ? 'Document Uploaded' : 'Click to Upload'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {document.description}
            </Typography>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Max size: {document.maxSize}MB | Formats: {document.formats.join(', ')}
            </Typography>
          </Box>
        </label>
      </Box>
    );
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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Document Verification
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload required documents to complete your worker verification process
          </Typography>
        </Box>

        {/* Verification Progress */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flex: 1 }}>
                Verification Progress
              </Typography>
              <Chip
                label={isVerificationComplete() ? 'Complete' : `${getVerificationProgress()}% Complete`}
                color={isVerificationComplete() ? 'success' : 'primary'}
                icon={isVerificationComplete() ? <CheckCircleIcon /> : <InfoIcon />}
              />
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={getVerificationProgress()}
              sx={{ height: 8, borderRadius: 4, mb: 2 }}
            />
            
            <Typography variant="body2" color="text.secondary">
              {requiredDocuments.filter(d => d.required && getDocumentStatus(d.id) === 'verified').length} of{' '}
              {requiredDocuments.filter(d => d.required).length} required documents verified
            </Typography>
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
                sx={{ mb: 3 }}
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
                sx={{ mb: 3 }}
              >
                {success}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document Upload Sections */}
        <Grid container spacing={3}>
          {requiredDocuments.map((document, index) => {
            const status = getDocumentStatus(document.id);
            const uploadedDoc = documents.find(d => d.documentType === document.id);
            
            return (
              <Grid xs={12} key={document.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card sx={{ '&:hover': { boxShadow: 3 } }}>
                    <CardContent>
                      {/* Document Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 3
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 2 }}>
                            {getStatusIcon(status)}
                          </Box>
                          <Box>
                            <Typography variant="h6">
                              {document.name}
                              {document.required && (
                                <Chip 
                                  label="Required" 
                                  size="small" 
                                  color="error" 
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {document.description}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Chip
                          label={status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(status)}
                          variant={status === 'not_uploaded' ? 'outlined' : 'filled'}
                        />
                      </Box>

                      {/* Upload Zone or Document Info */}
                      {status === 'not_uploaded' ? (
                        <FileUploadZone documentType={document.id} document={document} />
                      ) : (
                        <Box>
                          {/* Uploaded Document Info */}
                          <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DocumentIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                <Box>
                                  <Typography variant="subtitle2">
                                    {uploadedDoc?.fileName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Uploaded on {new Date(uploadedDoc?.uploadedAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handlePreviewDocument(uploadedDoc)}
                                  sx={{ mr: 1 }}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                                
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteDocument(uploadedDoc?.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </Paper>

                          {/* Status Messages */}
                          {status === 'rejected' && uploadedDoc?.rejectionReason && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Document Rejected
                              </Typography>
                              <Typography variant="body2">
                                {uploadedDoc.rejectionReason}
                              </Typography>
                            </Alert>
                          )}

                          {status === 'pending_verification' && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                              Document is under review. You will be notified once verified.
                            </Alert>
                          )}

                          {status === 'verified' && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                              Document verified successfully!
                            </Alert>
                          )}

                          {/* Re-upload option for rejected documents */}
                          {status === 'rejected' && (
                            <FileUploadZone documentType={document.id} document={document} />
                          )}
                        </Box>
                      )}

                      {/* Document Examples */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Accepted Documents:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {document.examples.map((example, idx) => (
                            <Chip
                              key={idx}
                              label={example}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Verification Status Summary */}
        {isVerificationComplete() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ mt: 4, bgcolor: 'success.light', border: 2, borderColor: 'success.main' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Verification Complete!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  All required documents have been verified. You can now start accepting job requests.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Document Preview Dialog */}
        <Dialog
          open={previewDialog.open}
          onClose={() => setPreviewDialog({ open: false, document: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Document Preview
          </DialogTitle>
          <DialogContent>
            {previewDialog.document && (
              <Box sx={{ textAlign: 'center' }}>
                {previewDialog.document.mimeType?.startsWith('image/') ? (
                  <img
                    src={previewDialog.document.fileUrl}
                    alt="Document preview"
                    style={{ maxWidth: '100%', maxHeight: '500px' }}
                  />
                ) : (
                  <Box sx={{ py: 4 }}>
                    <DocumentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      {previewDialog.document.fileName}
                    </Typography>
                    <Button
                      variant="contained"
                      href={previewDialog.document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Document
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialog({ open: false, document: null })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default DocumentUpload;
