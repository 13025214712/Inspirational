import React, { Component } from 'react'
import { StyleSheet, View, Button, Image, ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import DOMParser from 'react-native-html-parser';
import { Pagination, Icon, Card, WhiteSpace } from 'antd-mobile';

import { NavigationActions, articleSrc } from '../utils'

@connect(({app})=>({app}))
class Article extends Component {
  static navigationOptions = {
      title: 'Article',
      header: null,
      tabBarLabel: '文章',
      tabBarIcon: ({ focused, tintColor }) =>
       <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/article.png')}
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
    const parser = new DOMParser.DOMParser({errorHandler:{error:function(w){}}});
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

  press=(href,title)=>{
    this.props.dispatch(NavigationActions.navigate({ routeName: 'ArticleContent', params:{href,title} }))
  }

  changePage=(page)=>{
    this.scrollView.scrollTo({y:0})
    this.fetchArticle(page)
  }

  render() {
    return (
      <ScrollView style={styles.container} ref={el=>{this.scrollView=el}} >
        {
          this.props.app.articleList.map((item,index)=>{
            return(
                <TouchableOpacity key={index} onPress={this.press.bind(this,item.href, item.title)}>
                  <Image source={{uri:item.imgSrc}} style={styles.image}></Image>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.content}>{item.content.slice(5)}</Text>
                </TouchableOpacity>

            )
          })
        }
        <Pagination onChange={this.changePage} total={this.props.app.articleTotal} current={this.props.app.articleIndex} locale={{
          prevText: '上一页',
          nextText: '下一页',
        }} />
        <WhiteSpace/>
        <WhiteSpace/>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
  },
  icon: { width: 25, height: 25 },
  image:{
    width:80,
    height:80*3/4,
  },
  title:{
    position:'absolute',
    marginTop:2,
    left:90,
    right:0,
    fontSize:20,
    lineHeight: 30,
    height: 60,
    overflow: 'hidden',
  },
  content:{
    fontSize:18,
    marginTop:10,
    marginBottom:40,
  }
})

export default Article
