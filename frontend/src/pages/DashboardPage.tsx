import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
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
  CancelOutlined as CancelIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Analytics & Queue Intelligence
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live metrics, wait time trends, customer throughput, and queue efficiency
          </Typography>
        </Box>
        <Tooltip title="Refresh Dashboard">
          <IconButton onClick={fetchAnalytics} sx={{ border: '1px solid #e2e8f0' }}>
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
              <Card sx={{ p: 2.5, borderLeft: '4px solid #2563eb' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                    WAITING IN QUEUES
                  </Typography>
                  <QueueIcon sx={{ color: '#2563eb' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, my: 1, color: '#1e293b' }}>
                  {data.totalWaiting}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active customer tokens in line
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderLeft: '4px solid #f59e0b' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                    AVERAGE WAIT TIME
                  </Typography>
                  <WaitIcon sx={{ color: '#f59e0b' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, my: 1, color: '#1e293b' }}>
                  {data.averageWaitMinutes} <span style={{ fontSize: 20 }}>mins</span>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Across all service counters
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderLeft: '4px solid #10b981' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                    TOTAL SERVED
                  </Typography>
                  <SuccessIcon sx={{ color: '#10b981' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, my: 1, color: '#1e293b' }}>
                  {data.totalCompleted}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg service: {data.averageServiceMinutes} mins
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderLeft: '4px solid #7c3aed' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                    TOTAL TOKENS CREATED
                  </Typography>
                  <TrendIcon sx={{ color: '#7c3aed' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, my: 1, color: '#1e293b' }}>
                  {data.totalTokens}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {data.totalCancelled} cancelled tokens
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Hourly Wait Times & Volume */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Wait Time Trends & Hourly Activity
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
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
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Status Distribution
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
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
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Queue Performance Breakdown
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Queue Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Waiting</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Serving</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Completed</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Cancelled</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Avg Wait Time</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Avg Service Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.queueMetrics.map((qm) => (
                    <TableRow key={qm.queueId} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{qm.queueName}</TableCell>
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
                          sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={qm.completedCount}
                          size="small"
                          sx={{ bgcolor: '#faf5ff', color: '#7c3aed', fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={qm.cancelledCount}
                          size="small"
                          sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {qm.averageWaitMinutes} min
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {qm.averageServiceMinutes} min
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Container>
  );
};

