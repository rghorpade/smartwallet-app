import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Wrapper } from 'src/ui/structure/'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Typography, Colors } from 'src/styles'
import { HandAnimationComponent } from './handAnimation'

interface Props {
  addPoint: (x: number, y: number) => void
  readonly progress: number
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.blackMain,
  },
  text: {
    ...Typography.subMainText,
    textAlign: 'center',
    color: Colors.sandLight,
    position: 'absolute',
    top: '20%',
    paddingHorizontal: '5%',
  },
  bigFont: {
    fontSize: Typography.text4XL,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
})

export const EntropyComponent: React.FC<Props> = props => {
  const { progress, addPoint } = props

  const msg =
    progress === 0
      ? I18n.t(strings.FOR_SECURITY_PURPOSES_WE_NEED_SOME_RANDOMNESS) +
        '. ' +
        I18n.t(strings.PLEASE_TAP_THE_SCREEN_AND_DRAW_ON_IT_RANDOMLY)
      : `${Math.trunc(progress * 100)} %`

  const textStyle = progress === 0 ? styles.text : [styles.text, styles.bigFont]

  return (
    <Wrapper style={styles.mainContainer}>
      <Text testID="entropyMsg" style={textStyle}>
        {msg}
      </Text>
      <Wrapper testID="scratchArea" style={styles.contentContainer}>
        {progress === 0 ? (
          <View style={{ position: 'absolute' }}>
            <HandAnimationComponent />
          </View>
        ) : null}
        <MaskedImageComponent disabled={progress === 1} addPoint={addPoint} />
      </Wrapper>
    </Wrapper>
  )
}
