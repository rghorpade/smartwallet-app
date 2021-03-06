import React from 'react'
import { Wrapper } from 'src/ui/structure/'
import { StyleSheet } from 'react-native'
import { Colors } from 'src/styles'
const loaders = require('react-native-indicator')

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: Colors.white,
    position: 'absolute',
    // to cover things such as the qr code scanner
    zIndex: 1,
  },
})

export class LoadingSpinner extends React.PureComponent {
  componentDidMount() {
    // FIXME
    // HACK because of https://github.com/facebook/react-native/issues/17565
    // the fix will land in RN 0.61
    // then we can get rid of this
    requestAnimationFrame(() => this.forceUpdate())
    // it is actually not even always reproducible :/
  }

  render() {
    // FIXME the key={Date.now()} bit is part of the HACK from above,
    // see componentDidMount
    return (
      <Wrapper style={styles.loadingContainer}>
        <loaders.RippleLoader
          key={Date.now()}
          size={120}
          strokeWidth={4}
          color={Colors.purpleMain}
        />
      </Wrapper>
    )
  }
}
