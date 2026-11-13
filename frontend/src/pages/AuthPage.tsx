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
  Paper,
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
  const [username, setUsername] = useState('manager');
  const [password, setPassword] = useState('manager123');
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
        enqueueSnackbar('Manager account created successfully!', { variant: 'success' });
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 460,
          width: '100%',
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 4,
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
          border: '1px solid #e2e8f0',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                mb: 1.5,
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
              }}
            >
              <QueueIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Queue Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manager Control Portal & Token Operations
            </Typography>
          </Box>

          <Tabs
            value={tabIndex}
            onChange={(_, val) => {
              setTabIndex(val);
              setErrorMsg('');
              if (val === 0) {
                setUsername('manager');
                setPassword('manager123');
              } else {
                setUsername('');
                setPassword('');
                setFullName('');
              }
            }}
            variant="fullWidth"
            sx={{
              mb: 3,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { fontWeight: 700, py: 1.5 },
            }}
          >
            <Tab icon={<LoginIcon />} iconPosition="start" label="Sign In" />
            <Tab icon={<RegisterIcon />} iconPosition="start" label="Register" />
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
                placeholder="e.g. Operations Lead"
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
              placeholder="e.g. manager"
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
                mt: 3,
                py: 1.5,
                fontSize: 16,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : tabIndex === 0 ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {tabIndex === 0 && (
            <Paper
              variant="outlined"
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2.5,
                bgcolor: '#f8fafc',
                border: '1px dashed #cbd5e1',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', display: 'block', mb: 0.5 }}>
                DEMO CREDENTIALS:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 13, color: '#0f172a' }}>
                Username: <strong>manager</strong> &nbsp;|&nbsp; Password: <strong>manager123</strong>
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
