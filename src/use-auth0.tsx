import { User } from '@auth0/auth0-spa-js'
import { useContext } from 'solid-js'
import Auth0Context, { Auth0ContextInterface } from './auth0-context'

/**
 * ```js
 * const {
 *   // Auth state:
 *   error,
 *   isAuthenticated,
 *   isLoading,
 *   user,
 *   // Auth methods:
 *   getAccessTokenSilently,
 *   getAccessTokenWithPopup,
 *   getIdTokenClaims,
 *   loginWithRedirect,
 *   loginWithPopup,
 *   logout,
 * } = useAuth0<TUser>();
 * ```
 *
 * Use the `useAuth0` hook in your components to access the auth state and methods.
 *
 * TUser is an optional type param to provide a type to the `user` field.
 */
export default <TUser extends User = User>(): Auth0ContextInterface<TUser> =>
  useContext(Auth0Context) as Auth0ContextInterface<TUser>
