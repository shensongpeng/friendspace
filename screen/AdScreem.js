import React ,{Component} from 'react';
import {Text,View,Image,StyleSheet,Dimensions} from 'react-native';

import accountManager from '../data_server/AccountManager';

export default class AdScreen extends Component {
  static navigationOptions = ({navigation}) =>({
    header:null,
  });
  constructor(props) {
    super(props)
    this.state = {
      n:1,
      screen:'LoginScreen'
    }
  }
  componentDidMount(){
    const timer = setInterval(()=>{
      const n = this.state.n;
      this.setState({
        n:this.state.n-1,
      })
      if(n == 0){
        accountManager.isLogin()
        .then((result)=>{
          if(result){
            this.props.navigation.replace('RootTabNavigator');
          }
        })
        clearInterval(timer);
        this.props.navigation.replace(this.state.screen);
      }
    },2000);
  }
  render(){
    return (
        <Image style = {styles.imgStyle} source={require('../images/timg.jpeg')}>
        </Image>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    justifyContent:'center',
        alignItems:'center'
  },
  text:{
        marginTop:100,
    },
    imgStyle: {

            // 设置宽度
            width:Dimensions.get('window').width,
            // 设置图片填充模式
            resizeMode:'cover'
        }
})
