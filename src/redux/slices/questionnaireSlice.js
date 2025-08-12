import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Initial questionnaire data (new schema)
const initialQuestionnaireData = [
  {
    "categoryId": "550e8400-e29b-41d4-a716-446655440001",
    "parameter": "Automation coverage",
    "description": "Questions related to test automation coverage across different testing types",
    "displayOrder": 1,
    "parameterWeightage": 11,
    "questions": [
      {
        "questionId": "3fc771d9-e3d8-4afd-adc1-59e7f846b17a",
        "description": "What percentage of Regression test cases have been automated?",
        "weight": 3.0,
        "displayOrder": 1,
        "options": {
          "a": { "range": "80-100%", "level": 4 },
          "b": { "range": "50-80%", "level": 3 },
          "c": { "range": "25-50%", "level": 2 },
          "d": { "range": "0-25%", "level": 1 }
        },
        "question": "What percentage of Regression test cases have been automated?",
        "qweightage": 3
      },
      {
        "questionId": "80f24f27-d49f-481b-8f16-30bf768e0828",
        "description": "What percentage of End-to-End test cases have been automated?",
        "weight": 2.0,
        "displayOrder": 2,
        "options": {
          "a": { "range": "80-100%", "level": 4 },
          "b": { "range": "50-80%", "level": 3 },
          "c": { "range": "25-50%", "level": 2 },
          "d": { "range": "0-25%", "level": 1 }
        },
        "question": "What percentage of End-to-End test cases have been automated?",
        "qweightage": 2
      },
      {
        "questionId": "efa5949b-aaa3-40bc-93c0-59e6f8c50122",
        "description": "What percentage of device automation test cases have been automated?",
        "weight": 1.0,
        "displayOrder": 3,
        "options": {
          "a": { "range": "80-100%", "level": 4 },
          "b": { "range": "50-80%", "level": 3 },
          "c": { "range": "25-50%", "level": 2 },
          "d": { "range": "0-25%", "level": 1 }
        },
        "question": "What percentage of device automation test cases have been automated?",
        "qweightage": 1
      },
      {
        "questionId": "336baf63-d6c2-4ede-8327-d84b56eb46db",
        "description": "Select the level of functional test cases automated?",
        "weight": 4.0,
        "displayOrder": 4,
        "options": {
          "a": { "range": "Very few or No test cases are automated", "level": 1 },
          "b": { "range": "Only Critical", "level": 2 },
          "c": { "range": "Critical and Major", "level": 3 },
          "d": { "range": "All functional test cases are automated", "level": 4 }
        },
        "question": "Select the level of functional test cases automated?",
        "qweightage": 4
      }
    ],
    "recommendations": [
      {
        "recommendationId": null,
        "level": 1,
        "recommendationText": "Start by automating high-priority test cases such as regression tests. Begin with smaller, repetitive tasks that are critical to project delivery."
      },
      {
        "recommendationId": null,
        "level": 2,
        "recommendationText": "Expand your automation coverage by including more functional and non-functional tests. Look into increasing test coverage for edge cases and add automation for key workflows."
      },
      {
        "recommendationId": null,
        "level": 3,
        "recommendationText": "Increase the depth of your automation by covering all critical features and business logic. Ensure your tests are comprehensive and can be executed across various platforms."
      },
      {
        "recommendationId": null,
        "level": 4,
        "recommendationText": "Achieve full automation coverage across all testing types, including performance and security testing. Continue optimizing your framework for increased execution speed and scalability."
      }
    ]
  },
  {
    "categoryId": "550e8400-e29b-41d4-a716-446655440002",
    "parameter": "Automated NFT",
    "description": "Questions related to automated non-functional testing capabilities",
    "displayOrder": 2,
    "parameterWeightage": 9,
    "questions": [
      {
        "questionId": "eaaf8954-df8a-4f9a-b901-be5d1b77288a",
        "description": "How much percentage of your Performance Testing automated?",
        "weight": 6.0,
        "displayOrder": 1,
        "options": {
          "a": { "range": "80-100%", "level": 4 },
          "b": { "range": "50-80%", "level": 3 },
          "c": { "range": "25-50%", "level": 2 },
          "d": { "range": "0-25%", "level": 1 }
        },
        "question": "How much percentage of your Performance Testing automated?",
        "qweightage": 6
      },
      {
        "questionId": "1e55eaa9-16a9-4905-b858-852b6d8651b2",
        "description": "How much percentage of your Accessibility Testing automated?",
        "weight": 2.0,
        "displayOrder": 2,
        "options": {
          "a": { "range": "80-100%", "level": 4 },
          "b": { "range": "50-80%", "level": 3 },
          "c": { "range": "25-50%", "level": 2 },
          "d": { "range": "0-25%", "level": 1 }
        },
        "question": "How much percentage of your Accessibility Testing automated?",
        "qweightage": 2
      },
      {
        "questionId": "5779c6f2-6dba-468d-9478-9eff37da6c7c",
        "description": "How much percentage of your Security Testing automated?",
        "weight": 5.0,
        "displayOrder": 3,
        "options": {
          "a": { "range": "80-100%", "level": 4 },
          "b": { "range": "50-80%", "level": 3 },
          "c": { "range": "25-50%", "level": 2 },
          "d": { "range": "0-25%", "level": 1 }
        },
        "question": "How much percentage of your Security Testing automated?",
        "qweightage": 5
      },
      {
        "questionId": "f4eab109-d414-48cd-a315-f1ac7c0efdf8",
        "description": "How much percentage of your Compatibility Testing (Browsers) automated?",
        "weight": 4.0,
        "displayOrder": 4,
        "options": {
          "a": { "range": "80-100%", "level": 4 },
          "b": { "range": "50-80%", "level": 3 },
          "c": { "range": "25-50%", "level": 2 },
          "d": { "range": "0-25%", "level": 1 }
        },
        "question": "How much percentage of your Compatibility Testing (Browsers) automated?",
        "qweightage": 4
      },
      {
        "questionId": "a5c54b8f-e38e-49b7-b18f-5a88834188a4",
        "description": "How much percentage of your Compatibility Testing (Devices) automated?",
        "weight": 3.0,
        "displayOrder": 5,
        "options": {
          "a": { "range": "80-100%", "level": 4 },
          "b": { "range": "50-80%", "level": 3 },
          "c": { "range": "25-50%", "level": 2 },
          "d": { "range": "0-25%", "level": 1 }
        },
        "question": "How much percentage of your Compatibility Testing (Devices) automated?",
        "qweightage": 3
      },
      {
        "questionId": "b3a8cfa1-3c49-4120-9f51-a4d4fcfa8134",
        "description": "How much percentage of your Usability Testing automated?",
        "weight": 1.0,
        "displayOrder": 6,
        "options": {
          "a": { "range": "80-100%", "level": 4 },
          "b": { "range": "50-80%", "level": 3 },
          "c": { "range": "25-50%", "level": 2 },
          "d": { "range": "0-25%", "level": 1 }
        },
        "question": "How much percentage of your Usability Testing automated?",
        "qweightage": 1
      }
    ],
    "recommendations": [
      {
        "recommendationId": null,
        "level": 1,
        "recommendationText": "Begin automating performance, security, and accessibility testing for critical functionalities. Focus on automating the basic non-functional tests that are most relevant to your project."
      },
      {
        "recommendationId": null,
        "level": 2,
        "recommendationText": "Increase the scope of your non-functional tests by adding more complex tests like load and stress testing. Start integrating tools such as JMeter for performance and OWASP for security testing."
      }
    ]
  }
];

