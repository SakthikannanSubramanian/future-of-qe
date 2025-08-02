import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, incrementByAmount, reset, selectCount } from '../../redux/slices/counterSlice'
import styles from './Counter.module.css'

const Counter = () => {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()
  const [incrementAmount, setIncrementAmount] = useState(2)

  return (
    <div className={styles.counter}>
      <div className={styles.display}>
        <span className={styles.value}>{count}</span>
      </div>
      
      <div className={styles.controls}>
        <button
          onClick={() => dispatch(increment())}
          className={styles.button}
          aria-label="Increment value"
        >
          +
        </button>
        
        <button
          onClick={() => dispatch(decrement())}
          className={styles.button}
          aria-label="Decrement value"
        >
          -
        </button>
        
        <button
          onClick={() => dispatch(reset())}
          className={`${styles.button} ${styles.resetButton}`}
          aria-label="Reset value"
        >
          Reset
        </button>
      </div>

      <div className={styles.customIncrement}>
        <input
          type="number"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value) || 0)}
          className={styles.input}
          aria-label="Set increment amount"
        />
        <button
          onClick={() => dispatch(incrementByAmount(incrementAmount))}
          className={styles.button}
        >
          Add Amount
        </button>
      </div>
    </div>
  )
}

export default Counter
