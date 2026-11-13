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
  Divider,
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
        enqueueSnackbar('Account created successfully!', { variant: 'success' });
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
        background: 'radial-gradient(circle at 10% 20%, rgb(239, 246, 255) 0%, rgb(248, 250, 252) 90%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
        }}
      >
        <CardContent>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                mb: 1.5,
                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)',
              }}
            >
              <QueueIcon fontSize="large" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Queue Manager Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rugas Queue Operations & Token Dispatch
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
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<LoginIcon />} iconPosition="start" label="Login" />
            <Tab icon={<RegisterIcon />} iconPosition="start" label="Sign Up" />
          </Tabs>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tabIndex === 1 && (
              <TextField
                fullWidth
                label="Full Name"
                placeholder="e.g. John Doe"
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
                py: 1.4,
                fontSize: 16,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              }}
            >
              {loading
                ? 'Processing...'
                : tabIndex === 0
                ? 'Sign In as Manager'
                : 'Create Manager Account'}
            </Button>
          </form>

          {tabIndex === 0 && (
            <Paper
              variant="outlined"
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: '#f8fafc',
                borderStyle: 'dashed',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                PRECONFIGURED DEMO CREDENTIALS:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 13 }}>
                Username: <strong>manager</strong> &nbsp;|&nbsp; Password: <strong>manager123</strong>
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

