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
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }} data-testid="loading-container">
        <CircularProgress size={60} data-testid="loading-spinner" />
        <Typography variant="h6" sx={{ mt: 2 }} data-testid="loading-text">
          Analyzing your responses...
        </Typography>
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }} data-testid="error-container">
        <Alert severity="error" data-testid="error-alert">
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }} data-testid="assessment-success-container">
      {/* Overall Score Section */}
      <Paper 
        elevation={3}
        data-testid="overall-score-section"
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom data-testid="assessment-results-title">
          Assessment Results
        </Typography>
        <Box
          data-testid="score-progress-container"
          sx={{
            position: 'relative',
            display: 'inline-flex',
            mt: 2,
            mb: 3
          }}
        >
          <CircularProgress
            data-testid="overall-score-progress"
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
            <Typography variant="h4" sx={{ color: 'white' }} data-testid="overall-score-value">
              {results.score}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="h5" gutterBottom data-testid="overall-level">
          Overall Level: {results.overallLevel}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }} data-testid="overall-feedback">
          {results.feedback}
        </Typography>
      </Paper>

      {/* Category Breakdown */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }} data-testid="category-breakdown-title">
        Category Breakdown
      </Typography>
      <Grid 
        container 
        spacing={3} 
        data-testid="category-grid"
        sx={{ 
          mb: 4,
          alignItems: 'stretch',
          '& .MuiGrid-item': {
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        {results.categoryBreakdown.map((category, index) => (
          <Grid item xs={12} md={6} key={index} data-testid={`category-item-${index}`} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card sx={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              height: '100%',
              minWidth: 0,
            }}>
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minWidth: 0,
                p: { xs: 2, sm: 3 },
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} data-testid={`category-title-${index}`}>
                  {category.category}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }} data-testid={`category-progress-${index}`}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={category.score}
                      data-testid={`category-progress-bar-${index}`}
                      sx={{
                        height: { xs: 8, sm: 10 },
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getScoreColor(category.score),
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ minWidth: '45px', textAlign: 'right' }} data-testid={`category-score-${index}`}>
                    {category.score}%
                  </Typography>
                </Box>
                <Chip 
                  label={category.level}
                  color={category.level === 'Advanced' ? 'success' : 'warning'}
                  size="small"
                  data-testid={`category-level-${index}`}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
                  <div data-testid={`category-strengths-${index}`} style={{ marginBottom: 8 }}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Strengths:
                    </Typography>
                    <List dense disablePadding sx={{ mb: 2 }}>
                      {category.strengths.map((strength, idx) => (
                        <ListItem key={idx} disablePadding data-testid={`strength-item-${index}-${idx}`}>
                          <ListItemText 
                            primary={`• ${strength}`}
                            primaryTypographyProps={{
                              sx: { fontSize: { xs: '0.875rem', sm: '1rem' } }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                  <div data-testid={`category-improvements-${index}`} style={{ marginBottom: 0 }}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Areas for Improvement:
                    </Typography>
                    <List dense disablePadding>
                      {category.areas_for_improvement.map((area, idx) => (
                        <ListItem key={idx} disablePadding data-testid={`improvement-item-${index}-${idx}`}>
                          <ListItemText 
                            primary={`• ${area}`}
                            primaryTypographyProps={{
                              sx: { fontSize: { xs: '0.875rem', sm: '1rem' } }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Suggestions Section */}
      <Paper elevation={2} sx={{ p: 3, background: '#f5f5f5' }} data-testid="suggestions-section">
        <Typography variant="h6" gutterBottom data-testid="suggestions-title">
          Recommended Next Steps
        </Typography>
        <List>
          {results.suggestions.map((suggestion, index) => (
            <ListItem key={index} data-testid={`suggestion-item-${index}`}>
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
