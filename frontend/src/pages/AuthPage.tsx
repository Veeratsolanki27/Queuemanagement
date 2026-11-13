import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ConfirmationNumber as QueueIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

export const AuthPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (tabIndex === 0) {
        await login(username, password);
        enqueueSnackbar('Welcome back! Logged in successfully.', { variant: 'success' });
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Full name is required for registration');
          setLoading(false);
          return;
        }
        await register(username, password, fullName);
        enqueueSnackbar('Manager account registered successfully!', { variant: 'success' });
      }
      navigate('/queues');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.';
      setErrorMsg(msg);
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
      }}
    >
      <Card
        sx={{
          maxWidth: 460,
          width: '92%',
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
          border: 'none',
          backgroundColor: '#ffffff',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                mb: 2,
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
              }}
            >
              <QueueIcon sx={{ fontSize: 34 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
              Queue Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
              {tabIndex === 0 ? 'Sign in to access your queues' : 'Register a new manager account'}
            </Typography>
          </Box>

          <Tabs
            value={tabIndex}
            onChange={(_, val) => {
              setTabIndex(val);
              setErrorMsg('');
              setUsername('');
              setPassword('');
              setFullName('');
            }}
            variant="fullWidth"
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: '#f1f5f9',
              p: 0.5,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTab-root': {
                fontWeight: 700,
                borderRadius: 1.5,
                py: 1.2,
                minHeight: 44,
                color: '#64748b',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: '#2563eb',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                },
              },
            }}
          >
            <Tab icon={<LoginIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Sign In" />
            <Tab icon={<RegisterIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Register" />
          </Tabs>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tabIndex === 1 && (
              <TextField
                fullWidth
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                margin="normal"
                required
                disabled={loading}
              />
            )}

            <TextField
              fullWidth
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3.5,
                py: 1.5,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                  boxShadow: '0 6px 18px rgba(37, 99, 235, 0.45)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : tabIndex === 0 ? (
                'Sign In to Dashboard'
              ) : (
                'Create Manager Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
