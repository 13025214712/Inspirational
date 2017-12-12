import React, { Component } from 'react'
import { StyleSheet, View, Button, Image, ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import DOMParser from 'react-native-html-parser';
import { Pagination, Icon } from 'antd-mobile';

import { NavigationActions, movieSrc } from '../utils'

@connect(({app})=>({app}))
class Movie extends Component {
  static navigationOptions = {
      title: 'Movie',
      header: null,
      tabBarLabel: 'Bing',
      tabBarIcon: ({ focused, tintColor }) =>
       <Image
        style={[styles.icon, { tintColor: focused ? tintColor : 'gray' }]}
        source={require('../images/person.png')}
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

    console.log(list.length)

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


  press=(href)=>{
    this.props.dispatch(NavigationActions.navigate({ routeName: 'MovieContent', params:{href} }))
  }

  changePage=(page)=>{
    console.log(page);
    this.fetchMovie(page)
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.props.app.movieList.map((item,index)=>{
            return(
                <TouchableOpacity key={index} onPress={this.press.bind(this,item.href)}>
                  <Image source={{uri:item.imgSrc}} style={styles.image}></Image>
                  <Text>{item.title}</Text>
                  <Text>{item.time}
                    <Text>{item.mark.slice(0,3)}</Text>
                  </Text>

                </TouchableOpacity>

            )
          })
        }
        <Pagination onChange={this.changePage} total={this.props.app.movieTotal} current={this.props.app.movieIndex} locale={{
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
    width:100,
    height:100,
  }
})

export default Movie
