import { User } from '@auth0/auth0-spa-js'
import { createStore, produce } from 'solid-js/store'
import { AuthState } from './auth-state'

type Action =
  | { type: 'LOGIN_POPUP_STARTED' }
  | {
      type:
        | 'INITIALIZED'
        | 'LOGIN_POPUP_COMPLETE'
        | 'GET_ACCESS_TOKEN_COMPLETE'
        | 'HANDLE_REDIRECT_COMPLETE'
      user?: User
    }
  | { type: 'LOGOUT' }
  | { type: 'ERROR'; error: Error }

export const useReducer = (initialState: AuthState) => {
  const [state, setState] = createStore(initialState)
  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'LOGIN_POPUP_STARTED':
        setState(
          produce(store => {
            store.isLoading = true
          }),
        )
        break
      case 'LOGIN_POPUP_COMPLETE':
      case 'INITIALIZED':
        setState(
          produce(store => {
            store.isAuthenticated = !!action.user
            store.user = action.user
            store.isLoading = false
            store.error = undefined
          }),
        )
        break
      case 'HANDLE_REDIRECT_COMPLETE':
      case 'GET_ACCESS_TOKEN_COMPLETE':
        if (state.user?.updated_at === action.user?.updated_at) {
          return
        }
        setState(
          produce(store => {
            store.isAuthenticated = !!action.user
            store.user = action.user
          }),
        )
        break
      case 'LOGOUT':
        setState(
          produce(store => {
            store.isAuthenticated = false
            store.user = undefined
          }),
        )
        break
      case 'ERROR':
        setState(
          produce(store => {
            store.isLoading = false
            store.error = action.error
          }),
        )
    }
  }
  return { state, dispatch }
}
