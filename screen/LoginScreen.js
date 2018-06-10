import React,{Component} from 'react';
import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {Button,Toast,Flex,} from 'antd-mobile';
import accountManager from '../data_server/AccountManager';

export default class LoginScreen extends Component {
  static navigationOptions = ({navigation}) =>({
    title:'登录',
    headerLeft:null,
    headerStyle: {
        backgroundColor: '#575763',
      },
  });
  constructor(props) {
    super(props)
    this.state = {
      email:'',
      password:'',
      buttonState:false,
    }
  }
  render(){
    return(
      <View style = {styles.container}>
        <Image style={styles.logoImage}
          source={require('../images/login1.jpeg')}
        >
        
        <TextInput
          style={styles.textInput}
          underlineColorAndroid="transparent"
          placeholder="输入登录邮箱"
          onChangeText={(email) => this.setState({email})}
        />   
        <TextInput
          style={styles.textInput}
          underlineColorAndroid="transparent"
          secureTextEntry={true}
          placeholder="输入密码"
          onChangeText={(password) => this.setState({password})}
        />
        
        <Flex>
          
          <Button
              style={styles.button}
              type='primary'
              
              onClick={async ()=>{
                  var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
                  if(!reg.test(this.state.email)){
                      Toast.fail('邮箱格式不正确', 2);
                  }else{
                      Toast.loading('登录中');
                      
                      const result = await accountManager.login(this.state.email,this.state.password);
                      Toast.hide();
                      //登录成功
                      if(result.state === 0){
                          //跳转Home
                          this.props.navigation.replace('RootTabNavigator');
                      }
                      //登录成功但没有初始化用户信息
                      if(result.state === 1){
                          //跳转UserCreate
                          this.props.navigation.replace('CreateUserScreen');
                      }
                      //登录失败
                      if(result.state === 2){
                          Toast.fail(result.message, 1);
                      }
                      
                  }
              }}
          >登录</Button>
          <Button
              style={styles.button}
              type='primary'
              onClick={async()=>{
                  this.props.navigation.navigate('RegisterScreen');
              }}
          >注册</Button>
        </Flex>
        </Image>
      </View>
    );
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
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      width:null,
      width:null,
      //不加这句，就是按照屏幕高度自适应
      //加上这几，就是按照屏幕自适应
      //resizeMode:Image.resizeMode.contain,
      //祛除内部元素的白色背景
      backgroundColor:'rgba(0,0,0,0.5)',
    },
    textInput:{
        borderColor:'gray',
        borderWidth:1,
        borderRadius:5,
        height: 44,
        width:Dimensions.get('window').width-20,
        margin:10,
        padding: 0,
        opacity:1,
        backgroundColor:'rgba(255,255,255,0.5)',
    },
    button:{
        flex:1,
        margin:10,
    }
})
