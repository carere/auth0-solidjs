import { createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'
import useAuth0 from './use-auth0'

type Result<D> = { error?: Error; loading: boolean; data?: D }

export default <D>(
  url: string,
  options: { audience: string; scope: string } & RequestInit,
): Result<D> => {
  const { getAccessTokenSilently } = useAuth0()
  const [state, setState] = createStore<Result<D>>({
    error: undefined,
    loading: true,
    data: undefined,
  })

  createEffect(async () => {
    try {
      const { audience, scope, ...fetchOptions } = options
      const accessToken = await getAccessTokenSilently({ audience, scope })
      const res = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          // Add the Authorization header to the existing headers
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setState({
        data: (await res.json()) as D,
        error: undefined,
        loading: false,
      })
    } catch (error) {
      setState({
        ...state,
        error: error as Error,
        loading: false,
      })
    }
  })

  return state
}
