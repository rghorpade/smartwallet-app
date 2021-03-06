import React from 'react'
import { Provider } from 'react-redux'
import { initStore, ThunkDispatch } from './store'
import { navigationActions } from 'src/actions'
import { StatusBar, View } from 'react-native'
import { RoutesContainer } from './routes'
import { AppLoadingAndNotifications } from './ui/generic/appLoadingAndNotifications'
import { useScreens } from 'react-native-screens'
import { isNil } from 'ramda'
import {
  NavigationContainerComponent,
  NavigationRoute,
  NavigationState,
} from 'react-navigation'
import { setActiveNotificationFilter } from './actions/notifications'
import { black } from './styles/colors'

useScreens()

/**
 * NOTE: this is *not* exported on purpose
 * Other parts of the app should generally *not* access the store directly, but
 * rather through being connect()ed through redux
 *
 * If you think you need to export this, then something else probably needs
 * better architecture.
 */
let store: ReturnType<typeof initStore>

export default class App extends React.PureComponent<
  {},
  { showStatusBar: boolean }
> {
  private navigator!: NavigationContainerComponent

  public constructor(props: {}) {
    super(props)
    // only init store once, or else Provider complains (especially on 'toggle
    // inspector')
    //
    // but it needs to be done only when a new App is
    // instantiated because otherwise the overrides at the top of index.ts will
    // have not been excuted yet (while files are being imported) and initStore
    // triggers creation of BackendMiddleware which needs those
    if (!store) store = initStore()
    this.state = {
      showStatusBar: true,
    }
  }

  public handleNavigationChange(
    prevState: NavigationState,
    newState: NavigationState,
  ) {
    // @ts-ignore
    let navigation = this.navigator._navigation
    let curState: NavigationState | NavigationRoute = newState,
      navigationOptions

    while (curState.routes) {
      curState = curState.routes[curState.index]
      const childNav = navigation.getChildNavigation(curState.key)
      navigationOptions = navigation.router.getScreenOptions(childNav)
      navigation = childNav
    }

    const { notifications, statusBar } = navigationOptions

    if (!isNil(notifications)) {
      const thunkDispatch: ThunkDispatch = store.dispatch
      thunkDispatch(setActiveNotificationFilter(notifications))
    }

    if (!isNil(statusBar)) {
      this.setState({ showStatusBar: statusBar })
    } else {
      this.setState({ showStatusBar: true })
    }
  }

  private setNavigator(nav: NavigationContainerComponent | null) {
    if (!nav) return
    this.navigator = nav
    navigationActions.setTopLevelNavigator(this.navigator)
  }

  public render() {
    const { showStatusBar } = this.state
    return (
      <React.Fragment>
        <StatusBar hidden={!showStatusBar} translucent />
        {showStatusBar && (
          <View
            style={{
              width: '100%',
              height: StatusBar.currentHeight,
              backgroundColor: black,
            }}
          />
        )}
        <Provider store={store}>
          <View style={{ flex: 1 }}>
            <RoutesContainer
              onNavigationStateChange={this.handleNavigationChange.bind(this)}
              ref={nav => this.setNavigator(nav)}
            />
            <AppLoadingAndNotifications />
          </View>
        </Provider>
      </React.Fragment>
    )
  }
}
