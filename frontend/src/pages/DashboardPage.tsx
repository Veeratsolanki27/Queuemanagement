import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Timer as WaitIcon,
  PeopleAlt as QueueIcon,
  CheckCircle as SuccessIcon,
  TrendingUp as TrendIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { analyticsApi } from '../api/queueService';
import type { AnalyticsData } from '../types';
import { useSnackbar } from 'notistack';

const PIE_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsApi.getDashboard();
      setData(res.data);
    } catch (err: any) {
      enqueueSnackbar('Failed to load analytics: ' + (err.message || 'Error'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const pieData = data
    ? [
        { name: 'Waiting', value: data.totalWaiting },
        { name: 'Serving', value: data.totalServing },
        { name: 'Completed', value: data.totalCompleted },
        { name: 'Cancelled', value: data.totalCancelled },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Queue Analytics & Intelligence
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
            Real-time wait metrics, throughput trends, and queue performance breakdown
          </Typography>
        </Box>
        <Tooltip title="Refresh Dashboard">
          <IconButton
            onClick={fetchAnalytics}
            sx={{
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              p: 1.2,
              '&:hover': { backgroundColor: '#f8fafc' },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading || !data ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* KPI Stat Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.05em' }}>
                    Waiting In Queues
                  </Typography>
                  <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QueueIcon sx={{ color: '#2563eb', fontSize: 22 }} />
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 1.5, color: '#0f172a' }}>
                  {data.totalWaiting}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Active customer tokens currently waiting
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.05em' }}>
                    Average Wait Time
                  </Typography>
                  <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WaitIcon sx={{ color: '#d97706', fontSize: 22 }} />
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 1.5, color: '#0f172a' }}>
                  {data.averageWaitMinutes} <span style={{ fontSize: 18, color: '#64748b', fontWeight: 600 }}>mins</span>
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Calculated across all service counters
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.05em' }}>
                    Total Served
                  </Typography>
                  <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SuccessIcon sx={{ color: '#10b981', fontSize: 22 }} />
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 1.5, color: '#0f172a' }}>
                  {data.totalCompleted}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Avg service duration: {data.averageServiceMinutes} mins
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(124, 58, 237, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.05em' }}>
                    Total Tokens Created
                  </Typography>
                  <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendIcon sx={{ color: '#7c3aed', fontSize: 22 }} />
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 1.5, color: '#0f172a' }}>
                  {data.totalTokens}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {data.totalCancelled} cancelled tokens recorded
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Hourly Wait Times & Volume */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ p: 3.5, height: '100%', borderRadius: 3, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Wait Time Trends & Hourly Activity
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Average customer wait duration (minutes) and token creation volume
                </Typography>
                <Box sx={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <AreaChart data={data.hourlyTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="hourLabel" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <RechartsTooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="averageWaitMinutes"
                        name="Avg Wait (min)"
                        stroke="#2563eb"
                        fillOpacity={1}
                        fill="url(#colorWait)"
                      />
                      <Area
                        type="monotone"
                        dataKey="tokenCount"
                        name="Tokens Issued"
                        stroke="#10b981"
                        fillOpacity={0.2}
                        fill="#10b981"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            {/* Token Status Distribution */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ p: 3.5, height: '100%', borderRadius: 3, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Status Distribution
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Active vs completed vs cancelled distribution
                </Typography>
                <Box sx={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData.length > 0 ? pieData : [{ name: 'No data', value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Queue Performance Comparison Table */}
          <Card sx={{ p: 3.5, borderRadius: 3, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Queue Performance Breakdown
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
              Summary metrics per registered queue
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Queue Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Waiting</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Serving</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Completed</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Cancelled</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Avg Wait Time</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Avg Service Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.queueMetrics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3, color: '#64748b' }}>
                        No queues recorded yet. Create a queue to see performance analytics.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.queueMetrics.map((qm) => (
                      <TableRow key={qm.queueId} hover>
                        <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{qm.queueName}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={qm.waitingCount}
                            size="small"
                            sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={qm.servingCount}
                            size="small"
                            sx={{ bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={qm.completedCount}
                            size="small"
                            sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={qm.cancelledCount}
                            size="small"
                            sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {qm.averageWaitMinutes} min
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {qm.averageServiceMinutes} min
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Container>
  );
};
