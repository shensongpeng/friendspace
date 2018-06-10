import React, { Component } from 'react';

import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    Dimensions,
    AsyncStorage,
    Alert,
  } from 'react-native';

import {
    List,
    InputItem,
    Button,
    Toast
} from 'antd-mobile';

import accountManager from '../data_server/AccountManager';

export default class ChangePasswordScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        title:'修改密码',
    });

    constructor(props) {
      super(props)

      this.state = {
         old_password:'',
         new_password:''
      }
    }



    render() {
        return (
        <View>
            <List>
                <InputItem
                    type='password'
                    value={this.state.old_password}
                    onChange={(old_password)=>this.setState({old_password})}
                >
                    当前密码
                </InputItem>
                <InputItem
                    type='password'
                    value={this.state.new_password}
                    onChange={(new_password)=>this.setState({new_password})}
                >
                    新密码
                </InputItem>
            </List>
            <Button
                style={styles.button}
                type='primary'
                onClick={async()=>{
                    Toast.loading('操作中', 0);
                    const result = await accountManager.changePassword(this.state.old_password,this.state.new_password);
                    Toast.hide();
                    if(result.state){
                        Alert.alert(
                            '操作成功',
                            '密码已修改，请使用新密码',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        this.props.navigation.goBack();
                                    }
                                },
                            ],
                            { cancelable: false }
                        )
                    } else {
                        Toast.fail(result.message,2);
                    }
                }}
            >修改密码</Button>
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
    button:{
        height: 44,
        width:Dimensions.get('window').width-20,
        margin:10,
    },
    image:{
      width:100,
      height:100,
      marginTop:20,
    },
    text:{
      marginTop:20,
      width:Dimensions.get('window').width-40,
      fontSize:28,
    }
  })
