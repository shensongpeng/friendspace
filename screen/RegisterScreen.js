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
} from 'antd-mobile';

import accountManager from '../data_server/AccountManager';

export default class RegisterScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        title:'注册',
    });

    constructor(props) {
        super(props)

        this.state = {
           email:' ',
           password:' ',
           submitstate:true,
           checkCode:' ',
        }
      }

    render() {
        return (
        <View style={styles.container}>
            <TextInput
                    autoCapitalize='none'
                    style={styles.textInput}
                    underlineColorAndroid="transparent"
                    placeholder="输入登录邮箱"
                    onChangeText={(email) =>{ 
                        this.setState({email})
                        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
                        if(reg.test(this.state.email)){
                          this.setState({submitstate:false});
                        }else{
                           this.setState({submitstate:true}); 
                        }
                    }}
                />
            <TextInput
                style={styles.textInput}
                underlineColorAndroid="transparent"
                placeholder="输入密码"
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password})}
            />
            <Flex>
                <TextInput 
                    style={styles.textInput}
                    flex='2'
                    underlineColorAndroid="transparent"
                    placeholder="输入邮箱收到的验证码"
                    onChangeText={(checkCode)=>{this.setState({checkCode})}}
                />
                <Button
                    disabled={this.state.submitstate}
                    type='primary'
                    flex='1'
                    onClick={async ()=>{
                        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
                        if(!reg.test(this.state.email)){
                          Toast.fail('邮箱格式不正确', 2);
                        }
                        else{
                            
                            const result = await accountManager.postCheckCode(this.state.email);
                            console.log(result);
                            if(result.state){
                                Toast.success('验证码发送成功',2);
                            }else{
                                Toast.fail(result.message, 2);
                                
                            }
                        }
                        }
                    }
                >获取验证码</Button>
            </Flex>
            

            <Button

                type='primary'
                onClick={async ()=>{
                    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
                    var pwreg=/^([a-zA-Z0-9]|[._]){5,19}$/;  
                    if(!reg.test(this.state.email)){
                      Toast.fail('邮箱格式不正确', 2);
                    }else if(!pwreg.test(this.state.password)){
                        Toast.fail('密码格式不正确', 2);
                    }else{
                        Toast.loading('注册中');
                        const result = await accountManager.register(this.state.email,this.state.password,this.state.checkCode);
                        console.log(result);
                        Toast.hide();
                        if(result.state){
                            //跳转UserCreate
                            this.props.navigation.navigate('CreateUserScreen');
                        } else {
                            Toast.fail(result.message, 1);
                        }
                    }
                }}
            >提交注册</Button>
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
        width:Dimensions.get('window').width-20,
    },
    button1:{
        flex:1,
        margin:10,

    }
})
