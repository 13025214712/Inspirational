import React, { Component } from 'react'
import { StyleSheet, View, Button, Image, ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import DOMParser from 'react-native-html-parser';
import { Pagination, WhiteSpace } from 'antd-mobile';

import { NavigationActions, movieSrc } from '../utils'

@connect(({app})=>({app}))
class Movie extends Component {
  static navigationOptions = {
      title: 'Movie',
      header: null,
      tabBarLabel: '电影',
      tabBarIcon: ({ focused, tintColor }) =>
       <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/movie.png')}
      />,
  }

  componentWillMount(){
    if(!this.props.app.movieList.length){
      this.fetchMovie(this.props.app.movieIndex)
    }
  }

  fetchMovie=(movieIndex)=>{
    const src=movieSrc(movieIndex);
    fetch(src).then(data=>data.json()).then(data=>{
      this.parseHTML(data.data);
      this.props.dispatch({type:'app/changeMovieIndex',payload:{movieIndex}})
    })
  }


  parseHTML=(data)=>{
    let movieList=[];
    const parser = new DOMParser.DOMParser({errorHandler:{error:function(w){}}});
    const parsed = parser.parseFromString(data, 'text/html');
    const list=parsed.getElementsByTagName('li');

    for(let i=0;i<list.length;i++){
      let MovieItem={};
      MovieItem.href='http://www.vmovier.com'+list[i].getElementsByTagName('a')[0].getAttribute('href');
      MovieItem.title=list[i].getElementsByTagName('a')[0].getAttribute('title');
      MovieItem.imgSrc=list[i].getElementsByTagName('img')[0].getAttribute('src');
      MovieItem.time=list[i].getElementsByClassName('bottom-cover')[0].textContent;
      MovieItem.mark=list[i].getElementsByClassName('works-ope')[0].textContent.trim();

      movieList.push(MovieItem);
    }

    this.props.dispatch({type:'app/changeMovieList', payload:{movieList } });
    // this.props.dispatch({type:'app/changeArticleTotal', payload:{articleTotal } });
  }


  press=(href, title)=>{
    this.props.dispatch(NavigationActions.navigate({ routeName: 'MovieContent', params:{href, title} }))
  }

  changePage=(page)=>{
    this.scrollView.scrollTo({y:0})
    this.fetchMovie(page)
  }

  render() {
    return (
      <ScrollView style={styles.container} ref={el=>{this.scrollView=el}}>
        {
          this.props.app.movieList.map((item,index)=>{
            return(
                <TouchableOpacity style={styles.touch} key={index} onPress={this.press.bind(this,item.href, item.title)}>
                  <Image source={{uri:item.imgSrc}} style={styles.image}></Image>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                  <Text style={styles.mark}>{item.mark.slice(0,3)}分</Text>
                </TouchableOpacity>

            )
          })
        }
        <Pagination onChange={this.changePage} total={this.props.app.movieTotal} current={this.props.app.movieIndex} locale={{
          prevText: '上一页',
          nextText: '下一页',
        }} />
        <WhiteSpace />
        <WhiteSpace />
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
  touch:{
    marginBottom:20,
  },
  image:{
    width:120,
    height:120*3/4,
  },
  title:{
    position:'absolute',
    left:130,
    right:0,
    fontSize:22,
    lineHeight: 32,
    height: 64,
    overflow: 'hidden',
  },
  time:{
    position:'absolute',
    bottom:0,
    right:10,
  },
  mark:{
    position:'absolute',
    bottom:0,
    left:130,
  }
})

export default Movie
