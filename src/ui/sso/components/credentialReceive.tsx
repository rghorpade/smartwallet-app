import { Colors, Spacing } from '../../../styles'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import I18n from '../../../locales/i18n'
import strings from '../../../locales/strings'
import { centeredText, fontMain, fontMedium } from '../../../styles/typography'
import React from 'react'
import { black065, overflowBlack } from '../../../styles/colors'
import { IssuerPublicProfileSummary } from '../../../actions/sso/types'
import { CredentialOffering } from '../../../lib/interactionManager/types'
import { DocumentReceiveCard } from './documentReceiveCard'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreyLighter,
  },
  topSection: {
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  logo: {
    borderRadius: 35,
    width: 70,
    height: 70,
    margin: 10,
  },
  serviceName: {
    fontFamily: fontMedium,
    fontSize: 28,
    color: overflowBlack,
  },
  description: {
    fontFamily: fontMain,
    fontSize: 16,
    color: black065,
    marginTop: 10,
    marginBottom: 4,
    marginHorizontal: '10%',
    ...centeredText,
  },
})

interface Props {
  publicProfile: IssuerPublicProfileSummary | undefined
  credentialOffering: CredentialOffering[]
  onPressDocument: (offering: CredentialOffering) => void
  isDocumentSelected: (offering: CredentialOffering) => boolean
}

export const CredentialReceiveComponent = (props: Props) => {
  const {
    publicProfile,
    credentialOffering,
    isDocumentSelected,
    onPressDocument,
  } = props

  return (
    <React.Fragment>
      <View style={styles.topSection}>
        {publicProfile && (
          <React.Fragment>
            <Image style={styles.logo} source={{ uri: publicProfile.image }} />
            <Text style={styles.serviceName}>{publicProfile.name}</Text>
          </React.Fragment>
        )}
        <Text style={styles.description}>
          {I18n.t(
            strings.CHOOSE_ONE_OR_MORE_DOCUMENTS_PROVIDED_BY_THIS_SERVICE_AND_WE_WILL_GENERATE_THEM_FOR_YOU,
          )}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: '50%' }}
        style={{ width: '100%' }}
      >
        {credentialOffering.map(offering => {
          const selected = isDocumentSelected(offering)
          const onPress = () => {
            onPressDocument(offering)
          }
          return (
            <DocumentReceiveCard
              onPress={onPress}
              selected={selected}
              offering={offering}
            />
          )
        })}
      </ScrollView>
    </React.Fragment>
  )
}
