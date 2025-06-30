import React from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Phone,
  Email,
  LocationOn,
  Apple,
  Android
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { APP_CONFIG } from '@utils/constants'

const Footer = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Footer sections data
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'How it Works', path: '/how-it-works' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press & Media', path: '/press' },
        { label: 'Contact Us', path: '/contact' },
      ]
    },
    {
      title: 'For Customers',
      links: [
        { label: 'Book a Service', path: '/services' },
        { label: 'My Bookings', path: '/dashboard' },
        { label: 'Help & Support', path: '/help' },
        { label: 'Customer Reviews', path: '/reviews' },
        { label: 'Refer & Earn', path: '/refer' },
      ]
    },
    {
      title: 'For Professionals',
      links: [
        { label: 'Join as Professional', path: '/register?role=worker' },
        { label: 'Professional Dashboard', path: '/worker/dashboard' },
        { label: 'Training Programs', path: '/training' },
        { label: 'Professional Support', path: '/worker/support' },
        { label: 'Earnings Calculator', path: '/worker/earnings' },
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'Home Cleaning', path: '/services/cleaning' },
        { label: 'Electrical Services', path: '/services/electrical' },
        { label: 'Plumbing', path: '/services/plumbing' },
        { label: 'AC Repair', path: '/services/ac-repair' },
        { label: 'All Services', path: '/services' },
      ]
    }
  ]

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com/urbanskill', label: 'Facebook' },
    { icon: <Twitter />, url: 'https://twitter.com/urbanskill', label: 'Twitter' },
    { icon: <Instagram />, url: 'https://instagram.com/urbanskill', label: 'Instagram' },
    { icon: <LinkedIn />, url: 'https://linkedin.com/company/urbanskill', label: 'LinkedIn' },
    { icon: <YouTube />, url: 'https://youtube.com/urbanskill', label: 'YouTube' },
  ]

  const contactInfo = [
    { icon: <Phone />, text: APP_CONFIG.SUPPORT_PHONE, href: `tel:${APP_CONFIG.SUPPORT_PHONE}` },
    { icon: <Email />, text: APP_CONFIG.SUPPORT_EMAIL, href: `mailto:${APP_CONFIG.SUPPORT_EMAIL}` },
    { icon: <LocationOn />, text: 'IIIT Kota, Rajasthan, India', href: null },
  ]

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
    { label: 'Refund Policy', path: '/refund' },
  ]

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="xl">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2
                }}
              >
                {APP_CONFIG.NAME}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'grey.300' }}>
                {APP_CONFIG.DESCRIPTION}. Connect with verified professionals for all your home and office needs.
              </Typography>

              {/* Contact Information */}
              <Stack spacing={1}>
                {contactInfo.map((contact, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'grey.300'
                    }}
                  >
                    {contact.icon}
                    {contact.href ? (
                      <Link
                        href={contact.href}
                        color="inherit"
                        underline="hover"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {contact.text}
                      </Link>
                    ) : (
                      <Typography variant="body2">
                        {contact.text}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Social Media Links */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    onClick={() => handleExternalLink(social.url)}
                    sx={{
                      color: 'grey.300',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)'
                      }
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'white'
                }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    component="button"
                    onClick={() => handleNavigation(link.path)}
                    sx={{
                      color: 'grey.300',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* App Download Section */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            Download Our App
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                border: '1px solid',
                borderColor: 'grey.600',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)'
                }
              }}
              onClick={() => handleExternalLink('https://apps.apple.com')}
            >
              <Apple sx={{ fontSize: 24 }} />
              <Box>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>
                  Download on the
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  App Store
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                border: '1px solid',
                borderColor: 'grey.600',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)'
                }
              }}
              onClick={() => handleExternalLink('https://play.google.com')}
            >
              <Android sx={{ fontSize: 24 }} />
              <Box>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>
                  Get it on
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Google Play
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: 'grey.700', my: 3 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'center' },
            gap: 2
          }}
        >
          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{
              color: 'grey.400',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            © {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.
            <br />
            Founded by Digvijay at IIIT Kota
          </Typography>

          {/* Legal Links */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 3 }}
            sx={{ alignItems: 'center' }}
          >
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                component="button"
                onClick={() => handleNavigation(link.path)}
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Trust Badges */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'grey.700',
            textAlign: 'center'
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              color: 'grey.400'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">🔒</Typography>
              <Typography variant="body2">Secure Payments</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">✅</Typography>
              <Typography variant="body2">Verified Professionals</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">🛡️</Typography>
              <Typography variant="body2">Service Guarantee</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">📞</Typography>
              <Typography variant="body2">24/7 Support</Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
