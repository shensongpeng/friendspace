import { AsyncStorage } from 'react-native';
const baseURL = 'http://60.205.221.163:9010';
//const baseURL = 'http://localhost:9010';
//const baseURL = 'http://192.168.42.202:9010';
const getSeatStateDetialURL = baseURL+'/api/getSeatStateDetail';
const postSeatStateDetialURL = baseURL+'/api/postSeatstatedetail';

class SeatManager {
    getSeatStateDetial(seatId){
      return new Promise(async (callBack,reject)=>{
          try{
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(getSeatStateDetialURL,{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token:access_token,
                    seatId:seatId,
                })
            });

            const responseData = await response.json();
            console.log(responseData);
            if(responseData.state === 0){
              console.log("responseData    "+responseData.state);
              callBack({
                success:responseData.success,
                state:responseData.state,
              });
            }
            else{
              console.log("responseData    "+responseData.state);
              callBack({
                success:responseData.success,
                state:responseData.state,
                data:responseData.data
              });
            }
            callBack({
              success:responseData.success,
              state:responseData.state,
              data:responseData.data
            });

            reject({
              success:false,
              message:'连接失败',
            });
          } catch(error) {
              console.warn(error);
          }


      });
    }

    postSeatStateDetial(seatId,occcupied_time,seat_remark){
      occcupied_time = occcupied_time*60*1000;//单位换成毫秒
      return new Promise(async (callBack,reject)=>{
          const access_token = await AsyncStorage.getItem('access_token');
          const response = await fetch(postSeatStateDetialURL,{
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  access_token:access_token,
                  seatId:seatId,
                  occcupied_time:occcupied_time,
                  seat_remark:seat_remark,
              })
          });
          //state标记发布的主状态  0为失败 1 为成功
          const json = await response.json();
          if(json.success === false){
            callBack({
                state:0,
                message:json.message
            });
          }else{
            callBack({
                state:1,
                data:json.data
            });
          }
          reject({
              state:false,
              message:'网络连接失败'
          });
      });
    }



}

export default new SeatManager();
