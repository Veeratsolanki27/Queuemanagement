import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Timer as TimerIcon,
  CheckCircleOutline as CompletedIcon,
  ArrowForward as OpenIcon,
  DeleteOutline as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { queueApi } from '../api/queueService';
import type { QueueItem } from '../types';
import { useSnackbar } from 'notistack';

export const QueuesPage: React.FC = () => {
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prefix, setPrefix] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const res = await queueApi.getAllQueues();
      setQueues(res.data);
    } catch (err: any) {
      enqueueSnackbar('Failed to load queues: ' + (err.message || 'Error'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleCreateQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const res = await queueApi.createQueue({
        name: name.trim(),
        description: description.trim(),
        prefix: prefix.trim() ? prefix.trim().toUpperCase() : undefined,
      });
      enqueueSnackbar(`Queue "${res.data.name}" created successfully!`, { variant: 'success' });
      setOpenModal(false);
      setName('');
      setDescription('');
      setPrefix('');
      fetchQueues();
    } catch (err: any) {
      enqueueSnackbar('Error creating queue: ' + (err.response?.data?.message || err.message), {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this queue and its tokens?')) return;

    try {
      await queueApi.deleteQueue(id);
      enqueueSnackbar('Queue deleted', { variant: 'info' });
      setQueues(queues.filter((q) => q.id !== id));
    } catch (err: any) {
      enqueueSnackbar('Error deleting queue', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header action bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Queue Operations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage live service queues, track waiting tokens and assign next in line
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Tooltip title="Refresh Queues">
            <IconButton onClick={fetchQueues} sx={{ border: '1px solid #e2e8f0' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            size="large"
            sx={{ px: 3, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
          >
            Create New Queue
          </Button>
        </Box>
      </Box>

      {/* Queue Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : queues.length === 0 ? (
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: '#ffffff',
            borderStyle: 'dashed',
            borderWidth: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No active queues yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Click below to create your first service queue and begin token operations.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            Create First Queue
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {queues.map((queue) => (
            <Grid item xs={12} sm={6} md={4} key={queue.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                  },
                }}
                onClick={() => navigate(`/queues/${queue.id}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Chip
                      label={`Prefix: ${queue.prefix}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: '#eff6ff',
                        color: '#2563eb',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(e, queue.id)}
                      sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {queue.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      minHeight: 40,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {queue.description || 'No description provided.'}
                  </Typography>

                  {/* Metrics Row */}
                  <Grid container spacing={1.5}>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          textAlign: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#16a34a' }}>
                            {queue.waitingCount}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 600 }}>
                          Waiting
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          textAlign: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <TimerIcon sx={{ fontSize: 18, color: '#2563eb' }} />
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563eb' }}>
                            {queue.avgWaitMinutes}m
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600 }}>
                          Avg Wait
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: '#faf5ff',
                          border: '1px solid #e9d5ff',
                          textAlign: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <CompletedIcon sx={{ fontSize: 18, color: '#7c3aed' }} />
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#7c3aed' }}>
                            {queue.completedCount}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#6b21a8', fontWeight: 600 }}>
                          Served
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Managed by {queue.managerName}
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<OpenIcon />}
                    onClick={() => navigate(`/queues/${queue.id}`)}
                  >
                    Open Console
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Queue Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Create Service Queue</DialogTitle>
        <form onSubmit={handleCreateQueue}>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Queue Name *"
              placeholder="e.g. VIP Customer Service, Pharmacy Dispense"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Queue Token Prefix"
              placeholder="e.g. VIP, PH, A (Default: First letters)"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              margin="normal"
              helperText="Tokens will be numbered as {PREFIX}-001, {PREFIX}-002"
            />
            <TextField
              fullWidth
              label="Description"
              placeholder="e.g. Express counter for priority support"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              {submitting ? 'Creating...' : 'Create Queue'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

