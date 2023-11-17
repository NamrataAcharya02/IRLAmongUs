// used to pass data more easily between react components
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../components/counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
})