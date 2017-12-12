import React, { Component } from 'react'
import { StyleSheet, View, Button, ActivityIndicator, Text, Image, ScrollView, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import DOMParser from 'react-native-html-parser';
import { WhiteSpace } from 'antd-mobile';
import { createAction, NavigationActions } from '../utils'

@connect(({ app }) => ({ app }))
class ArticleContent extends Component {

  static navigationOptions=({navigation}) => ({
    title: `${navigation.state.params.title}`,
  })

  componentWillMount(){
    this.fetchContent()
  }

  fetchContent=()=>{
    fetch(this.props.navigation.state.params.href).then(data=>data.text()).then(data=>{
      this.parseHTML(data);
    })
  }

  parseHTML=(data)=>{
    const parser = new DOMParser.DOMParser({errorHandler:{error:function(w){}}});
    const parsed = parser.parseFromString(data, 'text/html');

    let articleContent={};
    articleContent.title=parsed.getElementsByClassName('w-normal yi-normal-title')[0].textContent.trim();
    articleContent.imgSrc=parsed.getElementsByClassName('inner_pic')[0].getElementsByTagName('img')[0].getAttribute('src');
    articleContent.content=parsed.getElementsByClassName('yi-content-text tc-f4')[0].textContent;
    this.props.dispatch({type:'app/changeArticleContent',payload:{articleContent}})
  }

  render() {
    const {articleContent}=this.props.app;
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{articleContent.title}</Text>
        <Image source={{uri:articleContent.imgSrc}} style={styles.image} ></Image>
        <Text style={styles.content}>{articleContent.content}</Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title:{
    fontSize:25,
    textAlign:'center',
    padding:10,
  },
  image:{
    width:Dimensions.get('screen').width,
    height:Dimensions.get('screen').width*3/4,
  },
  content:{
    fontSize:20,
    padding:10,
  }
})

export default ArticleContent
