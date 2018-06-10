import { AsyncStorage } from 'react-native';
const baseURL = 'http://60.205.221.163:9010';
//const baseURL = 'http://localhost:9010';
//const baseURL = 'http://192.168.42.202:9010';
const loginURL = baseURL+'/api/login';
const registerURL = baseURL+'/api/register';
const changePasswordURL = baseURL+'/api/changePassword';
const emailCheckURL = baseURL+'/api/emailCheck';

class AccountManager {
    isLogin(){
      
          //查询本地是否储存access_token
          return new Promise(async (callBack,reject)=>{
              const access_token = await AsyncStorage.getItem('access_token');
              const userId = await AsyncStorage.getItem('userId');
              if(access_token && userId){
                  callBack(true);
              } else {
                  callBack(false);
              }
          })
      }

    login(email,password){
        return new Promise(async (callBack,reject)=>{
            try{
                const response = await fetch(loginURL,{
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const responseData = await response.json();
                console.log(responseData);

                if(responseData.success === false){
                    callBack({
                        state:2,
                        message:responseData.message
                    });
                } else {
                    AsyncStorage.setItem('access_token',responseData.data.access_token);
                    if(responseData.data.userId){
                        AsyncStorage.setItem('userId',`${responseData.data.userId}`);
                        callBack({
                            state:0,
                        });
                    } else {
                        callBack({
                            state:1,
                        });
                    }
                }

            } catch(error) {
                console.warn(error);
            }


        });
    }

    logout(){
        AsyncStorage.removeItem('access_token');
    }
    postCheckCode(email){
        return new Promise(async (callBack,reject)=>{
            const response = await fetch(emailCheckURL,{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                })
            });

            const responseDate = await response.json();
            console.log(responseDate);
            if(responseDate.success){
                callBack({
                    state:responseDate.success
                    
                });
            }else{
                callBack({
                    state:responseDate.success,
                    message:responseDate.message
                });
            }
        });
    }
    register(email,password,checkCode){
        return new Promise(async (callBack,reject)=>{
            const response = await fetch(registerURL,{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    checkCode
                })
            });

            const responseDate = await response.json();
            console.log(responseDate);
            if(responseDate.success){
                AsyncStorage.setItem('access_token',responseDate.data.access_token);
            }

            callBack({
                state:responseDate.success,
                message:responseDate.message
            });
        });
    }

    changePassword(old_password,new_password){
        return new Promise(async (callBack,reject)=>{
            const access_token = await AsyncStorage.getItem('access_token');
            const response = await fetch(changePasswordURL,{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token:access_token,
                    oldPassword:old_password,
                    newPassword:new_password
                })
            });

            const json = await response.json();

            callBack({
                state:json.success,
                message:json.message
            });
        });
    }


}

export default new AccountManager();
