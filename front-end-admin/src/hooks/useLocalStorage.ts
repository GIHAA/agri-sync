import { useState } from 'react'

/**
 *
 * @param {string} key localstorage key name
 * @param {*} initialValue any initial value to store
 * @returns [storedValue, setValue]
 */

function useLocalStorage(key: string, initialValue: unknown) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  function getLocalStorageItem() {
    try {
      // Get from local storage by key
      const item = localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = useState(getLocalStorageItem())

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: unknown) => {
    try {
      // Allow value to be a function so we have same API as useState
      // const valueToStore =
      let valueToStore
      //   value instanceof Function ? value(storedValue) : value
      if (value instanceof Function) {
        valueToStore = value(storedValue)
      } else {
        valueToStore = value
      }
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }
  return [storedValue, setValue]
}
export default useLocalStorage
