import React, { Component } from 'react';

import {
  Text,
  View,
  Image,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions
} from 'react-native';

import {
    Grid,
} from 'antd-mobile';


export default class HomeMessageItem extends Component {
  render() {

    const gridData = this.props.images.map((image)=>{
      return {
        icon:image.url,
      }
    });

    return (
      <View style={styles.container}>
        <View style={styles.rightItem}>
          <Image
            style={styles.image}
            source={{uri:this.props.user.image}}
          />
        </View>
        <View style={styles.leftItem}>
          <Text style={styles.nickname}>{this.props.user.nickname}</Text>
          <Text style={styles.content}>{this.props.message_content}</Text>
          <Grid
            data={gridData}
            columnNum={3}
            hasLine={false}
            itemStyle={styles.gridItem}
            renderItem={(el, index)=>{
              return (
                <Image
                  style={styles.contentImage}
                  source={{uri:el.icon}}
                />
              )
            }}
          />
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container:{
      flex:1,
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'flex-start',
      backgroundColor:'#ffffff',
      margin:10,
      marginBottom:0,
  },
  rightItem:{
    width:50,
  },
  leftItem:{
    width:Dimensions.get('window').width-70,
  },
  image:{
    width:40,
    height:40,
    marginTop:5,
  },
  nickname:{
    fontSize:20,
  },
  content:{
    fontSize:18,
    color:'gray',
    marginTop:10,
    marginBottom:10
  },
  gridItem:{
    height:(Dimensions.get('window').width-70)/3,
    justifyContent:'flex-start',
    alignItems:'flex-start'
  },
  contentImage:{
    width:(Dimensions.get('window').width-70)/3-10,
    height:(Dimensions.get('window').width-70)/3-10
  }

})
