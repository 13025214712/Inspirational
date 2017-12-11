import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'

import { NavigationActions, quotationSrc } from '../utils'

@connect(({ app }) => ({ app }))
class Quotation extends Component {
  static navigationOptions = {
    title: 'Quotation',
    header: null,
    tabBarLabel: 'Quotation',
    tabBarIcon: ({ focused, tintColor }) =>
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/house.png')}
      />,
  }

  componentWillMount() {
    this.fetchQuotation()
  }

  fetchQuotation = () => {
    fetch(quotationSrc).then(data => data.json()).then(data => {
      const quotationList = data.showapi_res_body.data
      this.props.dispatch({
        type: 'app/changeQuotation',
        payload: { quotationList },
      })
      console.log(quotationList)
    })
  }

  gotoDetail = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Detail' }))
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {' '}{/* <Button title="Goto Detail" onPress={this.gotoDetail} /> */}{' '}
        {this.props.app.quotationList.map((item, index) =>
          <View key={index}>
            {' '}<Text style={styles.english}> {item.english} </Text>{' '}
            <Text style={styles.chinese}> {item.chinese} </Text>{' '}
          </View>
        )}{' '}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  icon: { width: 32, height: 32 },
  english: { fontSize: 20, marginBottom: 10 },
  chinese: { fontSize: 20, marginBottom: 20 },
})

export default Quotation
