import React ,{Component} from 'react';
import {Text,View,StyleSheet,Dimensions} from 'react-native';
import {
  Button,
  Flex,
  Toast,
  List,
  InputItem,
} from 'antd-mobile';

export default class SeatDetileScreen extends Component {
  static navigationOptions = ({navigation}) =>({
  	title:'座位详情',
  });
  constructor(props) {
    super(props)
    this.state = {
    	seatId:'1',
    	info:'尚学楼 307',
    	start_time:'2018-4-20 12:27:37',
    	occcupied_time:'60',
    	seat_remark:'无',
    }
  }
  componentDidMount(){
    const { navigation } = this.props;
    const seatId = navigation.getParam('seatId', '0')+'';
    const occcupied_time = navigation.getParam('occcupied_time', '0')+'';
    const seat_remark = navigation.getParam('seat_remark', '0');
    const start_time = navigation.getParam('start_time', '0');
    this.setState({
      seatId:seatId,occcupied_time:occcupied_time,seat_remark:seat_remark,start_time:start_time
    });
  }
  render(){
    return (
      <View style = {styles.container}>
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
              value={this.state.start_time}
              editable={false}
          	>
              开始时间
          	</InputItem>
          	<InputItem
              value={this.state.occcupied_time}
              editable={false}
          	>
              占座时长(分钟)
          	</InputItem>
          	<InputItem
              value={this.state.seat_remark}
              editable={false}
          	>
              留言：
          	</InputItem>
      	</List>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#ffffff',
  },
  text:{
    marginTop:20,
    width:Dimensions.get('window').width-40,
    fontSize:28,
  }
})
