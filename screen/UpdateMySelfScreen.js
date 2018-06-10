import React, { Component } from 'react';

import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'

import {
  Button,
  Flex,
  Toast,
  List,
  InputItem,
} from 'antd-mobile';

import {
  ImagePicker
} from 'expo';

import userManager from '../data_server/UserManager';


export default class UpdateMySelfScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
      title:'修改用户信息',
  });

  constructor(props) {
    super(props)

    this.state = {
        isClick:false,
        image:'',
        nickname:'',
        sign:'',
        isLocalImage:false
    }
  }


  componentDidMount(){
    const { nickname,sign,image } = this.props.navigation.state.params;

    this.setState({
      nickname,
      sign,
      image
    })
  }


  render() {

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.imagePickerContainer}
          onPress={async()=>{
            const result = await ImagePicker.launchImageLibraryAsync();
            console.log(result);
            if(result.cancelled == false){
              this.setState({
                image:result.uri,
                isLocalImage:true
              })
            }
          }}
        >
          <Image
            style={styles.image}
            source={{uri:this.state.image}}
          />
        </TouchableOpacity>
        <List>
            <InputItem
                value={this.state.nickname}
                onChange={(nickname) => this.setState({nickname})}
            >
                昵称
            </InputItem>
            <InputItem
                value={this.state.sign}
                onChange={(sign) => this.setState({sign})}
            >
                签名
            </InputItem>
        </List>
        <Button
            style={styles.button}
            type='primary'
            onClick={async()=>{
              if(!this.state.isClick){
                const {nickname ,sign,image,isLocalImage} = this.state;

                const user = {
                  nickname,
                  sign,
                }
                if(isLocalImage){
                  user.image = image;
                }
                const result = await userManager.updateUser(user);
                if(result.state){
                  this.props.navigation.goBack();
                } else {
                  Toast.fail(result.message, 1);
                }
                this.setState({
                  isClick:true
                });
              }

            }}
        >完成</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
      backgroundColor:'#ffffff',
  },
  textInput:{
      borderColor:'gray',
      borderWidth:1,
      borderRadius:5,
      height: 44,
      width:Dimensions.get('window').width-20,
      margin:10,
      padding: 0,
  },
  button:{
      height: 44,
      width:Dimensions.get('window').width-20,
      margin:10,
  },
  imagePickerContainer:{
    margin:10,
    width:Dimensions.get('window').width-20,
  },
  image:{
    width:80,
    height:80,
    borderColor:'gray',
    borderWidth:1,
    borderRadius:4,
  }
})
