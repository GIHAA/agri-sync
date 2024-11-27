/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

const colorSchemes = [
  'default',
  'theme-1',
  'theme-2',
  'theme-3',
  'theme-4',
] as const

export type ColorSchemes = (typeof colorSchemes)[number]

interface ColorSchemeState {
  value: ColorSchemes
}

const getColorScheme = () => {
  const colorScheme = localStorage.getItem('colorScheme')
  return colorSchemes.filter((item, key) => {
    return item === colorScheme
  })[0]
}

const initialState: ColorSchemeState = {
  value:
    localStorage.getItem('colorScheme') === null ? 'default' : getColorScheme(),
}

export const colorSchemeSlice = createSlice({
  name: 'colorScheme',
  initialState,
  reducers: {
    setColorScheme: (state, action: PayloadAction<ColorSchemes>) => {
      state.value = action.payload
    },
  },
})

export const { setColorScheme } = colorSchemeSlice.actions

export const selectColorScheme = (state: RootState) => {
  if (localStorage.getItem('colorScheme') === null) {
    localStorage.setItem('colorScheme', 'default')
  }

  return state.colorScheme.value
}

export default colorSchemeSlice.reducer
