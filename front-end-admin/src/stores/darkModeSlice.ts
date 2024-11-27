/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-cycle
import { RootState } from './store'

interface DarkModeState {
  value: boolean
}

const initialState: DarkModeState = {
  value: localStorage.getItem('darkMode') === 'true',
}

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload
    },
  },
})

export const { setDarkMode } = darkModeSlice.actions

export const selectDarkMode = (state: RootState) => {
  if (localStorage.getItem('darkMode') === null) {
    localStorage.setItem('darkMode', 'false')
  }

  return state.darkMode.value
}

export default darkModeSlice.reducer
