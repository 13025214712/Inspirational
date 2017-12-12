import React, { Component } from 'react'
import { StyleSheet, View, Button, ActivityIndicator, Text, Image, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import DOMParser from 'react-native-html-parser';

import { createAction, NavigationActions } from '../utils'

@connect(({ app }) => ({ app }))
class MovieContent extends Component {
  static navigationOptions = {
    title: 'MovieContent',
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

    console.log(movieContent)
    this.props.dispatch({type:'app/changeMovieContent',payload:{movieContent}})
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
        <Text>{movieContent.title}</Text>
        {/*<Image source={{uri:movieContent.movieSrc}} style={styles.image} ></Image>*/}
        <Text>{movieContent.content}</Text>
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

export default MovieContent
