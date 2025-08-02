import { useSelector, useDispatch } from 'react-redux'
import { selectTheme, toggleTheme, setTheme } from '../redux/slices/uiSlice'

/**
 * Custom hook for theme management
 * @returns {Object} Theme utilities
 */
export const useTheme = () => {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)

  const toggle = () => {
    dispatch(toggleTheme())
  }

  const setCurrentTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      dispatch(setTheme(newTheme))
    }
  }

  const isDark = theme === 'dark'
  const isLight = theme === 'light'

  return {
    theme,
    toggle,
    setTheme: setCurrentTheme,
    isDark,
    isLight,
  }
}

export default useTheme
