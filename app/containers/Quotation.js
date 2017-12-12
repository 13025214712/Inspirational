import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import { Button, WhiteSpace } from 'antd-mobile';
import { connect } from 'react-redux'

import { NavigationActions, quotationSrc } from '../utils'

@connect(({ app }) => ({ app }))
class Quotation extends Component {
  static navigationOptions = {
    title: '语录',
    header: null,
    tabBarLabel: '语录',
    tabBarIcon: ({ focused, tintColor }) =>
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/quotation.png')}
      />,
  }

  componentWillMount() {
    if(!this.props.app.quotationList.length){
      this.fetchQuotation();
    }

  }

  fetchQuotation = () => {
    if(this.props.app.quotationList.length){
      this.scrollView.scrollTo({y:0})
    }

    fetch(quotationSrc).then(data => data.json()).then(data => {
      const quotationList = data.showapi_res_body.data
      this.props.dispatch({
        type: 'app/changeQuotation',
        payload: { quotationList },
      })
    })
  }

  render() {
    return (
      <ScrollView style={styles.container} ref={el=>{this.scrollView=el}}>
        {this.props.app.quotationList.map((item, index) =>
          <View key={index}>
            <Text style={styles.english}> {item.english} </Text>
            <Text style={styles.chinese}> {item.chinese} </Text>
          </View>
        )}
        <Button onClick={this.fetchQuotation}>换一批</Button>
        <WhiteSpace/>
        <WhiteSpace/>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  icon: { width: 32, height: 32 },
  english: { fontSize: 20, marginBottom: 10 },
  chinese: { fontSize: 20, marginBottom: 40 },
})

export default Quotation
