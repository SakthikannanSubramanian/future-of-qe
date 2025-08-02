import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitAssessment,
  selectAssessmentResults,
  selectAssessmentStatus,
  selectAssessmentError
} from '../../redux/slices/assessmentResultsSlice';
import { Box, Container, Typography, Paper, CircularProgress, Card, CardContent, Grid, Alert, Chip, List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AssessmentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const results = useSelector(selectAssessmentResults);
  const status = useSelector(selectAssessmentStatus);
  const error = useSelector(selectAssessmentError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(submitAssessment());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Analyzing your responses...
        </Typography>
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error || 'Failed to process assessment results. Please try again.'}
        </Alert>
      </Container>
    );
  }

  if (!results) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Overall Score Section */}
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Assessment Results
        </Typography>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            mt: 2,
            mb: 3
          }}
        >
          <CircularProgress
            variant="determinate"
            value={results.score}
            size={120}
            thickness={4}
            sx={{ color: getScoreColor(results.score) }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" sx={{ color: 'white' }}>
              {results.score}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="h5" gutterBottom>
          Overall Level: {results.overallLevel}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {results.feedback}
        </Typography>
      </Paper>

      {/* Category Breakdown */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Category Breakdown
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {results.categoryBreakdown.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {category.category}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={category.score}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getScoreColor(category.score),
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {category.score}%
                  </Typography>
                </Box>
                <Chip 
                  label={category.level}
                  color={category.level === 'Advanced' ? 'success' : 'warning'}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Strengths:
                </Typography>
                <List dense disablePadding>
                  {category.strengths.map((strength, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemText primary={`• ${strength}`} />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Areas for Improvement:
                </Typography>
                <List dense disablePadding>
                  {category.areas_for_improvement.map((area, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemText primary={`• ${area}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Suggestions Section */}
      <Paper elevation={2} sx={{ p: 3, background: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Recommended Next Steps
        </Typography>
        <List>
          {results.suggestions.map((suggestion, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={suggestion}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: '#1a237e',
                    fontWeight: 500
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default AssessmentSuccess;
