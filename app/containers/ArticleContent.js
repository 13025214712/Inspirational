import React, { Component } from 'react'
import { StyleSheet, View, Button, ActivityIndicator, Text, Image, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import DOMParser from 'react-native-html-parser';

import { createAction, NavigationActions } from '../utils'

@connect(({ app }) => ({ app }))
class ArticleContent extends Component {
  static navigationOptions = {
    title: 'ArticleContent',
  }

  componentWillMount(){
    this.fetchContent()
  }

  fetchContent=()=>{
    fetch(this.props.navigation.state.params.href).then(data=>data.text()).then(data=>{
      this.parseHTML(data);
    })
  }

  parseHTML=(data)=>{

    const parser = new DOMParser.DOMParser({errorHandler:{error:function(w){console.warn(w)}}});
    const parsed = parser.parseFromString(data, 'text/html');

    let articleContent={};
    articleContent.title=parsed.getElementsByClassName('w-normal yi-normal-title')[0].textContent.trim();
    articleContent.imgSrc=parsed.getElementsByClassName('inner_pic')[0].getElementsByTagName('img')[0].getAttribute('src');
    articleContent.content=parsed.getElementsByClassName('yi-content-text tc-f4')[0].textContent;
    this.props.dispatch({type:'app/changeArticleContent',payload:{articleContent}})
  }

  onLogin = () => {
    this.props.dispatch(createAction('app/login')())
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  render() {
    const {articleContent}=this.props.app;
    return (
      <ScrollView style={styles.container}>
        <Text>{articleContent.title}</Text>
        <Image source={{uri:articleContent.imgSrc}} style={styles.image} ></Image>
        <Text>{articleContent.content}</Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image:{
    width:300,
    height:300,
  }
})

export default ArticleContent
