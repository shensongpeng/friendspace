import React, { Component } from 'react';

import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  Dimensions
} from 'react-native'

import {
  Button,
  Flex,
  Toast,
  ImagePicker,
  List,
  InputItem,
} from 'antd-mobile';

import userManager from '../data_server/UserManager';

export default class CreateUserScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
       images:[],
       nickname:'',
       sign:'',
    }
  }


  static navigationOptions = ({ navigation }) => ({
      title:'用户信息',
  });

  onChange = (images, type, index) => {
    console.log(images, type, index);
    this.setState({
      images,
    });
  }


  render() {
    const { images } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.imagePickerContainer}>
          <ImagePicker
            files={images}
            onChange={this.onChange}
            onImageClick={(index, fs) => console.log(index, fs)}
            selectable={images.length < 1}
          />
        </View>
        <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            placeholder="昵称"
            onChangeText={(nickname) => this.setState({nickname})}
        />
        <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            placeholder="个性签名"
            onChangeText={(sign) => this.setState({sign})}
        />
        <Button
            style={styles.button}
            type='primary'
            onClick={async()=>{
                const {nickname ,sign} = this.state;
                const image = this.state.images[0].url;
                const user = {
                  nickname,
                  sign,
                  image
                }
                const result = await userManager.createUser(user);
                if(result.state){
                  this.props.navigation.replace('RootTabNavigator');
                } else {
                  Toast.fail(result.message, 1);
                }
            }}
        >完成</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
      flex:1,
      justifyContent:'flex-start',
      alignItems:'center',
      backgroundColor:'#ffffff',
  },
  text:{
      marginTop:100,
  },
  logoImage:{
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').width*0.6,
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
  }
})