// Async thunk for loading questionnaire data
export const loadQuestionnaire = createAsyncThunk(
  'questionnaire/loadQuestionnaire',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://vibebackendservice.onrender.com/api/v1/questions', {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Backend returned error');
      }
      const data = await response.json();
      // If backend returns empty or invalid, fallback
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Backend returned no data');
      }
      return data;
    } catch (err) {
      // Log the error for debugging but don't fail the app
      console.warn('Failed to fetch from backend, using static data:', err.message);
      // Fallback to static data
      return initialQuestionnaireData;
    }
  }
)

// Async thunk for submitting questionnaire responses
export const submitQuestionnaireResponses = createAsyncThunk(
  'questionnaire/submitResponses',
  async (responses) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Save to localStorage for persistence
    localStorage.setItem('questionnaireResponses', JSON.stringify(responses))
    
    return responses
  }
)

const initialState = {
  questionnaireData: initialQuestionnaireData, // Start with static data to prevent undefined errors
  formattedResponses: [], // Array of formatted responses as required
  currentCategoryIndex: 0,
  loading: false,
  error: null,
  submitStatus: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  isComplete: false
}

export const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    nextCategory: (state) => {
      if (state.currentCategoryIndex < state.questionnaireData.length - 1) {
        state.currentCategoryIndex += 1
      }
    },
    previousCategory: (state) => {
      if (state.currentCategoryIndex > 0) {
        state.currentCategoryIndex -= 1
      }
    },
    resetQuestionnaire: (state) => {
      state.formattedResponses = []
      state.currentCategoryIndex = 0
      state.isComplete = false
      state.submitStatus = 'idle'
      state.error = null
      localStorage.removeItem('questionnaireResponses')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Load questionnaire
      .addCase(loadQuestionnaire.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadQuestionnaire.fulfilled, (state, action) => {
        state.loading = false
        state.questionnaireData = action.payload
      })
      .addCase(loadQuestionnaire.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load questionnaire'
      })
      // Submit responses
      .addCase(submitQuestionnaireResponses.pending, (state) => {
        state.loading = true
        state.error = null
        state.submitStatus = 'pending'
      })
      .addCase(submitQuestionnaireResponses.fulfilled, (state, action) => {
        state.loading = false
        state.submitStatus = 'succeeded'
        state.formattedResponses = action.payload
        state.isComplete = true
      })
      .addCase(submitQuestionnaireResponses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to submit responses'
        state.submitStatus = 'failed'
      })
  },
})

export const { 
  nextCategory, 
  previousCategory, 
  resetQuestionnaire, 
  clearError 
} = questionnaireSlice.actions

// Selectors
export const selectQuestionnaireData = (state) => state.questionnaire.questionnaireData
export const selectCurrentCategoryIndex = (state) => state.questionnaire.currentCategoryIndex
export const selectCurrentCategory = (state) => {
  const { questionnaireData, currentCategoryIndex } = state.questionnaire
  return questionnaireData[currentCategoryIndex] || null
}
export const selectFormattedResponses = (state) => state.questionnaire.formattedResponses
export const selectQuestionnaireLoading = (state) => state.questionnaire.loading
export const selectQuestionnaireError = (state) => state.questionnaire.error
export const selectIsComplete = (state) => state.questionnaire.isComplete
export const selectSubmitStatus = (state) => state.questionnaire.submitStatus

export default questionnaireSlice.reducer
