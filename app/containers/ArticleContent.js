import React, { Component } from 'react'
import { StyleSheet, View, Button, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import { createAction, NavigationActions } from '../utils'

@connect(({ app }) => ({ ...app }))
class ArticleContent extends Component {
  static navigationOptions = {
    title: 'ArticleContent',
  }

  onLogin = () => {
    this.props.dispatch(createAction('app/login')())
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  render() {
    const { fetching } = this.props
    return (
      <View style={styles.container}>
        {fetching
          ? <ActivityIndicator />
          : <Button title={this.props.navigation.state.params.href} onPress={this.onLogin} />}
        {!fetching && <Button title="Close" onPress={this.onClose} />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ArticleContent
