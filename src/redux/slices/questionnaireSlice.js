import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Initial questionnaire data
const initialQuestionnaireData = [
   {
     "Parameter": "Automation coverage",
     "ParameterWeightage": 11,
     "Recommendations": [
      {
        "level": 1,
        "recommendation": "Start by automating high-priority test cases such as regression tests. Begin with smaller, repetitive tasks that are critical to project delivery."
      },
      {
        "level": 2,
        "recommendation": "Expand your automation coverage by including more functional and non-functional tests. Look into increasing test coverage for edge cases and add automation for key workflows."
      },
      {
        "level": 3,
        "recommendation": "Increase the depth of your automation by covering all critical features and business logic. Ensure your tests are comprehensive and can be executed across various platforms."
      },
      {
        "level": 4,
        "recommendation": "Achieve full automation coverage across all testing types, including performance and security testing. Continue optimizing your framework for increased execution speed and scalability."
      }
    ],
     "Questions": [
       {
         "Question": "What percentage of Regression test cases have been automated?",
         "qWeightage": 3,
         "Options": {
           "a": {
             "Range": "80-100%",
             "Level": 4
           },
           "b": {
             "Range": "50-80%",
             "Level": 3
           },
           "c": {
             "Range": "25-50%",
             "Level": 2
           },
           "d": {
             "Range": "0-25%",
             "Level": 1
           }
         }
       },
       {
         "Question": "What percentage of End-to-End test cases have been automated?",
         "qWeightage": 2,
         "Options": {
           "a": {
             "Range": "80-100%",
             "Level": 4
           },
           "b": {
             "Range": "50-80%",
             "Level": 3
           },
           "c": {
             "Range": "25-50%",
             "Level": 2
           },
           "d": {
             "Range": "0-25%",
             "Level": 1
           }
         }
       },
       {
         "Question": "What percentage of device automation test cases have been automated?",
         "qWeightage": 1,
         "Options": {
           "a": {
             "Range": "80-100%",
             "Level": 4
           },
           "b": {
             "Range": "50-80%",
             "Level": 3
           },
           "c": {
             "Range": "25-50%",
             "Level": 2
           },
           "d": {
             "Range": "0-25%",
             "Level": 1
           }
         }
       },
       {
         "Question": "Select the level of functional test cases automated?",
         "qWeightage": 4,
         "Options": {
           "a": {
             "Description": "Very few or No test cases are automated",
             "Level": 1
           },
           "b": {
             "Description": "Only Critical",
             "Level": 2
           },
           "c": {
             "Description": "Critical and Major",
             "Level": 3
           },
           "d": {
             "Description": "All functional test cases are automated",
             "Level": 4
           }
         }
       }
     ]
   },
   {
     "Parameter": "Automated NFT",
     "ParameterWeightage": 9,
     "Recommendations": [
      {
        "level": 1,
        "recommendation": "Begin automating performance, security, and accessibility testing for critical functionalities. Focus on automating the basic non-functional tests that are most relevant to your project."
      },
      {
        "level": 2,
        "recommendation": "Increase the scope of your non-functional tests by adding more complex tests like load and stress testing. Start integrating tools such as JMeter for performance and OWASP for security testing."
      },
      {
        "level": 3,
        "recommendation": "Automate a wider range of non-functional tests, such as compatibility across multiple browsers and devices. Ensure that all critical non-functional aspects are fully covered."
      },
      {
        "level": 4,
        "recommendation": "At this level, ensure that non-functional tests are integrated into your continuous integration pipeline. Regularly run automated performance and security tests, and use predictive analytics for proactive improvements."
      }
    ],
     "Questions": [
       {
         "Question": "How much percentage of your Performance Testing automated?",
         "qWeightage": 6,
         "Options": {
           "a": {
             "Range": "80-100%",
             "Level": 4
           },
           "b": {
             "Range": "50-80%",
             "Level": 3
           },
           "c": {
             "Range": "25-50%",
             "Level": 2
           },
           "d": {
             "Range": "0-25%",
             "Level": 1
           }
         }
       },
       {
         "Question": "How much percentage of your Accessibility Testing automated?",
         "qWeightage": 2,
         "Options": {
           "a": {
             "Range": "80-100%",
             "Level": 4
           },
           "b": {
             "Range": "50-80%",
             "Level": 3
           },
           "c": {
             "Range": "25-50%",
             "Level": 2
           },
           "d": {
             "Range": "0-25%",
             "Level": 1
           }
         }
       },
       {
         "Question": "How much percentage of your Security Testing automated?",
         "qWeightage": 5,
         "Options": {
           "a": {
             "Range": "80-100%",
             "Level": 4
           },
           "b": {
             "Range": "50-80%",
             "Level": 3
           },
           "c": {
             "Range": "25-50%",
             "Level": 2
           },
           "d": {
             "Range": "0-25%",
             "Level": 1
           }
         }
       },
       {
         "Question": "How much percentage of your Compatibility Testing (Browsers) automated?",
         "qWeightage": 4,
         "Options": {
           "a": {
             "Range": "80-100%",
             "Level": 4
           },
           "b": {
             "Range": "50-80%",
             "Level": 3
           },
           "c": {
             "Range": "25-50%",
             "Level": 2
           },
           "d": {
             "Range": "0-25%",
             "Level": 1
           }
         }
       },
       {
         "Question": "How much percentage of your Compatibility Testing (Devices) automated?",
         "qWeightage": 3,
         "Options": {
           "a": {
             "Range": "80-100%",
             "Level": 4
           },
           "b": {
             "Range": "50-80%",
             "Level": 3
           },
           "c": {
             "Range": "25-50%",
             "Level": 2
           },
           "d": {
             "Range": "0-25%",
             "Level": 1
           }
         }
       },
       {
         "Question": "How much percentage of your Usability Testing automated?",
         "qWeightage": 1,
         "Options": {
           "a": {
             "Range": "80-100%",
             "Level": 4
           },
           "b": {
             "Range": "50-80%",
             "Level": 3
           },
           "c": {
             "Range": "25-50%",
             "Level": 2
           },
           "d": {
             "Range": "0-25%",
             "Level": 1
           }
         }
       }
     ]
   },
   
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
