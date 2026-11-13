import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  ConfirmationNumber as QueueIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  FormatListBulleted as ListIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
          {/* Logo & Brand */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }}
            onClick={() => navigate('/queues')}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              <QueueIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                Rugas <span style={{ color: '#2563eb' }}>Queue</span>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Enterprise Queue Suite
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              startIcon={<ListIcon />}
              onClick={() => navigate('/queues')}
              variant={location.pathname === '/queues' || location.pathname.startsWith('/queues/') ? 'contained' : 'text'}
              sx={{
                backgroundColor:
                  location.pathname === '/queues' || (location.pathname.startsWith('/queues/') && !location.pathname.includes('/analytics'))
                    ? 'primary.main'
                    : 'transparent',
                color:
                  location.pathname === '/queues' || (location.pathname.startsWith('/queues/') && !location.pathname.includes('/analytics'))
                    ? '#fff'
                    : 'text.primary',
              }}
            >
              Queues
            </Button>
            <Button
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/analytics')}
              variant={location.pathname === '/analytics' ? 'contained' : 'text'}
              sx={{
                backgroundColor: location.pathname === '/analytics' ? 'primary.main' : 'transparent',
                color: location.pathname === '/analytics' ? '#fff' : 'text.primary',
              }}
            >
              Analytics
            </Button>
          </Box>

          {/* User profile & Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: '#2563eb',
                  width: 38,
                  height: 38,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'M'}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {user?.fullName || user?.username}
                </Typography>
                <Chip
                  label="Manager"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                  }}
                />
              </Box>
            </Box>
            <Tooltip title="Sign Out">
              <IconButton
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                color="default"
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#fee2e2', color: '#ef4444' },
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

