import {
  NavigationActions,
  StackActions,
  NavigationNavigateActionPayload,
  NavigationAction,
  NavigationContainerComponent,
} from 'react-navigation'
import { routeList } from 'src/routeList'
import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from 'src/lib/storage/interactionTokens'
import { AppError, ErrorCode } from 'src/lib/errors'
import { withLoading, withErrorScreen } from 'src/actions/modifiers'
import { ThunkAction } from 'src/store'

let deferredNavActions: NavigationAction[] = [],
  dispatchNavigationAction = (action: NavigationAction) => {
    deferredNavActions.push(action)
  }, navigator: NavigationContainerComponent

export const setTopLevelNavigator = (nav: NavigationContainerComponent) => {
  dispatchNavigationAction = nav.dispatch.bind(nav)
  navigator = nav
  deferredNavActions.forEach(dispatchNavigationAction)
  deferredNavActions.length = 0
}

/**
 * NOTE: navigate and navigatorReset both dispatch the navigation actions but
 * the actions are not handled by our reducers. Dispatching is useful for testing
 * (comparing snapshots of store actions) and it makes typescript happy
 */
export const navigate = (
  options: NavigationNavigateActionPayload,
): ThunkAction => dispatch => {
  const action = NavigationActions.navigate(options)
  dispatchNavigationAction(action)
  return dispatch(action)
}

export const navigatorReset = (
  newScreen?: NavigationNavigateActionPayload
): ThunkAction => dispatch => {
  let action
  if (newScreen) {
    action = NavigationActions.navigate(newScreen)
  } else {
    // @ts-ignore
    const navState = navigator.state.nav
    // @ts-ignore
    const navRouter = navigator._navigation.router
    if (navRouter) {
      const { path, params } = navRouter.getPathAndParamsForState(navState)
      action = navRouter.getActionForPathAndParams(path, params)
    }

    // getActionForPathAndParams is typed to potentially return null, but we are
    // using it on the current state itself, so this should "never" happen
    if (!action) throw new Error('impossible')

    // since the top level router is a SwitchRouter,
    // the first action will be to navigate to MainStack, but we are using a
    // StackReset action which will be caught by MainStack, so we can just pass
    // in the nested Navigate action
    // @ts-ignore
    action = action.action
  }

  action = StackActions.reset({
    index: 0,
    actions: [action],
  })

  dispatchNavigationAction(action)
  return dispatch(action)
}

export const navigatorResetHome = (): ThunkAction => dispatch =>
  dispatch(navigatorReset({ routeName: routeList.Home }))

/**
 * The function that parses a deep link to get the route name and params
 * It then matches the route name and dispatches a corresponding action
 * @param url - a deep link string with the following schema: appName://routeName/params
 */
export const handleDeepLink = (url: string): ThunkAction => (
  dispatch,
  getState,
  backendMiddleware,
) => {
  // TODO Fix
  const route: string = url.replace(/.*?:\/\//g, '')
  const params: string = (route.match(/\/([^\/]+)\/?$/) as string[])[1] || ''
  const routeName = route.split('/')[0]

  // The identityWallet is initialised before the deep link is handled. If it
  // is not initialized, then we may not even have an identity.
  if (!backendMiddleware.identityWallet) {
    return dispatch(
      navigate({
        routeName: routeList.Landing,
      }),
    )
  }

  const supportedRoutes = ['consent', 'payment', 'authenticate']
  if (supportedRoutes.includes(routeName)) {
    const interactionToken = JolocomLib.parse.interactionToken.fromJWT(params)
    const handler = interactionHandlers[interactionToken.interactionType]

    if (handler) {
      return dispatch(
        withLoading(withErrorScreen(handler(interactionToken, true))),
      )

    }
  }

  /** @TODO Use error code */
  throw new AppError(
    ErrorCode.ParseJWTFailed,
    new Error('Could not handle interaction token'),
  )
}
