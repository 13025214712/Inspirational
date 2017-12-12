import React, { Component } from 'react'
import { StyleSheet, View, Button, Image, ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import DOMParser from 'react-native-html-parser';

import { NavigationActions, articleSrc } from '../utils'

@connect(({app})=>({app}))
class Article extends Component {
  static navigationOptions = {
      title: 'Article',
      header: null,
      tabBarLabel: 'Bing',
      tabBarIcon: ({ focused, tintColor }) =>
       <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/person.png')}
      />,
  }

  componentDidMount(){
    this.fetchArticle()
  }

  fetchArticle=()=>{
    const src=articleSrc(this.props.app.articleIndex);
    fetch(src).then(data=>data.text()).then(data=>{
      this.parseHTML(data)
     })

  }

  parseHTML=(data)=>{
    let articleList=[];
    const parser = new DOMParser.DOMParser();
    const parsed = parser.parseFromString(data, 'text/html');
    const list=parsed.getElementsByClassName('yi-list-ul')[0].getElementsByTagName('li')

    for(let i=0;i<list.length;i++){
      let articleItem={};
      articleItem.imgSrc=list[i].getElementsByTagName('img')[0].getAttribute('src');

      const a=list[i].getElementsByClassName('yi-list-name')[0].getElementsByTagName('a')[0];
      articleItem.title=a.textContent;
      articleItem.href=a.getAttribute('href');
      articleItem.content=list[i].getElementsByClassName('yi-list-jj')[0].textContent.trim();

      articleList.push(articleItem);
      console.log(articleItem)
    }

    this.props.dispatch({type:'app/changeArticleList', payload:{articleList } })

  }

  gotoDetail = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Article' }))
  }

  goBack = () => {
    this.props.dispatch(NavigationActions.back({ routeName: 'Account' }))
  }

  press=(href)=>{
    this.props.dispatch(NavigationActions.navigate({ routeName: 'ArticleContent', params:{href} }))
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.props.app.articleList.map((item,index)=>{
            return(
                <TouchableOpacity key={index} onPress={this.press.bind(this,item.href)}>
                  <Image source={{uri:item.imgSrc}} style={styles.image}></Image>
                  <Text>{item.title}</Text>
                  <Text>{item.content}</Text>
                </TouchableOpacity>

            )
          })
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: { width: 32, height: 32 },
  image:{
    width:50,
    height:50,
  }
})

export default Article
