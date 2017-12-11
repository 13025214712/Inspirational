import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Button,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native'
import { connect } from 'react-redux'

import { NavigationActions, quotationSrc } from '../utils'

const picWidth = Dimensions.get('screen').width
const picHeight = picWidth * 1080 / 1920

@connect(({ app }) => ({ app }))
class Quotation extends Component {
  static navigationOptions = {
    title: 'Quotation',
    header: null,
    tabBarLabel: 'Quotation',
    tabBarIcon: ({ focused, tintColor }) =>
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/person.png')}
      />,
  }

  componentWillMount() {
    this.fetchQuotation()
  }

  fetchQuotation = () => {
    fetch(quotationSrc).then(data => data.json()).then(data => {
      const quotationList = data.showapi_res_body.list
      console.log(data)
      this.props.dispatch({
        type: 'app/changeQuotation',
        payload: { quotationList },
      })
    })
  }

  gotoLogin = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }))
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.props.app.quotationList.map((item, index) =>
          <View>
            <Image style={styles.image} source={{ uri: item.pic }} />
            <Text style={styles.title}>
              {item.title.split('(©')[0]}
            </Text>
            <Text style={styles.content}>
              {item.content}
            </Text>
          </View>
        )}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
  },
  image: {
    width: picWidth,
    height: picHeight,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: 20,
    marginBottom: 30,
  },
})

export default Quotation
