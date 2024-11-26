/* eslint-disable import/no-cycle */
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import darkModeReducer from './darkModeSlice'
import colorSchemeReducer from './colorSchemeSlice'
import sideMenuReducer from './sideMenuSlice'
import simpleMenuReducer from './simpleMenuSlice'
import topMenuReducer from './topMenuSlice'

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    colorScheme: colorSchemeReducer,
    sideMenu: sideMenuReducer,
    simpleMenu: simpleMenuReducer,
    topMenu: topMenuReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
