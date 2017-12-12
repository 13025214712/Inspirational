import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native'
import { connect } from 'react-redux'

import { NavigationActions, bingSrc } from '../utils'

@connect(({ app }) => ({ app }))
class Bing extends Component {
  static navigationOptions = {
    title: 'Bing',
    header: null,
    tabBarLabel: '美图',
    tabBarIcon: ({ focused, tintColor }) =>
      <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/person.png')}
      />,
  }

  componentWillMount() {
    if(!this.props.app.bingList.length){
      this.fetchBing();
    }
  }

  fetchBing = () => {
    fetch(bingSrc).then(data => data.json()).then(data => {
      const bingList = data.showapi_res_body.list
      this.props.dispatch({ type: 'app/changeBing', payload: { bingList } })
    })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.props.app.bingList.map((item, index) =>
          <View key={index}>
            <Image style={styles.image} source={{ uri: item.pic }} />
            <Text style={styles.title}> {item.title.split('(©')[0]} </Text>
            <Text style={styles.content}> {item.content} </Text>
          </View>
        )}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  icon: { width: 32, height: 32 },
  image: { width: Dimensions.get('screen').width, height: Dimensions.get('screen').width * 1080 / 1920 },
  title: { fontSize: 25, padding: 10, textAlign: 'center' },
  content: { fontSize: 20, paddingLeft:10,paddingRight:10,marginBottom: 50 },
})

export default Bing
