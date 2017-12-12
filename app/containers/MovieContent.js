import React, { Component } from 'react'
import { StyleSheet, View, Button, ActivityIndicator, Text, Image, ScrollView, TouchableHighlight, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import DOMParser from 'react-native-html-parser';
import Video from 'react-native-video';

import { createAction, NavigationActions } from '../utils'

@connect(({ app }) => ({ app }))
class MovieContent extends Component {
  static navigationOptions=({navigation}) => ({
    title: `${navigation.state.params.title}`,
  })

  state={
    videoPaused:false,
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
    const parser = new DOMParser.DOMParser({errorHandler:{error:function(w){}}});
    const parsed = parser.parseFromString(data, 'text/html');

    let movieContent={};
    movieContent.title=parsed.getElementsByClassName('post-title')[0].textContent.trim();
    movieContent.movieSrc=parsed.getElementsByTagName('iframe')[0].getAttribute('src');
    movieContent.content=parsed.getElementsByClassName('p00b204e980')[0].textContent.trim();
    this.props.dispatch({type:'app/changeMovieContent',payload:{movieContent}});
    this.parseVideo(movieContent.movieSrc);
  }

  parseVideo=(src)=>{
    fetch(src).then(data=>data.text()).then(data=>{
      const parser = new DOMParser.DOMParser({errorHandler:{error:function(w){}}});
      const parsed = parser.parseFromString(data, 'text/html');

      const movieVideoSrc='http:'+parsed.getElementsByTagName('video')[0].getAttribute('src');
      this.props.dispatch({type:'app/addMovieVideoSrc',payload:{movieVideoSrc}})
    })
  }

  clickVideo=()=>{
    this.setState((prevState)=>({videoPaused:!prevState.videoPaused}))
  }

  onLogin = () => {
    this.props.dispatch(createAction('app/login')())
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  render() {
    const {movieContent}=this.props.app;
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{movieContent.title}</Text>
        <TouchableHighlight onPress={this.clickVideo}>
          <Video source={{uri:movieContent.movieVideoSrc }}
                 paused={this.state.videoPaused}
                 repeat={true}
                 resizeMode="cover"
                 style={styles.video} />
        </TouchableHighlight>

        <Text style={styles.content}>{'        '+movieContent.content}</Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:10,
  },
  title:{
    fontSize:25,
    textAlign:'center'
  },
  image:{
    width:300,
    height:300,
  },
  video:{
    width:Dimensions.get('screen').width,
    height:Dimensions.get('screen').width*3/4,
    marginTop:10,
    marginBottom:10,
  },
  content:{
    fontSize:20,
    marginBottom:20,
  }
})

export default MovieContent
