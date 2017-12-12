import React, { Component } from 'react'
import { StyleSheet, View, Button, Image, ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import DOMParser from 'react-native-html-parser';
import { Pagination, Icon } from 'antd-mobile';

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

  componentWillMount(){
    if(!this.props.app.articleList.length){
      this.fetchArticle(this.props.app.articleIndex)
    }

  }

  fetchArticle=(articleIndex)=>{
    const src=articleSrc(articleIndex);
    fetch(src).then(data=>data.text()).then(data=>{
      this.parseHTML(data);
      this.props.dispatch({type:'app/changeArticleIndex',payload:{articleIndex}})
     })

  }

  parseHTML=(data)=>{
    let articleList=[];
    const parser = new DOMParser.DOMParser({errorHandler:{error:function(w){console.warn(w)}}});
    const parsed = parser.parseFromString(data, 'text/html');
    const list=parsed.getElementsByClassName('yi-list-ul')[0].getElementsByTagName('li')

    for(let i=0;i<list.length;i++){
      let articleItem={};
      articleItem.imgSrc=list[i].getElementsByTagName('img')[0].getAttribute('src');

      const a=list[i].getElementsByClassName('yi-list-name')[0].getElementsByTagName('a')[0];
      articleItem.title=a.textContent;
      articleItem.href=a.getAttribute('href');
      articleItem.content=list[i].getElementsByClassName('yi-list-jj')[0].textContent.trim();
//gotopage-s
      articleList.push(articleItem);
    }

    const articleTotal=parsed.getElementsByClassName('gotopage-s yi-pageturn-n-select')[0].getElementsByTagName('option').length;

    this.props.dispatch({type:'app/changeArticleList', payload:{articleList } });
    this.props.dispatch({type:'app/changeArticleTotal', payload:{articleTotal } });

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

  changePage=(page)=>{
    console.log(page);
    this.fetchArticle(page)
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
        <Pagination onChange={this.changePage} total={this.props.app.articleTotal} current={this.props.app.articleIndex} locale={{
          prevText: 'Prev',
          nextText: 'Next',
        }} />
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
