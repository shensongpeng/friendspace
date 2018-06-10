import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import SeatManager from '../data_server/SeatManager';

export default class BarcodeScannerExample extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      isBarCodeRead:false,
      screen:'SeatDetileScreen'
    }
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={StyleSheet.absoluteFill}
          />
        </View>
      );
    }
  }
  formatDate(date,fmt) {
    if(/(y+)/.test(fmt)){
      fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
    }
    let o = {
      'M+':date.getMonth() + 1,
      'd+':date.getDate(),
      'h+':date.getHours(),
      'm+':date.getMinutes(),
      's+':date.getSeconds()
    };

    // 遍历这个对象
    for(let k in o){
      if(new RegExp(`(${k})`).test(fmt)){
        // console.log(`${k}`)
        console.log(RegExp.$1)
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str));
      }
    }
    return fmt;
  };

  padLeftZero(str) {
    return ('00'+str).substr(str.length);
  }

  _handleBarCodeRead = async ({ type, data }) => {
    try{
      var obj = JSON.parse(data);
      if(!this.state.isBarCodeRead){
        this.setState({isBarCodeRead:true});
        if(type==='QR_CODE' && obj.id!=null){
          const seatId = obj.id;
          //console.log(obj.id+"id");

          const result = await SeatManager.getSeatStateDetial(seatId);
          console.log(result.state);
          if(result.state === 1){
            //数据处理
            const data = result.data;
            const seatId = data.seatId;
            const seat_remark = data.seat_remark;
            const occcupied_time = (data.occcupied_time)*1/60000;
            const start_time = data.start_time;

            //跳转到详情页
            this.setState({screen:'SeatDetileScreen'});
            this.props.navigation.goBack();
            this.props.navigation.navigate(this.state.screen,{
              seatId:seatId,seat_remark:seat_remark,occcupied_time:occcupied_time,start_time:start_time
            });
          }else if(result.state === 0){
            //跳转到发布页
            this.setState({screen:'PostSeatDetileScreen'});
            this.props.navigation.goBack();
            this.props.navigation.navigate(this.state.screen,{seatId:seatId});
          }

        }else{
          alert(`Bar code with type ${type}`);
          this.setState({isBarCodeRead:false});
        }
      }
    }
    catch(err){
      console.log(err);
    }


  }
}
