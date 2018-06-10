import {
    AsyncStorage
} from 'react-native';
const baseURL = 'http://60.205.221.163:9010';
//const baseURL = 'http://localhost:9010';
//const baseURL = 'http://192.168.42.240:9010';
const postMessageURL = baseURL+'/api/PostMessage';
const homeMessageURL = baseURL+'/api/homeMessage';

class MessageManager {

    constructor(){
        this.messages = [];
    }

    setMessageManagerListener(listener){
        this.listener = listener;
    }


    getHomeMessages(){
      console.log('gogogog');
        return new Promise(async(callBack,reject)=>{
            const access_token = await AsyncStorage.getItem('access_token');
            console.log('json');
            const response = await fetch(homeMessageURL,{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token
                })
            });
            const json = await response.json();

            console.log(json);

            if(json.success){

                this.messages = json.data;
                this.listener({
                    state:true,
                    data:json.data,
                });
                console.log('get m ok');
                callBack();
            } else {
              console.log('get m not ok');
                this.listener({
                    state:false,
                    message:json.message,
                });
                callBack();
            }
        })
    }

    postMessage(message){
        return new Promise(async(callBack,reject)=>{
            const access_token = await AsyncStorage.getItem('access_token');
            const formData = new FormData();
            formData.append('access_token',access_token);
            formData.append('message_content',message.content);
            message.images.map((image,index)=>{
                formData.append(`image${index}`,{
                    uri:image.url,
                    name:`image${index}.png`,
                    type:'image/png'
                });
            });
            console.log(message);
            const response = await fetch(postMessageURL,{
                method:'POST',
                "Content-Type":"multipart/form-data",
                body: formData,
            })
            const json = await response.json();

            console.log(json);

            if(json.success){
                this.messages = [json.data,...this.messages];
                console.log('postMe');
                console.log(this.messages);
                this.listener({
                    state:true,
                    data:this.messages,
                });
            }

            callBack({
                state:json.success,
                message:json.message,
            })

        })
    }
}

export default new MessageManager();
