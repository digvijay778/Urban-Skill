// src/pages/HowItWorks.jsx - Professional Aligned Version
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedTab, setSelectedTab] = useState(0);

  const customerSteps = [
    {
      title: "Search & Browse",
      description: "Find the perfect service for your needs",
      details:
        "Browse through our wide range of professional services or use our smart search to find exactly what you need.",
      icon: <SearchIcon />,
      color: "primary",
    },
    {
      title: "Choose Professional",
      description: "Select from verified professionals",
      details:
        "View detailed profiles, read reviews, check ratings, and compare prices from verified professionals.",
      icon: <PersonAddIcon />,
      color: "secondary",
    },
    {
      title: "Book & Schedule",
      description: "Schedule at your convenience",
      details:
        "Pick your preferred date and time. Get instant confirmation with flexible scheduling options.",
      icon: <ScheduleIcon />,
      color: "info",
    },
    {
      title: "Secure Payment",
      description: "Pay safely after completion",
      details:
        "Multiple payment options with secure processing. Pay only after service completion confirmation.",
      icon: <PaymentIcon />,
      color: "success",
    },
    {
      title: "Rate & Review",
      description: "Share your experience",
      details:
        "Rate the service and leave a review to help other customers and maintain quality standards.",
      icon: <StarIcon />,
      color: "warning",
    },
  ];

  const workerSteps = [
    {
      title: "Sign Up & Verify",
      description: "Join our professional network",
      details:
        "Create your profile, upload documents, and complete our thorough verification process.",
      icon: <PersonAddIcon />,
      color: "primary",
    },
    {
      title: "Build Your Profile",
      description: "Showcase your expertise",
      details:
        "Add services, set rates, upload work photos, and highlight your professional experience.",
      icon: <VerifiedIcon />,
      color: "secondary",
    },
    {
      title: "Receive Requests",
      description: "Get job notifications",
      details:
        "Receive job requests based on your skills and location. Accept jobs that fit your schedule.",
      icon: <ScheduleIcon />,
      color: "info",
    },
    {
      title: "Complete Jobs",
      description: "Deliver quality service",
      details:
        "Arrive on time, complete jobs professionally, and ensure customer satisfaction.",
      icon: <CheckCircleIcon />,
      color: "success",
    },
    {
      title: "Get Paid",
      description: "Receive secure payments",
      details:
        "Get paid directly to your bank account with weekly payouts and transparent fees.",
      icon: <PaymentIcon />,
      color: "warning",
    },
  ];

  const features = [
    {
      title: "Verified Professionals",
      description: "Thorough background verification for all service providers",
      icon: <SecurityIcon />,
      color: "primary",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support for assistance",
      icon: <SupportIcon />,
      color: "secondary",
    },
    {
      title: "Secure Payments",
      description: "Multiple payment options with secure processing",
      icon: <PaymentIcon />,
      color: "success",
    },
    {
      title: "Quality Assurance",
      description: "Rating system and quality checks for excellence",
      icon: <StarIcon />,
      color: "warning",
    },
  ];

  const faqs = [
    {
      question: "How do I book a service?",
      answer:
        "Search for your needed service, browse professionals, select based on ratings, choose your time slot, and confirm booking.",
    },
    {
      question: "Are professionals verified?",
      answer:
        "Yes, all professionals undergo thorough background verification including identity checks, skill assessments, and references.",
    },
    {
      question: "What if I'm not satisfied?",
      answer:
        "We have a satisfaction guarantee. Contact support within 24 hours and we'll resolve any issues.",
    },
    {
      question: "How do payments work?",
      answer:
        "Pay using cash, cards, or digital wallets. Payment processes only after you confirm service completion.",
    },
    {
      question: "Can I reschedule bookings?",
      answer:
        "Yes, reschedule or cancel up to 2 hours before scheduled time without charges.",
    },
    {
      question: "How to become a professional?",
      answer:
        "Sign up, complete verification, build your profile, and start receiving job requests.",
    },
  ];

  const StepCard = ({ step, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        sx={{
          height: "100%",
          textAlign: "center",
          position: "relative",
          "&:hover": {
            transform: "translateY(-8px)",
            transition: "all 0.3s ease",
            boxShadow: 6,
          },
        }}
      >
        <CardContent sx={{ p: 4, pt: 5 }}>
          {" "}
          {/* FIXED: More top padding */}
          {/* Step Number - FIXED: Move INSIDE the card */}
          <Box
            sx={{
              position: "absolute",
              top: 15, // FIXED: Inside the card now
              left: 15, // FIXED: Move to top-right corner
              bgcolor: `${step.color}.main`,
              color: "white",
              width: 35,
              height: 35,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: 2,
            }}
          >
            {index + 1}
          </Box>
          {/* Icon */}
          <Avatar
            sx={{
              bgcolor: `${step.color}.light`,
              width: 80,
              height: 80,
              mx: "auto",
              mb: 3,
              mt: 1,
              color: `${step.color}.main`,
            }}
          >
            {step.icon}
          </Avatar>
          {/* Content */}
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ minHeight: 48 }}
          >
            {step.title}
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            {step.description}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6, minHeight: 60 }}
          >
            {step.details}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FeatureCard = ({ feature, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        sx={{
          height: "100%",
          textAlign: "center",
          "&:hover": {
            transform: "translateY(-4px)",
            transition: "all 0.3s ease",
            boxShadow: 4,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Avatar
            sx={{
              bgcolor: `${feature.color}.light`,
              width: 64,
              height: 64,
              mx: "auto",
              mb: 3,
              color: `${feature.color}.main`,
            }}
          >
            {feature.icon}
          </Avatar>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ minHeight: 48 }}
          >
            {feature.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {feature.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box>
      {/* Hero Section - Properly Aligned */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 10, md: 15 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 900, mx: "auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
              >
                How Urban Skill Works
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  opacity: 0.9,
                  lineHeight: 1.4,
                  maxWidth: 700,
                  mx: "auto",
                }}
              >
                Connecting customers with skilled professionals in just a few
                simple steps. Experience the future of home services.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "white",
                    color: "white",
                    borderWidth: "2px",
                    borderColor: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                      color: "#4f46e5",
                      borderColor: "white",
                    },
                  }}
                  onClick={() => navigate("/services")}
                >
                  Book a Service
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    borderColor: "white",
                    borderWidth: "2px",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        {/* User Type Selection - Centered */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Choose Your Journey
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
          >
            Discover how Urban Skill works for customers and professionals
          </Typography>

          <Paper
            sx={{
              display: "inline-block",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              variant="fullWidth"
              sx={{
                minWidth: 400,
                "& .MuiTab-root": {
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                },
              }}
            >
              <Tab label="For Customers" />
              <Tab label="For Professionals" />
            </Tabs>
          </Paper>
        </Box>

        {/* Steps Section - Properly Spaced */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {selectedTab === 0
                ? "How Customers Use Urban Skill"
                : "How Professionals Join Urban Skill"}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              {selectedTab === 0
                ? "Get professional services delivered to your doorstep in 5 simple steps"
                : "Start earning by offering your professional services through our platform"}
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {(selectedTab === 0 ? customerSteps : workerSteps).map(
              (step, index) => (
                <Grid xs={12} sm={6} md={4} lg={2.4} key={step.title}>
                  <StepCard step={step} index={index} />
                </Grid>
              )
            )}
          </Grid>
        </Box>

        {/* Features Section - Centered Grid */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Why Choose Urban Skill?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              We ensure quality, security, and convenience in every interaction
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid xs={12} sm={6} md={3} key={feature.title}>
                <FeatureCard feature={feature} index={index} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section - Centered */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Get answers to common questions about our platform
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Grid container spacing={2}>
              {faqs.map((faq, index) => (
                <Grid xs={12} md={6} key={index}>
                  <Accordion
                    sx={{
                      mb: 1,
                      "&:hover": { boxShadow: 2 },
                      "&.Mui-expanded": { boxShadow: 3 },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* CTA Section - Perfectly Centered */}
        <Paper
          sx={{
            p: { xs: 4, md: 8 },
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 6, opacity: 0.9, maxWidth: 600, mx: "auto" }}
            >
              Join thousands of satisfied customers and professionals on Urban
              Skill today
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderWidth: "2px",
                  borderColor: "white",

                  "&:hover": {
                    bgcolor: "grey.100",
                    // color: 'primary.dark',
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate("/services")}
              >
                Book Your First Service
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => navigate("/register?role=worker")}
              >
                Become a Professional
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HowItWorks;
