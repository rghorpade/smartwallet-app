import React from 'react'
import Radium from 'radium'
import {
  Container,
  Block,
  SideNote
} from '../../structure'
import {theme} from 'styles'

const STYLES = {
  topBlock: {
    marginTop: '100px'
  },
  greeting: {
    fontSize: '20px',
    color: theme.palette.textColor
  },
  issue: {
    fontSize: '40px',
    color: theme.palette.textColor
  },
  container: {
    backgroundColor: '#fff'
  }
}

@Radium
export default class WalletComingSoon extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    message: React.PropTypes.string
  }

  render() {
    // TODO replace placeholder img
    return (
      <Container style={STYLES.container}>
        <Block style={STYLES.topBlock}>
          <h1 style={STYLES.issue}>Coming Soon!!!</h1>
        </Block>
        <Block>
          <SideNote>
            {this.props.message}
          </SideNote>
        </Block>
      </Container>
    )
  }
}
