import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data to simulate backend response
const mockAssessmentResult = {
  overallLevel: 'Advanced',
  score: 85,
  feedback: 'Your organization demonstrates strong automation practices with room for strategic improvements.',
  suggestions: [
    'Consider implementing AI-powered test generation',
    'Expand cross-browser testing coverage',
    'Enhance API testing automation',
    'Implement continuous performance monitoring'
  ],
  categoryBreakdown: [
    {
      category: 'Test Automation',
      level: 'Advanced',
      score: 90,
      strengths: ['Comprehensive test coverage', 'CI/CD integration'],
      areas_for_improvement: ['AI/ML integration', 'Mobile testing']
    },
    {
      category: 'Process Automation',
      level: 'Intermediate',
      score: 75,
      strengths: ['Automated deployments', 'Configuration management'],
      areas_for_improvement: ['Release automation', 'Environment provisioning']
    },
    {
      category: 'Tools & Infrastructure',
      level: 'Advanced',
      score: 85,
      strengths: ['Modern tool stack', 'Cloud infrastructure'],
      areas_for_improvement: ['Tool integration', 'Infrastructure as code']
    },
    {
      category: 'Team & Skills',
      level: 'Intermediate',
      score: 80,
      strengths: ['Technical expertise', 'Collaboration'],
      areas_for_improvement: ['Skill cross-training', 'Knowledge sharing']
    }
  ]
};

// Simulate API call with mock data
export const submitAssessment = createAsyncThunk(
  'assessment/submit',
  async (formData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockAssessmentResult;
  }
);

const initialState = {
  results: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const assessmentResultsSlice = createSlice({
  name: 'assessmentResults',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAssessment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Selectors
export const selectAssessmentResults = (state) => state.assessmentResults.results;
export const selectAssessmentStatus = (state) => state.assessmentResults.status;
export const selectAssessmentError = (state) => state.assessmentResults.error;

export const { clearResults } = assessmentResultsSlice.actions;
export default assessmentResultsSlice.reducer;
