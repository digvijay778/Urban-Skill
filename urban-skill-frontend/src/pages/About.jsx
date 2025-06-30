// src/pages/About.jsx
import React from "react";
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
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Groups as GroupsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Handshake as HandshakeIcon,
  Shield as ShieldIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Company statistics
  const stats = [
    { label: "Happy Customers", value: "50,000+", icon: <GroupsIcon /> },
    {
      label: "Verified Professionals",
      value: "10,000+",
      icon: <CheckCircleIcon />,
    },
    {
      label: "Services Completed",
      value: "2,00,000+",
      icon: <HandshakeIcon />,
    },
    { label: "Cities Covered", value: "25+", icon: <LocationIcon /> },
  ];

  // Core values
  const values = [
    {
      title: "Trust & Safety",
      description:
        "All professionals are background verified and trained to ensure your safety and satisfaction.",
      icon: <ShieldIcon />,
      color: "primary",
    },
    {
      title: "Quality Service",
      description:
        "We maintain high standards through rigorous screening and continuous quality monitoring.",
      icon: <StarIcon />,
      color: "warning",
    },
    {
      title: "Convenience",
      description:
        "Book services anytime, anywhere with our easy-to-use platform and flexible scheduling.",
      icon: <SpeedIcon />,
      color: "info",
    },
    {
      title: "24/7 Support",
      description:
        "Our dedicated customer support team is always ready to help you with any queries.",
      icon: <SupportIcon />,
      color: "success",
    },
  ];

  // Team members
  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "/images/team/ceo.jpg",
      description:
        "Passionate about connecting skilled professionals with customers who need their services.",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image: "/images/team/operations.jpg",
      description:
        "Ensures smooth operations and maintains quality standards across all services.",
    },
    {
      name: "Amit Patel",
      role: "Technology Lead",
      image: "/images/team/tech.jpg",
      description:
        "Builds and maintains the technology platform that powers Urban Skill.",
    },
    {
      name: "Sneha Gupta",
      role: "Customer Success",
      image: "/images/team/customer.jpg",
      description:
        "Dedicated to ensuring every customer has an exceptional experience with our services.",
    },
  ];

  // Milestones
  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description:
        "Urban Skill was founded with a vision to revolutionize home services in India.",
    },
    {
      year: "2021",
      title: "First 1000 Customers",
      description:
        "Reached our first milestone of serving 1000 happy customers across Delhi NCR.",
    },
    {
      year: "2022",
      title: "Multi-City Expansion",
      description:
        "Expanded operations to 10 major cities including Mumbai, Bangalore, and Chennai.",
    },
    {
      year: "2023",
      title: "10,000+ Professionals",
      description:
        "Built a network of over 10,000 verified professionals across various service categories.",
    },
    {
      year: "2024",
      title: "Technology Innovation",
      description:
        "Launched AI-powered matching system and mobile app for better user experience.",
    },
    {
      year: "2025",
      title: "Market Leadership",
      description:
        "Became the leading home services platform with 50,000+ satisfied customers.",
    },
  ];

 const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <Card sx={{ 
      textAlign: 'center', // FIXED: Added center alignment
      height: '100%' 
    }}>
      <CardContent sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* FIXED: Centered avatar */}
        <Avatar sx={{ 
          bgcolor: 'primary.main', 
          width: 64, 
          height: 64, 
          mx: 'auto', // FIXED: Auto margin for centering
          mb: 2 
        }}>
          {stat.icon}
        </Avatar>
        
        {/* FIXED: Centered value */}
        <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom sx={{ textAlign: 'center' }}>
          {stat.value}
        </Typography>
        
        {/* FIXED: Centered label */}
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
          {stat.label}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

 const ValueCard = ({ value, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
  >
    <Card sx={{ 
      height: '100%', 
      textAlign: 'center', // FIXED: Added center alignment
      '&:hover': { transform: 'translateY(-8px)', transition: 'all 0.3s' } 
    }}>
      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* FIXED: Centered avatar */}
        <Avatar sx={{ 
          bgcolor: `${value.color}.light`, 
          color: `${value.color}.main`,
          width: 64, 
          height: 64, 
          mb: 3,
          mx: 'auto' // FIXED: Auto margin for centering
        }}>
          {value.icon}
        </Avatar>
        
        {/* FIXED: Centered title */}
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
          {value.title}
        </Typography>
        
        {/* FIXED: Centered description */}
        <Typography variant="body2" color="text.secondary" lineHeight={1.6} sx={{ textAlign: 'center' }}>
          {value.description}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);


  const TeamCard = ({ member, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card sx={{ textAlign: "center", height: "100%" }}>
        <CardContent sx={{ p: 3 }}>
          <Avatar
            src={member.image}
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 2,
              border: 3,
              borderColor: "primary.light",
            }}
          >
            {member.name.charAt(0)}
          </Avatar>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {member.name}
          </Typography>
          <Chip
            label={member.role}
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
            {member.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid xs={12} md={6}>
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                  About Urban Skill
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Connecting skilled professionals with customers who need
                  quality home services
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Founded in 2020, Urban Skill has revolutionized the way people
                  access home services in India. We bridge the gap between
                  skilled professionals and customers, ensuring quality,
                  reliability, and convenience in every interaction.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                  onClick={() => navigate("/services")}
                >
                  Explore Services
                </Button>
              </Grid>
              <Grid xs={12} md={6}>
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src="/images/about-hero.jpg"
                    alt="Urban Skill Team"
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      height: "auto",
                      borderRadius: "16px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Statistics Section */}
      {/* Statistics Section - FIXED CENTER ALIGNMENT */}
<Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
      Our Impact
    </Typography>
    <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
      Numbers that reflect our commitment to excellence
    </Typography>
  </motion.div>

  <Grid container spacing={4} justifyContent="center">
    {stats.map((stat, index) => (
      <Grid xs={12} sm={6} md={3} key={stat.label}>
        <StatCard stat={stat} index={index} />
      </Grid>
    ))}
  </Grid>
</Container>


      {/* Mission & Vision */}
      <Box sx={{ bgcolor: "grey.50", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Paper sx={{ p: 4, height: "100%" }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.main"
                    gutterBottom
                  >
                    Our Mission
                  </Typography>
                  <Typography variant="body1" lineHeight={1.7}>
                    To make quality home services accessible, affordable, and
                    reliable for every household in India. We strive to empower
                    skilled professionals by providing them with a platform to
                    showcase their expertise and build sustainable livelihoods
                    while ensuring customers receive exceptional service
                    experiences.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Paper sx={{ p: 4, height: "100%" }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="secondary.main"
                    gutterBottom
                  >
                    Our Vision
                  </Typography>
                  <Typography variant="body1" lineHeight={1.7}>
                    To become India's most trusted and comprehensive home
                    services ecosystem, where technology meets human expertise
                    to create seamless experiences. We envision a future where
                    every skilled professional has equal opportunities and every
                    customer receives world-class service at their doorstep.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values */}
      {/* Core Values - FIXED CENTER ALIGNMENT */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
          >
            Our Core Values
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: "auto" }}
          >
            The principles that guide everything we do
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {values.map((value, index) => (
            <Grid xs={12} sm={6} md={3} key={value.title}>
              <ValueCard value={value} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Timeline */}
      <Box sx={{ bgcolor: "grey.50", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              textAlign="center"
              fontWeight="bold"
              gutterBottom
            >
              Our Journey
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Key milestones in our growth story
            </Typography>
          </motion.div>

          <Box sx={{ position: "relative" }}>
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 4,
                    flexDirection: {
                      xs: "column",
                      md: index % 2 === 0 ? "row" : "row-reverse",
                    },
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: {
                        xs: "center",
                        md: index % 2 === 0 ? "right" : "left",
                      },
                      pr: { md: index % 2 === 0 ? 4 : 0 },
                      pl: { md: index % 2 === 0 ? 0 : 4 },
                    }}
                  >
                    <Paper
                      sx={{ p: 3, display: "inline-block", maxWidth: 400 }}
                    >
                      <Chip
                        label={milestone.year}
                        color="primary"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      />
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {milestone.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {milestone.description}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      my: { xs: 2, md: 0 },
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Box sx={{ flex: 1 }} />
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            The passionate people behind Urban Skill
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid xs={12} sm={6} md={3} key={member.name}>
              <TeamCard member={member} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Ready to Experience Urban Skill?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of satisfied customers who trust us for their home
              service needs
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "grey.100" },
                }}
                onClick={() => navigate("/services")}
              >
                Book a Service
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
                onClick={() => navigate("/register?role=worker")}
              >
                Join as Professional
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
