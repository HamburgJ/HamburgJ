import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Tooltip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, People, AttachMoney, BarChart, PieChart, FilterList } from '@mui/icons-material';

// --- Mock Data ---
const dataSets = {
  overview: {
    kpi1: { label: 'Code Quality', value: '99.9%', trend: '+2.4%' },
    kpi2: { label: 'Features Shipped', value: '15+', trend: '+12%' },
    kpi3: { label: 'Data Processed', value: '1.2TB', trend: '+50%' },
    chartData: [65, 59, 80, 81, 56, 55, 40],
    chartLabel: 'System Performance',
  },
  frontend: {
    kpi1: { label: 'Load Time', value: '0.8s', trend: '-20%' },
    kpi2: { label: 'User Engagement', value: 'High', trend: '+15%' },
    kpi3: { label: 'Components', value: '45', trend: '+5' },
    chartData: [28, 48, 40, 19, 86, 27, 90],
    chartLabel: 'UI Responsiveness',
  },
  backend: {
    kpi1: { label: 'API Latency', value: '45ms', trend: '-10%' },
    kpi2: { label: 'Uptime', value: '99.99%', trend: 'Stable' },
    kpi3: { label: 'Queries/Sec', value: '500', trend: '+100' },
    chartData: [12, 50, 30, 70, 45, 90, 60],
    chartLabel: 'Server Load',
  },
};

const ExperienceCharityCAN: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'frontend' | 'backend'>('overview');
  const currentData = dataSets[activeTab];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f4f6f8',
        p: 3,
        fontFamily: '"Inter", sans-serif',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
            CharityCAN Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Full-Stack Engineering Performance Report
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['overview', 'frontend', 'backend'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'contained' : 'outlined'}
              onClick={() => setActiveTab(tab as any)}
              startIcon={tab === 'overview' ? <PieChart /> : <BarChart />}
              sx={{
                textTransform: 'capitalize',
                borderRadius: 2,
                boxShadow: activeTab === tab ? '0 4px 12px rgba(26, 35, 126, 0.2)' : 'none',
              }}
            >
              {tab}
            </Button>
          ))}
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { icon: <TrendingUp />, ...currentData.kpi1, color: '#4caf50' },
          { icon: <People />, ...currentData.kpi2, color: '#2196f3' },
          { icon: <AttachMoney />, ...currentData.kpi3, color: '#ff9800' },
        ].map((kpi, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {kpi.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#263238' }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: kpi.color, fontWeight: 600 }}>
                    {kpi.trend} vs last month
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: `${kpi.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: kpi.color,
                  }}
                >
                  {kpi.icon}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Main Chart Area */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              height: '400px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#263238' }}>
                {currentData.chartLabel}
              </Typography>
              <IconButton size="small">
                <FilterList />
              </IconButton>
            </Box>
            
            {/* CSS Bar Chart */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2, px: 2, pb: 2 }}>
              {currentData.chartData.map((value, i) => (
                <Tooltip key={i} title={`Value: ${value}`} arrow placement="top">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    style={{
                      flex: 1,
                      backgroundColor: i % 2 === 0 ? '#3f51b5' : '#7986cb',
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -25,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{value}</Typography>
                    </Box>
                  </motion.div>
                </Tooltip>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mt: 1 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <Typography key={day} variant="caption" color="text.secondary">
                  {day}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Side Info Panel */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              height: '400px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Project Details
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>ROLE</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Full-Stack Software Engineering Intern</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>FOCUS</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Fundraising Analytics & Donor Management</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>ACHIEVEMENT</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Developed features to help non-profits optimize their fundraising efforts using large datasets.
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: 'white',
                color: '#1a237e',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              Export Report
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExperienceCharityCAN;
