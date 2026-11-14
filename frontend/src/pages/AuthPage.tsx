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
  // tabIndex 0 = Register, tabIndex 1 = Login
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
        // Step 1: Registration
        if (!fullName.trim()) {
          setErrorMsg('Full name is required for registration');
          setLoading(false);
          return;
        }
        await register(username.trim(), password, fullName.trim());
        enqueueSnackbar('Account registered successfully! Please log in with your credentials.', {
          variant: 'success',
        });
        // Switch automatically to login tab so user logs in cleanly
        setTabIndex(1);
        setPassword('');
      } else {
        // Step 2: Login -> Redirect to Dashboard
        await login(username.trim(), password);
        enqueueSnackbar('Logged in successfully! Redirecting to dashboard...', { variant: 'success' });
        navigate('/queues');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please verify your credentials.';
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
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
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
              Queue Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tabIndex === 0
                ? 'Step 1: Register New Manager Account'
                : 'Step 2: Sign In to Access Dashboard'}
            </Typography>
          </Box>

          <Tabs
            value={tabIndex}
            onChange={(_, val) => {
              setTabIndex(val);
              setErrorMsg('');
              setPassword('');
            }}
            variant="fullWidth"
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<RegisterIcon />} iconPosition="start" label="Register" />
            <Tab icon={<LoginIcon />} iconPosition="start" label="Login" />
          </Tabs>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tabIndex === 0 && (
              <TextField
                fullWidth
                label="Full Name"
                placeholder="e.g. Rahul Sharma"
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
              placeholder="e.g. rahul123"
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
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : tabIndex === 0 ? (
                'Create Account & Proceed to Login'
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>

          {/* Quick toggle helper text */}
          <Box sx={{ textAlign: 'center', mt: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              {tabIndex === 0 ? (
                <>
                  Already registered?{' '}
                  <span
                    style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => {
                      setTabIndex(1);
                      setErrorMsg('');
                    }}
                  >
                    Login here
                  </span>
                </>
              ) : (
                <>
                  New here?{' '}
                  <span
                    style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => {
                      setTabIndex(0);
                      setErrorMsg('');
                    }}
                  >
                    Register new account
                  </span>
                </>
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
