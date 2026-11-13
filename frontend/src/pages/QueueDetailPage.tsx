import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  PersonAdd as PersonAddIcon,
  PlayArrow as ServeIcon,
  ArrowUpward as MoveUpIcon,
  ArrowDownward as MoveDownIcon,
  Close as CancelIcon,
  CheckCircle as CompleteIcon,
  AccessTime as ClockIcon,
  Refresh as RefreshIcon,
  SwapVert as SwapIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { queueApi, tokenApi } from '../api/queueService';
import type { QueueItem, TokenItem } from '../types';
import { useSnackbar } from 'notistack';

export const QueueDetailPage: React.FC = () => {
  const { queueId } = useParams<{ queueId: string }>();
  const id = Number(queueId);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [queue, setQueue] = useState<QueueItem | null>(null);
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0); // 0 = Waiting Queue, 1 = Active Serving, 2 = History
  const [actionLoading, setActionLoading] = useState(false);

  // New Token Modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [qRes, tRes] = await Promise.all([
        queueApi.getQueueById(id),
        tokenApi.getTokensByQueue(id),
      ]);
      setQueue(qRes.data);
      setTokens(tRes.data);
    } catch (err: any) {
      enqueueSnackbar('Failed to load queue details: ' + (err.message || 'Error'), {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh queue every 15 seconds for real-time visibility
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    try {
      setActionLoading(true);
      const res = await tokenApi.createToken(id, {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        serviceNotes: serviceNotes.trim() || undefined,
      });

      enqueueSnackbar(`Token #${res.data.tokenNumber} created for ${res.data.customerName}!`, {
        variant: 'success',
      });

      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setServiceNotes('');
      setOpenAddModal(false);
      loadData();
    } catch (err: any) {
      enqueueSnackbar('Failed to add token: ' + (err.response?.data?.message || err.message), {
        variant: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTop = async () => {
    try {
      setActionLoading(true);
      const res = await tokenApi.assignTopToken(id);
      enqueueSnackbar(`Assigned Top Token #${res.data.tokenNumber} to Counter!`, {
        variant: 'success',
      });
      loadData();
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'No waiting tokens to assign.', {
        variant: 'warning',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleMove = async (tokenId: number, direction: 'UP' | 'DOWN') => {
    try {
      await tokenApi.moveToken(id, tokenId, direction);
      enqueueSnackbar(`Token priority shifted ${direction.toLowerCase()}`, { variant: 'info' });
      loadData();
    } catch (err: any) {
      enqueueSnackbar('Could not change position: ' + (err.response?.data?.message || err.message), {
        variant: 'error',
      });
    }
  };

  const handleCancel = async (tokenId: number) => {
    if (!window.confirm('Cancel this token from the queue?')) return;
    try {
      await tokenApi.cancelToken(id, tokenId);
      enqueueSnackbar('Token cancelled', { variant: 'warning' });
      loadData();
    } catch (err: any) {
      enqueueSnackbar('Error cancelling token: ' + (err.response?.data?.message || err.message), {
        variant: 'error',
      });
    }
  };

  const handleComplete = async (tokenId: number) => {
    try {
      await tokenApi.completeToken(id, tokenId);
      enqueueSnackbar('Service completed successfully!', { variant: 'success' });
      loadData();
    } catch (err: any) {
      enqueueSnackbar('Error marking complete: ' + (err.response?.data?.message || err.message), {
        variant: 'error',
      });
    }
  };

  const waitingTokens = tokens
    .filter((t) => t.status === 'WAITING')
    .sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999));

  const servingTokens = tokens.filter((t) => t.status === 'SERVING');
  const historyTokens = tokens.filter((t) => t.status === 'COMPLETED' || t.status === 'CANCELLED');

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Top Banner Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/queues')}
          sx={{ color: 'text.secondary', fontWeight: 600 }}
        >
          Back to Queues
        </Button>
        <Tooltip title="Refresh Queue Status">
          <IconButton onClick={loadData} sx={{ border: '1px solid #e2e8f0' }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Queue Hero Summary */}
      {queue && (
        <Card
          sx={{
            p: { xs: 2.5, md: 3.5 },
            mb: 4,
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Chip
                  label={`Prefix: ${queue.prefix}`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                  }}
                />
                <Chip
                  label={queue.active ? 'Active Operational' : 'Inactive'}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                  }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {queue.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                {queue.description || 'Live customer queue and token management control desk.'}
              </Typography>
            </Grid>

            {/* Quick Action Buttons */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
            >
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={() => setOpenAddModal(true)}
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                Add Person / Token
              </Button>
              <Button
                variant="contained"
                startIcon={<ServeIcon />}
                onClick={handleAssignTop}
                disabled={waitingTokens.length === 0 || actionLoading}
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  fontWeight: 700,
                  px: 3,
                }}
              >
                Assign Top Token
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Live Serving Banner if any token is being served */}
      {servingTokens.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, color: '#059669', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ServeIcon fontSize="small" /> NOW SERVING AT COUNTER
          </Typography>
          <Grid container spacing={2}>
            {servingTokens.map((token) => (
              <Grid item xs={12} sm={6} md={4} key={token.id}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '2px solid #10b981',
                    bgcolor: '#f0fdf4',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.12)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#059669' }}>
                      {token.tokenNumber}
                    </Typography>
                    <Chip label="IN SERVICE" color="success" size="small" sx={{ fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {token.customerName}
                  </Typography>
                  {token.serviceNotes && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', my: 0.5 }}>
                      "{token.serviceNotes}"
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mt: 1 }}>
                    <ClockIcon fontSize="inherit" />
                    Served at: {new Date(token.servedAt || '').toLocaleTimeString()}
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CompleteIcon />}
                    onClick={() => handleComplete(token.id)}
                    sx={{ mt: 2, fontWeight: 700 }}
                  >
                    Complete Service
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tabs: Waiting List vs History */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)}>
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Waiting In Queue</span>
                <Chip label={waitingTokens.length} size="small" color="primary" sx={{ height: 20, fontSize: 11 }} />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Completed / Cancelled</span>
                <Chip label={historyTokens.length} size="small" sx={{ height: 20, fontSize: 11 }} />
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* TAB 0: WAITING QUEUE LIST */}
      {tabIndex === 0 && (
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : waitingTokens.length === 0 ? (
            <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#ffffff', borderStyle: 'dashed' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Queue is currently empty!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                All tokens have been served or none are waiting right now.
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => setOpenAddModal(true)}
              >
                Add Customer / Token
              </Button>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {waitingTokens.map((token, index) => {
                const isTop = index === 0;
                return (
                  <Grid item xs={12} key={token.id}>
                    <Card
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: isTop ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        bgcolor: isTop ? '#eff6ff' : '#ffffff',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                        transition: 'all 0.2s',
                        '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.06)' },
                      }}
                    >
                      {/* Left: Position & Token number */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            bgcolor: isTop ? '#2563eb' : '#f1f5f9',
                            color: isTop ? '#ffffff' : '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 18,
                          }}
                        >
                          #{token.position}
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {token.tokenNumber}
                            </Typography>
                            {isTop && (
                              <Chip
                                label="NEXT IN LINE"
                                size="small"
                                sx={{
                                  bgcolor: '#2563eb',
                                  color: '#fff',
                                  fontWeight: 800,
                                  fontSize: 10,
                                }}
                              />
                            )}
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {token.customerName}
                          </Typography>
                          {(token.customerPhone || token.customerEmail) && (
                            <Typography variant="caption" color="text.secondary">
                              {[token.customerPhone, token.customerEmail].filter(Boolean).join(' • ')}
                            </Typography>
                          )}
                          {token.serviceNotes && (
                            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
                              Note: {token.serviceNotes}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Right: Actions (Move UP, Move DOWN, Assign Top, Cancel) */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          width: { xs: '100%', md: 'auto' },
                          justifyContent: { xs: 'space-between', md: 'flex-end' },
                        }}
                      >
                        {/* Position Move Buttons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Tooltip title="Move Up in Priority">
                            <span>
                              <IconButton
                                size="small"
                                disabled={index === 0}
                                onClick={() => handleMove(token.id, 'UP')}
                                sx={{
                                  border: '1px solid #cbd5e1',
                                  bgcolor: '#ffffff',
                                  '&:hover': { bgcolor: '#e2e8f0' },
                                }}
                              >
                                <MoveUpIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Move Down in Priority">
                            <span>
                              <IconButton
                                size="small"
                                disabled={index === waitingTokens.length - 1}
                                onClick={() => handleMove(token.id, 'DOWN')}
                                sx={{
                                  border: '1px solid #cbd5e1',
                                  bgcolor: '#ffffff',
                                  '&:hover': { bgcolor: '#e2e8f0' },
                                }}
                              >
                                <MoveDownIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>

                        {/* Top assign shortcut for the top token */}
                        {isTop && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<ServeIcon />}
                            onClick={handleAssignTop}
                            sx={{ fontWeight: 700 }}
                          >
                            Serve Now
                          </Button>
                        )}

                        {/* Cancel Token */}
                        <Tooltip title="Cancel Token">
                          <IconButton
                            size="small"
                            onClick={() => handleCancel(token.id)}
                            sx={{
                              color: '#ef4444',
                              border: '1px solid #fecaca',
                              '&:hover': { bgcolor: '#fee2e2' },
                            }}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {/* TAB 1: HISTORY */}
      {tabIndex === 1 && (
        <Box>
          {historyTokens.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#ffffff' }}>
              <Typography variant="body1" color="text.secondary">
                No past tokens in history yet.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {historyTokens.map((token) => (
                <Grid item xs={12} sm={6} md={4} key={token.id}>
                  <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {token.tokenNumber}
                      </Typography>
                      <Chip
                        label={token.status}
                        size="small"
                        color={token.status === 'COMPLETED' ? 'success' : 'error'}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {token.customerName}
                    </Typography>
                    {token.waitTimeSeconds != null && (
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 1 }}>
                        Wait time: {Math.round(token.waitTimeSeconds / 60)} min
                      </Typography>
                    )}
                    {token.serviceDurationSeconds != null && (
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                        Service duration: {Math.round(token.serviceDurationSeconds / 60)} min
                      </Typography>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Add Token Modal */}
      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Issue New Token / Add Person</DialogTitle>
        <form onSubmit={handleAddToken}>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Customer / Person Name *"
              placeholder="e.g. Michael Scott"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="e.g. +1 555-0199"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              placeholder="e.g. michael@dundermifflin.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Service Notes / Purpose"
              placeholder="e.g. Account dispute, Document verification"
              value={serviceNotes}
              onChange={(e) => setServiceNotes(e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenAddModal(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={actionLoading}
              sx={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              {actionLoading ? 'Creating Token...' : 'Create Token & Enqueue'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

