import {
    AsyncStorage
} from 'react-native';
const baseURL = 'http://60.205.221.163:9010';
//const baseURL = 'http://localhost:9010';
//const baseURL = 'http://192.168.42.202:9010';
const findFriendURL = baseURL+'/api/findUser';
const getFriendURL = baseURL+'/api/getFollow';
const followFriendURL = baseURL+'/api/follow';
const deleteFollowURL = baseURL+'/api/deleteFollow';

class FriendManager {
    constructor(){
        this.friends = [];
    }

    setFrirndManagerListener(listener){
        this.listener = listener;
    }

    followFriend(userId){

        return new Promise(async(callBack,reject)=>{
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(followFriendURL,{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token,
                    userId
                })
            })
            .catch((err)=>{
                callBack({
                    state:false,
                    message:'网络连接错误',
                });
            });
            try {
              const json = await response.json();

              console.log(json);

              if(json.success){
                  //this.friends = [json.data,...this.friends];
                  console.log('postMe');
                  console.log(this.friends);
                  this.listener({
                      state:true,
                      data:this.friends,
                  });
                  callBack({
                      state:true,
                  });
              } else {
                  callBack({
                      state:false,
                      message:json.message,
                  });
              }
            } catch (e) {

            } finally {

            }

        })
    }

    getFriend(){
      console.log('getFriend');
        return new Promise(async(callBack,reject)=>{
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(getFriendURL,{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token,
                })
            })
            .catch((err)=>{
                callBack({
                    state:false,
                    message:'网络连接错误',
                });
            });
            try {
              const json = await response.json();
              console.log(json.data);
              if(json.success){
                  this.friends = json.data;
                  callBack({
                      state:true,
                      data:json.data,
                  });
              } else {
                  callBack({
                      state:false,
                      message:json.message,
                  });
              }
            } catch (e) {

            } finally {

            }

        })
    }
    deleteFriend(userId){
      console.log('deleteFriend');
      return new Promise(async(callBack,reject)=>{
          //获得本地的登录令牌和用户ID
          const access_token = await AsyncStorage.getItem('access_token');
          const response = await fetch(deleteFollowURL,{
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  access_token,
                  userId
              })
          })
          .catch((err)=>{
              callBack({
                  state:false,
                  message:'网络连接错误',
              });
          });
          try {
            const json = await response.json();
            if(json.success){
                callBack({
                    state:true,
                    message:'删除成功',
                });
            } else {
                callBack({
                    state:false,
                    message:'删除失败',
                });
            }
          } catch (e) {

          } finally {

          }
      });
    }
    findFriend(nickname){
        return new Promise(async(callBack,reject)=>{
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(findFriendURL,{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token,
                    nickname
                })
            })
            .catch((err)=>{
                callBack({
                    state:false,
                    message:'网络连接错误',
                });
            });
            try {
              const json = await response.json();
              if(json.success){
                  callBack({
                      state:true,
                      data:json.data,
                  });
              } else {
                  callBack({
                      state:false,
                      message:json.message,
                  });
              }
            } catch (e) {
              console.log(e.message);
            }

        });
    }
    _fetch(fetch_promise, timeout) {
          var abort_fn = null;

          //这是一个可以被reject的promise
          var abort_promise = new Promise(function(resolve, reject) {
                 abort_fn = function() {
                    reject('abort promise');
                 };
          });

          //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
           var abortable_promise = Promise.race([
                 fetch_promise,
                 abort_promise
           ]);

           setTimeout(function() {
                 abort_fn();
            }, timeout);

           return abortable_promise;
    }

test_fetch(nickname){
    return new Promise(async(callBack,reject)=>{
        const response = await _fetch(fetch(findFriendURL,{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token,
                nickname
            })
        }),5000);
        try {
          const json = await response.json();
          if(json.success){
              callBack({
                  state:true,
                  data:json.data,
              });
          } else {
              callBack({
                  state:false,
                  message:json.message,
              });
          }
        } catch (e) {
          console.log(e.message);
        }
    });
}





}

export default new FriendManager();
