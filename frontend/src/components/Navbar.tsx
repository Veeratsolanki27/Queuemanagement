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

  const isQueuesActive =
    location.pathname === '/queues' ||
    (location.pathname.startsWith('/queues/') && !location.pathname.includes('/analytics'));

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
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 72 }}>
          {/* Logo & Brand */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }}
            onClick={() => navigate('/queues')}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              }}
            >
              <QueueIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Queue <span style={{ color: '#2563eb' }}>Management</span>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Operations & Token Control
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              startIcon={<ListIcon />}
              onClick={() => navigate('/queues')}
              variant={isQueuesActive ? 'contained' : 'text'}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                backgroundColor: isQueuesActive ? '#2563eb' : 'transparent',
                color: isQueuesActive ? '#fff' : '#475569',
                '&:hover': {
                  backgroundColor: isQueuesActive ? '#1d4ed8' : '#f1f5f9',
                },
              }}
            >
              Queues
            </Button>
            <Button
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/analytics')}
              variant={location.pathname === '/analytics' ? 'contained' : 'text'}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                backgroundColor: location.pathname === '/analytics' ? '#2563eb' : 'transparent',
                color: location.pathname === '/analytics' ? '#fff' : '#475569',
                '&:hover': {
                  backgroundColor: location.pathname === '/analytics' ? '#1d4ed8' : '#f1f5f9',
                },
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
                  width: 40,
                  height: 40,
                  fontSize: 15,
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
                    height: 20,
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
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  p: 1,
                  '&:hover': { bgcolor: '#fee2e2', color: '#ef4444', borderColor: '#fca5a5' },
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
