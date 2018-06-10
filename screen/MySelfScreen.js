import React, { Component } from 'react';

import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  AsyncStorage,
} from 'react-native'

import {
  Button,
  Flex,
  Toast,
  ImagePicker,
  List,
  InputItem,
} from 'antd-mobile';

import { NavigationActions } from 'react-navigation'

import userManager from '../data_server/UserManager';
import accountManager from '../data_server/AccountManager';

import FriendItem from '../view_component/FriendItem';



export default class MySelfScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
      title:'个人信息',
      headerLeft:null,
      tabBarIcon: ({ focused }) => (
        <Image
          source={focused?require('../images/icon5.png'):require('../images/icon4.png')}
          style={{width:28,height:28}}
        />
    )
  });

  constructor(props) {
    super(props)

    this.state = {
      user:{}
    }
  }


  componentDidMount(){
    Toast.hide();
    userManager.setListener((result)=>{
      console.log("res");
      console.log(result);
      if(result.state){
        this.setState({user:result.user});
      } else {
        console.log(result.message);
      }
    })

    userManager.getUser();

  }


  render() {
    const { images } = this.state;
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{uri:this.state.user.image}}
        />
        <List>
          <InputItem
              value={this.state.user.nickname}
              editable={false}
          >
              昵称
          </InputItem>
          <InputItem
              value={this.state.user.sign}
              editable={false}
          >
              签名
          </InputItem>
        </List>
        <Button
            style={styles.button}
            onClick={()=>{
              console.log('xxx');
              this.props.navigation.navigate('UpdateMySelfScreen',this.state.user);
            }}
        >修改个人资料</Button>
        <Button
            style={styles.button}
            onClick={()=>{
              this.props.navigation.navigate('ChangePasswordScreen');
            }}
        >修改密码</Button>
        <Button
            style={styles.button}
            type='warning'
            onClick={async()=>{
              accountManager.logout();
              const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'LoginScreen'})
                ]
              })
              this.props.navigation.dispatch(resetAction)
            }}
        >退出登录</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
      backgroundColor:'#ffffff',
  },
  button:{
      height: 44,
      width:Dimensions.get('window').width-20,
      margin:10,
  },
  image:{
    width:100,
    height:100,
    margin:20,
    alignSelf:'center'
  },
  text:{
    marginTop:20,
    width:Dimensions.get('window').width-40,
    fontSize:28,
  }
})
