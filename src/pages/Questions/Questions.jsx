import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  loadQuestionnaire,
  submitQuestionnaireResponses,
  selectQuestionnaireData,
  selectCurrentCategoryIndex,
  selectFormattedResponses,
  selectQuestionnaireLoading,
  selectQuestionnaireError,
  selectSubmitStatus,
  nextCategory,
  previousCategory
} from '../../redux/slices/questionnaireSlice'

import { ASSESSMENT_STATUS } from '../../constants/statusTypes'
import { useTheme } from '../../hooks/useTheme'
import styles from './Questions.module.css'

const Questions = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { theme } = useTheme()
  
  // Questionnaire state
  const questionnaireData = useSelector(selectQuestionnaireData)
  const currentCategoryIndex = useSelector(selectCurrentCategoryIndex)
  const formattedResponses = useSelector(selectFormattedResponses)
  const loading = useSelector(selectQuestionnaireLoading)
  const error = useSelector(selectQuestionnaireError)
  const submitStatus = useSelector(selectSubmitStatus)

  // Local state for all responses across categories
  const [allResponses, setAllResponses] = useState({}) // Keyed by `${categoryIndex}-${questionIndex}`
  // Local state for current category answers
  const [categoryAnswers, setCategoryAnswers] = useState({})
  const [showRequiredMessage, setShowRequiredMessage] = useState(false)
  // highlightIndexes: array of question indexes to highlight
  const [highlightIndexes, setHighlightIndexes] = useState([])
  const questionRefs = useRef([])
  const categoryHeaderRef = useRef(null)

  // Load questionnaire data on component mount
  useEffect(() => {
    if (questionnaireData.length === 0) {
      dispatch(loadQuestionnaire())
    }
  }, [dispatch, questionnaireData.length])

  // Load existing answers for current category when category changes
  useEffect(() => {
    if (questionnaireData.length > 0 && currentCategoryIndex < questionnaireData.length) {
      const currentCategory = questionnaireData[currentCategoryIndex]
      const existingAnswers = {}
      
      currentCategory.Questions.forEach((question, questionIndex) => {
        const responseKey = `${currentCategoryIndex}-${questionIndex}`
        if (allResponses[responseKey]) {
          existingAnswers[questionIndex] = allResponses[responseKey].selectedOption
        }
      })
      
      setCategoryAnswers(existingAnswers)
    }
  }, [currentCategoryIndex, questionnaireData, allResponses])

  // Debug: Log when formatted responses are updated
  useEffect(() => {
    if (formattedResponses.length > 0) {
      console.log('Redux store updated with formatted responses:', formattedResponses)
    }
  }, [formattedResponses])

  // Handle navigation after successful submission
  useEffect(() => {
    if (submitStatus === 'succeeded') {
      navigate('/assessment/success');
    }
  }, [submitStatus, navigate]);

  // Helper functions
  const getTotalQuestions = () => {
    return questionnaireData.reduce((total, category) => total + category.Questions.length, 0)
  }

  const getAnsweredQuestions = () => {
    // Count all responses in allResponses plus current category answers
    const allResponsesCount = Object.keys(allResponses).length
    const currentCategoryAnswersCount = Object.keys(categoryAnswers).length
    
    // Avoid double counting - check if current category answers are already in allResponses
    const currentCategoryKeys = Object.keys(categoryAnswers).map(qIdx => `${currentCategoryIndex}-${qIdx}`)
    const alreadyCountedInAllResponses = currentCategoryKeys.filter(key => allResponses[key]).length
    
    return allResponsesCount + currentCategoryAnswersCount - alreadyCountedInAllResponses
  }

  const getCurrentCategory = () => {
    return questionnaireData[currentCategoryIndex]
  }

  const areAllCategoryQuestionsAnswered = () => {
    if (!questionnaireData.length || currentCategoryIndex >= questionnaireData.length) return false
    const currentCategory = getCurrentCategory()
    return currentCategory.Questions.every((_, index) => categoryAnswers[index])
  }

  // Get all unanswered question indexes in current category
  const getUnansweredIndexes = () => {
    if (!questionnaireData.length || currentCategoryIndex >= questionnaireData.length) return []
    const currentCategory = getCurrentCategory()
    return currentCategory.Questions.map((_, idx) => idx).filter(idx => !categoryAnswers[idx])
  }

  const getFirstUnansweredIndex = () => {
    if (!questionnaireData.length || currentCategoryIndex >= questionnaireData.length) return null
    const currentCategory = getCurrentCategory()
    return currentCategory.Questions.findIndex((_, index) => !categoryAnswers[index])
  }

  // Event handlers
  const handleAnswerSelect = (questionIndex, optionKey) => {
    const currentCategory = getCurrentCategory()
    const question = currentCategory.Questions[questionIndex]
    const responseKey = `${currentCategoryIndex}-${questionIndex}`
    
    // Update local state for current category
    setCategoryAnswers(prev => {
      const updated = { ...prev, [questionIndex]: optionKey }
      // Remove highlight for this question if it was previously highlighted
      setHighlightIndexes(prevIndexes => prevIndexes.filter(idx => idx !== questionIndex))
      // If all highlights are cleared, remove required message
      setTimeout(() => {
        if (getUnansweredIndexes().length === 0) setShowRequiredMessage(false)
      }, 0)
      return updated
    })
    
    // Update all responses state
    setAllResponses(prev => ({
      ...prev,
      [responseKey]: {
        categoryIndex: currentCategoryIndex,
        questionIndex,
        parameter: currentCategory.Parameter,
        question: question.Question,
        qWeightage: question.qWeightage,
        selectedOption: optionKey,
        optionData: question.Options[optionKey]
      }
    }))
  }

  const handleNext = () => {
    const unanswered = getUnansweredIndexes()
    if (unanswered.length > 0) {
      setShowRequiredMessage(true)
      setHighlightIndexes(unanswered)
      // Scroll to the first unanswered question
      if (questionRefs.current[unanswered[0]]) {
        questionRefs.current[unanswered[0]].scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    } else {
      setShowRequiredMessage(false)
      setHighlightIndexes([])
    }

    // Save current category answers to allResponses before navigating
    const currentCategory = getCurrentCategory()
    const updatedAllResponses = { ...allResponses }
    
    Object.entries(categoryAnswers).forEach(([questionIndex, selectedOption]) => {
      const question = currentCategory.Questions[parseInt(questionIndex)]
      const responseKey = `${currentCategoryIndex}-${questionIndex}`
      updatedAllResponses[responseKey] = {
        categoryIndex: currentCategoryIndex,
        questionIndex: parseInt(questionIndex),
        parameter: currentCategory.Parameter,
        question: question.Question,
        qWeightage: question.qWeightage,
        selectedOption,
        optionData: question.Options[selectedOption]
      }
    })

    const isLastCategory = currentCategoryIndex === questionnaireData.length - 1
    
    if (isLastCategory) {
      // Build the required format for Redux store including all category answers
      const formattedResponses = questionnaireData.map((category, catIdx) => {
        const responses = category.Questions.map((question, qIdx) => {
          const key = `${catIdx}-${qIdx}`
          let response = updatedAllResponses[key]
          
          // If this is the current category, get answers from categoryAnswers state
          if (catIdx === currentCategoryIndex && categoryAnswers[qIdx]) {
            const selectedOption = categoryAnswers[qIdx]
            const optionData = question.Options[selectedOption]
            response = {
              categoryIndex: catIdx,
              questionIndex: qIdx,
              parameter: category.Parameter,
              question: question.Question,
              qWeightage: question.qWeightage,
              selectedOption,
              optionData
            }
          }
          
          if (response) {
            return {
              question: question.Question,
              qWeightage: question.qWeightage,
              selectedOption: response.selectedOption,
              level: response.optionData.Level
            }
          }
          return null
        }).filter(Boolean)
        return {
          Parameter: category.Parameter,
          ParameterWeightage: category.ParameterWeightage,
          responses
        }
      })
      
      // Debug: Log the formatted responses to verify the structure
      console.log('Formatted responses being sent to Redux:', JSON.stringify(formattedResponses, null, 2))
      
      dispatch(submitQuestionnaireResponses(formattedResponses))
      navigate('/assessment-success') // Redirect to assessment success page
    } else {
      // Update allResponses state with current category answers before navigating
      setAllResponses(updatedAllResponses)
      dispatch(nextCategory())
      // Scroll to category heading after navigation
      setTimeout(() => {
        if (categoryHeaderRef.current) {
          categoryHeaderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      // Save current category answers to allResponses before navigating
      const currentCategory = getCurrentCategory()
      const updatedAllResponses = { ...allResponses }
      
      Object.entries(categoryAnswers).forEach(([questionIndex, selectedOption]) => {
        const question = currentCategory.Questions[parseInt(questionIndex)]
        const responseKey = `${currentCategoryIndex}-${questionIndex}`
        updatedAllResponses[responseKey] = {
          categoryIndex: currentCategoryIndex,
          questionIndex: parseInt(questionIndex),
          parameter: currentCategory.Parameter,
          question: question.Question,
          qWeightage: question.qWeightage,
          selectedOption,
          optionData: question.Options[selectedOption]
        }
      })
      
      // Update allResponses state with current category answers before navigating
      setAllResponses(updatedAllResponses)
      dispatch(previousCategory())
      // Scroll to category heading after navigation
      setTimeout(() => {
        if (categoryHeaderRef.current) {
          categoryHeaderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className={`${styles.questions} ${styles[theme]}`}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading questions...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`${styles.questions} ${styles[theme]}`}>
        <div className={styles.container}>
          <div className={styles.error} role="alert">
            <h2>Error Loading Questions</h2>
            <p>{error}</p>
            <button onClick={() => dispatch(loadQuestionnaire())} className={styles.retryButton}>
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No questions state
  if (!questionnaireData || questionnaireData.length === 0) {
    return (
      <div className={`${styles.questions} ${styles[theme]}`}>
        <div className={styles.container}>
          <div className={styles.noQuestions}>
            <h2>No Questions Available</h2>
            <p>Please check back later or contact support.</p>
          </div>
        </div>
      </div>
    )
  }

  const currentCategory = getCurrentCategory()
  const isLastCategory = currentCategoryIndex === questionnaireData.length - 1
  const isFirstCategory = currentCategoryIndex === 0
  const allQuestionsAnswered = areAllCategoryQuestionsAnswered()

  const handleSubmitQuestionnaire = async () => {
    // Reset highlight state
    setHighlightIndexes([]);
    setShowRequiredMessage(false);

    // Save current category answers to allResponses before submitting
    const currentCategory = getCurrentCategory();
    const updatedAllResponses = { ...allResponses };
    
    // Add current category answers to updatedAllResponses
    Object.entries(categoryAnswers).forEach(([questionIndex, selectedOption]) => {
      const question = currentCategory.Questions[parseInt(questionIndex)];
      const responseKey = `${currentCategoryIndex}-${questionIndex}`;
      updatedAllResponses[responseKey] = {
        categoryIndex: currentCategoryIndex,
        questionIndex: parseInt(questionIndex),
        parameter: currentCategory.Parameter,
        question: question.Question,
        qWeightage: question.qWeightage,
        selectedOption,
        optionData: question.Options[selectedOption]
      };
    });

    // Check if all questions across all categories are answered
    const totalQuestions = getTotalQuestions();
    const answeredQuestions = Object.keys(updatedAllResponses).length;
    
    if (answeredQuestions < totalQuestions) {
      setShowRequiredMessage(true);
      const unansweredIndexes = getUnansweredIndexes();
      setHighlightIndexes(unansweredIndexes);
      
      if (unansweredIndexes.length > 0 && questionRefs.current[unansweredIndexes[0]]) {
        questionRefs.current[unansweredIndexes[0]].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }

    try {
      // Format responses for submission - group by parameter
      const formattedResponses = questionnaireData.map((category, catIdx) => {
        const responses = category.Questions.map((question, qIdx) => {
          const key = `${catIdx}-${qIdx}`;
          const response = updatedAllResponses[key];
          
          if (!response) return null;
          
          return {
            question: question.Question,
            qWeightage: question.qWeightage,
            selectedOption: response.selectedOption,
            level: response.optionData.Level
          };
        }).filter(Boolean);

        return {
          Parameter: category.Parameter,
          ParameterWeightage: category.ParameterWeightage,
          responses
        };
      });

      // Submit the questionnaire responses
      await dispatch(submitQuestionnaireResponses(formattedResponses)).unwrap();
      
      // Navigate to the assessment success page
      navigate('/assessment-success');
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  return (
    <div className={`${styles.questions} ${styles[theme]}`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Assessment Questions</h1>
          <div className={styles.progressInfo}>
            <div className={styles.categoryProgress}>
              <span className={styles.progressLabel}>Parameter:</span>
              <span className={styles.progressValue}>
                {currentCategoryIndex + 1} of {questionnaireData.length}
              </span>
            </div>
            <div className={styles.overallProgress}>
              <span className={styles.progressLabel}>Overall Progress:</span>
              <span className={styles.progressValue}>
                {getAnsweredQuestions()} of {getTotalQuestions()} questions answered
              </span>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <div className={styles.categorySection}>
            <div className={styles.categoryHeader} ref={categoryHeaderRef}>
              <h2 className={styles.categoryTitle}>
                {currentCategory.Parameter}
              </h2>
              <p className={styles.categoryDescription}>
                Please answer all questions in this parameter before proceeding to the next.
              </p>
            </div>
            <div className={styles.questionsGrid}>
              {currentCategory.Questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className={
                    `${styles.questionCard} ` +
                    (highlightIndexes.includes(questionIndex) && showRequiredMessage ? styles.highlight : '')
                  }
                  ref={el => (questionRefs.current[questionIndex] = el)}
                  tabIndex={highlightIndexes.includes(questionIndex) && showRequiredMessage ? -1 : undefined}
                  aria-invalid={highlightIndexes.includes(questionIndex) && showRequiredMessage ? 'true' : undefined}
                >
                  <div className={styles.questionHeader}>
                    <h3 className={styles.questionTitle}>
                      Question {questionIndex + 1}
                    </h3>
                  </div>
                  <div className={styles.questionContent}>
                    <p className={styles.questionText}>{question.Question}</p>
                  </div>
                  <div className={styles.optionsContainer}>
                    {Object.entries(question.Options).map(([optionKey, optionValue]) => {
                      const isSelected = categoryAnswers[questionIndex] === optionKey
                      return (
                        <label
                          key={optionKey}
                          className={`${styles.optionLabel} ${isSelected ? styles.selected : ''}`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentCategoryIndex}-${questionIndex}`}
                            value={optionKey}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(questionIndex, optionKey)}
                            className={styles.optionInput}
                          />
                          <div className={styles.optionContent}>
                            <span className={styles.optionText}>
                              {optionValue.Range || optionValue.Description}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.navigation}>
            <div className={styles.navigationButtons}>
              {!isFirstCategory && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={styles.previousButton}
                  disabled={submitStatus === 'pending'}
                >
                  Previous
                </button>
              )}
              {!isLastCategory && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitStatus === 'pending'}
                  className={styles.nextButton}
                  aria-disabled={submitStatus === 'pending'}
                >
                  {submitStatus === 'pending' ? (
                    <span className={styles.loadingText}>
                      <span className={styles.spinner}></span>
                      Saving...
                    </span>
                  ) : (
                    'Next'
                  )}
                </button>
              )}
              {isLastCategory && (
                <button
                  type="button"
                  onClick={handleSubmitQuestionnaire}
                  disabled={submitStatus === 'pending'}
                  className={`${styles.nextButton} ${styles.submitButton}`}
                  aria-disabled={submitStatus === 'pending'}
                >
                  {submitStatus === 'pending' ? (
                    <span className={styles.loadingText}>
                      <span className={styles.spinner}></span>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Assessment'
                  )}
                </button>
              )}
            </div>
            
            {showRequiredMessage && (
              <p className={styles.navigationHint} role="alert">
                Please answer all questions in this parameter to continue. Unanswered questions are highlighted.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Questions
