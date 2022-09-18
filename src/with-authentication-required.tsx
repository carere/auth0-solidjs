import { RedirectLoginOptions, User } from '@auth0/auth0-spa-js'
import { Component, createEffect, Show } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'
import useAuth0 from './use-auth0'

/**
 * Options for the withAuthenticationRequired Higher Order Component
 */
export interface WithAuthenticationRequiredOptions {
  /**
   * ```js
   * withAuthenticationRequired(Profile, {
   *   returnTo: '/profile'
   * })
   * ```
   *
   * or
   *
   * ```js
   * withAuthenticationRequired(Profile, {
   *   returnTo: () => window.location.hash.substr(1)
   * })
   * ```
   *
   * Add a path for the `onRedirectCallback` handler to return the user to after login.
   */
  returnTo?: string | (() => string)
  /**
   * ```js
   * withAuthenticationRequired(Profile, {
   *   onRedirecting: () => <div>Redirecting you to the login...</div>
   * })
   * ```
   *
   * Render a message to show that the user is being redirected to the login.
   */
  onRedirecting?: () => JSX.Element
  /**
   * ```js
   * withAuthenticationRequired(Profile, {
   *   loginOptions: {
   *     appState: {
   *       customProp: 'foo'
   *     }
   *   }
   * })
   * ```
   *
   * Pass additional login options, like extra `appState` to the login page.
   * This will be merged with the `returnTo` option used by the `onRedirectCallback` handler.
   */
  loginOptions?: RedirectLoginOptions
  /**
   * Check the user object for JWT claims and return a boolean indicating
   * whether or not they are authorized to view the component.
   */
  claimCheck?: (claims?: User) => boolean
}

/**
 * ```js
 * const MyProtectedComponent = withAuthenticationRequired(MyComponent);
 * ```
 *
 * When you wrap your components in this Higher Order Component and an anonymous user visits your component
 * they will be redirected to the login page and returned to the page they we're redirected from after login.
 */
export default <P extends object>(
  Component: Component<P>,
  options: WithAuthenticationRequiredOptions = {},
) => {
  const {
    returnTo = () => `${window.location.pathname}${window.location.search}`,
    onRedirecting = () => <div>Authentification en cours...</div>,
    loginOptions,
  } = options

  return (props: P) => {
    const { state, loginWithRedirect } = useAuth0()

    createEffect(async () => {
      if (!state.isAuthenticated && !state.isLoading) {
        await loginWithRedirect({
          ...loginOptions,
          appState: {
            ...(loginOptions && (loginOptions as RedirectLoginOptions<object>).appState),
            returnTo: typeof returnTo === 'function' ? returnTo() : returnTo,
          },
        })
      }
    })

    return (
      <Show when={state.isAuthenticated} fallback={onRedirecting()}>
        <Component {...props} />
      </Show>
    )
  }
}
