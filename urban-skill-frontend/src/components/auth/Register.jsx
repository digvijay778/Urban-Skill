import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  Google,
  Facebook,
  Work,
  LocationOn,
  Sms,
  Timer,
  CheckCircle,
} from "@mui/icons-material";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@context/AuthContext";
import { authService } from "@services/authService";
import { APP_CONFIG, USER_ROLES, SERVICE_CATEGORIES } from "@utils/constants";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { register, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  // Get role from URL params
  const roleFromUrl = searchParams.get("role");

  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [userRole, setUserRole] = useState(roleFromUrl || "customer");
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Professional Info (for workers)
    profession: "",
    experience: "",
    skills: [],
    location: "",
    description: "",

    // Agreements
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeNewsletter: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP states
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Registration steps
  const steps =
    userRole === "worker"
      ? ["Basic Info", "Professional Details", "Verification"]
      : ["Basic Info", "Verification"];

  // Profession options
  const professions = [
    { value: "cleaning", label: "Home Cleaning" },
    { value: "electrical", label: "Electrical Services" },
    { value: "plumbing", label: "Plumbing" },
    { value: "ac_repair", label: "AC Repair" },
    { value: "carpentry", label: "Carpentry" },
    { value: "painting", label: "Painting" },
    { value: "appliance", label: "Appliance Repair" },
    { value: "gardening", label: "Gardening" },
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((timer) => {
          if (timer <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      // Basic Info
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password =
          "Password must contain uppercase, lowercase, and number";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }

    if (step === 1 && userRole === "worker") {
      // Professional Details
      if (!formData.profession)
        newErrors.profession = "Please select your profession";
      if (!formData.experience) newErrors.experience = "Experience is required";
      if (!formData.location.trim())
        newErrors.location = "Location is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 0 && !phoneVerified) {
        // Send OTP for phone verification
        handleSendOtp();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Send OTP for phone verification
  const handleSendOtp = async () => {
    setOtpLoading(true);
    setErrors({});

    try {
      // Simulate OTP sending
      console.log("Sending OTP to:", formData.phone);
      setTimeout(() => {
        setOtpSent(true);
        setOtpDialogOpen(true);
        setOtpTimer(60);
        setCanResendOtp(false);
        setOtpLoading(false);
      }, 1000);
    } catch (error) {
      setErrors({ phone: "Failed to send OTP. Please try again." });
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate OTP verification
      console.log("Verifying OTP:", otp);
      setTimeout(() => {
        setPhoneVerified(true);
        setOtpDialogOpen(false);
        setActiveStep((prev) => prev + 1);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setErrors({ otp: "OTP verification failed. Please try again." });
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setOtpLoading(true);
    setErrors({});

    try {
      console.log("Resending OTP to:", formData.phone);
      setTimeout(() => {
        setOtpTimer(60);
        setCanResendOtp(false);
        setOtpLoading(false);
      }, 1000);
    } catch (error) {
      setErrors({ otp: "Failed to resend OTP. Please try again." });
      setOtpLoading(false);
    }
  };

  // Handle final registration
  const handleRegister = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setErrors({});

    try {
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\D/g, ""),
        password: formData.password,
        role: userRole,
        phoneVerified: phoneVerified,
        agreeToTerms: formData.agreeToTerms,
        subscribeNewsletter: formData.subscribeNewsletter,
      };

      // Add professional details for workers
      if (userRole === "worker") {
        registrationData.professionalInfo = {
          profession: formData.profession,
          experience: formData.experience,
          location: formData.location.trim(),
          description: formData.description.trim(),
          skills: formData.skills,
        };
      }

      console.log("Registration data:", registrationData);

      // Simulate registration
      setTimeout(() => {
        setLoading(false);
        navigate("/login", {
          state: {
            message: "Registration successful! Please login to continue.",
            type: "success",
          },
        });
      }, 2000);
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred. Please try again." });
      setLoading(false);
    }
  };

  // Handle social registration
  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
  };

  // Toggle password visibility
  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone || "We will verify this number with OTP"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
                endAdornment: phoneVerified && (
                  <InputAdornment position="end">
                    <CheckCircle color="success" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
              placeholder="Enter 10-digit phone number"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={!!errors.password}
              helperText={
                errors.password ||
                "Minimum 8 characters with uppercase, lowercase, and number"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* Terms & Privacy Checkbox - Fixed Alignment */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      handleInputChange("agreeToTerms", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    I agree to the{" "}
                    <Link
                      component={RouterLink}
                      to="/terms"
                      color="primary"
                      sx={{ textDecoration: "none" }}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      component={RouterLink}
                      to="/privacy"
                      color="primary"
                      sx={{ textDecoration: "none" }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{
                  alignItems: "flex-start",
                  "& .MuiFormControlLabel-label": {
                    paddingTop: "9px",
                  },
                }}
              />
              {errors.agreeToTerms && (
                <Typography
                  variant="caption"
                  color="error"
                  display="block"
                  sx={{ ml: 4, mt: 0.5 }}
                >
                  {errors.agreeToTerms}
                </Typography>
              )}
            </Box>

            {/* Newsletter Checkbox - Fixed Alignment */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.subscribeNewsletter}
                    onChange={(e) =>
                      handleInputChange("subscribeNewsletter", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    Subscribe to newsletter for updates and offers
                  </Typography>
                }
                sx={{
                  alignItems: "flex-start",
                  "& .MuiFormControlLabel-label": {
                    paddingTop: "9px",
                  },
                }}
              />
            </Box>
          </motion.div>
        );

      case 1: // Professional Details (for workers)
        if (userRole !== "worker") return null;

        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.profession}>
              <InputLabel>Profession</InputLabel>
              <Select
                value={formData.profession}
                label="Profession"
                onChange={(e) =>
                  handleInputChange("profession", e.target.value)
                }
              >
                {professions.map((prof) => (
                  <MenuItem key={prof.value} value={prof.value}>
                    {prof.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.profession && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 2 }}
                >
                  {errors.profession}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Years of Experience"
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              error={!!errors.experience}
              helperText={errors.experience}
              sx={{ mb: 3 }}
              placeholder="e.g., 5 years"
            />

            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
              placeholder="City, State"
            />

            <TextField
              fullWidth
              label="Professional Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              error={!!errors.description}
              helperText={
                errors.description || "Describe your skills and experience"
              }
              sx={{ mb: 3 }}
              placeholder="Tell customers about your expertise and services..."
            />
          </motion.div>
        );

      case 2: // Verification (final step)
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircle
                sx={{ fontSize: 64, color: "success.main", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Almost Done!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Review your information and complete registration
              </Typography>

              <Card sx={{ textAlign: "left", mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Registration Summary
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {formData.firstName}{" "}
                    {formData.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {formData.email}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {formData.phone}{" "}
                    {phoneVerified && "✓"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Role:</strong>{" "}
                    {userRole === "worker" ? "Professional" : "Customer"}
                  </Typography>
                  {userRole === "worker" && (
                    <>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Profession:</strong>{" "}
                        {
                          professions.find(
                            (p) => p.value === formData.profession
                          )?.label
                        }
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Experience:</strong> {formData.experience}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Location:</strong> {formData.location}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>

              {errors.submit && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.submit}
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={handleRegister}
                disabled={loading}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
                textAlign: "center",
                py: 4,
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Join {APP_CONFIG?.NAME || "Urban Skill"}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {userRole === "worker"
                  ? "Start your professional journey with us"
                  : "Get started with home services"}
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {/* Role Toggle */}
              <Box
                sx={{
                  display: "flex",
                  mb: 4,
                  backgroundColor: "grey.100",
                  borderRadius: 2,
                  p: 0.5,
                }}
              >
                <Button
                  fullWidth
                  variant={userRole === "customer" ? "contained" : "text"}
                  onClick={() => setUserRole("customer")}
                  sx={{
                    borderRadius: 1.5,
                    color: userRole === "customer" ? "white" : "text.primary",
                  }}
                >
                  I'm a Customer
                </Button>
                <Button
                  fullWidth
                  variant={userRole === "worker" ? "contained" : "text"}
                  onClick={() => setUserRole("worker")}
                  sx={{
                    borderRadius: 1.5,
                    color: userRole === "worker" ? "white" : "text.primary",
                  }}
                >
                  I'm a Professional
                </Button>
              </Box>

              {/* Stepper */}
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step Content */}
              {getStepContent(activeStep)}

              {/* Navigation Buttons */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  size="large"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={
                    activeStep === steps.length - 1
                      ? handleRegister
                      : handleNext
                  }
                  disabled={loading || otpLoading}
                  size="large"
                >
                  {loading || otpLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    "Complete Registration"
                  ) : activeStep === 0 && !phoneVerified ? (
                    "Verify Phone"
                  ) : (
                    "Next"
                  )}
                </Button>
              </Box>

              {/* Social Registration */}
              {activeStep === 0 && (
                <>
                  <Divider sx={{ my: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      or continue with
                    </Typography>
                  </Divider>

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Google />}
                      onClick={() => handleSocialRegister("google")}
                      sx={{ py: 1.5 }}
                    >
                      Google
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Facebook />}
                      onClick={() => handleSocialRegister("facebook")}
                      sx={{ py: 1.5 }}
                    >
                      Facebook
                    </Button>
                  </Box>
                </>
              )}

              {/* Login Link */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    color="primary"
                    sx={{ textDecoration: "none", fontWeight: "bold" }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* OTP Dialog */}
      <Dialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Verify Phone Number</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We've sent a 6-digit code to {formData.phone}
          </Typography>

          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            error={!!errors.otp}
            helperText={errors.otp}
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                letterSpacing: "0.5rem",
              },
            }}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {otpTimer > 0
                ? `Resend in ${formatTimer(otpTimer)}`
                : "Didn't receive code?"}
            </Typography>
            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={!canResendOtp || otpLoading}
            >
              Resend
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleOtpVerification}
            disabled={loading || !otp || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register;








