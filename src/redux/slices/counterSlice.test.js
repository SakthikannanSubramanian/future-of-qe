import { describe, it, expect } from 'vitest'
import counterReducer, {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from '../redux/slices/counterSlice'

describe('counterSlice', () => {
  const initialState = {
    value: 0,
    status: 'idle',
  }

  it('should return the initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle increment', () => {
    const actual = counterReducer(initialState, increment())
    expect(actual.value).toEqual(1)
  })

  it('should handle decrement', () => {
    const actual = counterReducer(initialState, decrement())
    expect(actual.value).toEqual(-1)
  })

  it('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(5))
    expect(actual.value).toEqual(5)
  })

  it('should handle reset', () => {
    const stateWithValue = { value: 10, status: 'idle' }
    const actual = counterReducer(stateWithValue, reset())
    expect(actual.value).toEqual(0)
  })
})
