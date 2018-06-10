import React, { Component } from 'react';

import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    Dimensions
} from 'react-native';

import {
    Button,
    Flex,
    Toast,
    ImagePicker,
} from 'antd-mobile';

import messageManager from '../data_server/MessageManager';

export default class PostMessageScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        title:'发送消息',
    });

    constructor(props) {
      super(props)

      this.state = {
         content:'',
         images:[]
      }
    }

    onChange = (images, type, index) => {
        console.log(images, type, index);
        this.setState({
          images,
        });
    }


    render() {

        const { images } = this.state;

        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    underlineColorAndroid="transparent"
                    multiline = {true}
                    onChangeText={(content) => this.setState({content})}
                    value={this.state.content}
                />
                <View style={styles.imagePickerContainer}>
                    <ImagePicker
                        files={images}
                        onChange={this.onChange}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={images.length < 9}
                    />
                </View>
                <Button
                    style={styles.button}
                    type='primary'
                    onClick={async()=>{
                        Toast.loading('发送中...', 0);
                        const result = await messageManager.postMessage(this.state);
                        Toast.hide()
                        if(result.state){
                            Toast.success('发送成功', 1, ()=>{
                                this.props.navigation.goBack();
                            });
                        } else {
                            Toast.fail(result.message, 1)
                        }
                    }}
                >发送</Button>
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
        height:44*3,
        width:Dimensions.get('window').width-20,
        margin:10,
        padding: 0,
        fontSize:16,

    },
    button:{
        height: 44,
        width:Dimensions.get('window').width-20,
        margin:10,
    },
    imagePickerContainer:{
        margin:10,
        width:Dimensions.get('window').width-20,
    }
})
