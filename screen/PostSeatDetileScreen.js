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
import SeatManager from '../data_server/SeatManager';



export default class PostSeatDetileScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
      title:'占座',
  });

  constructor(props) {
    super(props)

    this.state = {
        seatId:'123',
        info:'尚学楼 307',
        occcupied_time:'60',
        seat_remark:'无',
    }
  }


  componentDidMount(){
    const { navigation } = this.props;
    const seatId = navigation.getParam('seatId', '0')+'';
    this.setState({seatId:seatId});
  }


  render() {

    return (
      <View style={styles.container}>

        <List>
            <InputItem
                value={this.state.seatId}
                editable={false}
            >
                座位编号
            </InputItem>
            <InputItem
                value={this.state.info}
                editable={false}
            >
                座位信息
            </InputItem>
            <InputItem
              value={this.state.occcupied_time}
              onChange={(occcupied_time) => this.setState({occcupied_time})}
            >
              占座时长(分钟)
            </InputItem>
            <InputItem
              value={this.state.seat_remark}
              onChange={(seat_remark) => this.setState({seat_remark})}
            >
              留言：
            </InputItem>

        </List>
        <Button onClick={async ()=>{
          Toast.loading('发布中');
          const result = await SeatManager.postSeatStateDetial(this.state.seatId,this.state.occcupied_time,this.state.seat_remark);
          Toast.hide();
          //发布成功
          if(result.state === 1){
              //跳转Home
              this.props.navigation.navigate('HomeScreen');
          }

          //发布失败
          if(result.state === 0){
              Toast.fail(result.message, 1);
          }

        }}
        >提交</Button>
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
