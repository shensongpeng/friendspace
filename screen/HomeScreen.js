import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Button,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';

import {
    Flex,
    Toast,
    ImagePicker,
} from 'antd-mobile';

import HomeMessageItem from '../view_component/HomeMessageItem';

import PubSub from 'pubsub-js';

import messageManager from '../data_server/MessageManager';

export default class HomeScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        title:'朋友圈',
        headerLeft:(
            <Button
                title="扫一扫"
                onPress={()=>{
                    PubSub.publish('qrcode');
                }}
            />
        ),
        headerRight:(
            <Button
                title="发消息"
                onPress={()=>{
                    PubSub.publish('send-message');
                }}
            />
        ),
        tabBarIcon: ({ focused }) => (
            <Image
              source={focused?require('../images/icon1.png'):require('../images/icon.png')}
              style={{width:28,height:28}}
            />
        )
    });

    constructor(props) {
      super(props)

      this.state = {
         messages:[],
         refreshing:false,
         isLoadingMore:false,
      }
    }

    componentDidMount(){
        Toast.hide();
        PubSub.subscribe( 'send-message',()=>{
            this.props.navigation.navigate('PostMessageScreen');
        });
        PubSub.subscribe( 'qrcode',()=>{
            this.props.navigation.navigate('BarcodeScannerExample');
        });
        Toast.loading('加载中', 0);
        messageManager.setMessageManagerListener((result)=>{
            if(result.state){
                this.setState({messages:result.data});
            } else {
                Toast.fail(result.message,1);
            }
        })

        messageManager.getHomeMessages()
        .then(()=>{
            Toast.hide();
        })
        Toast.hide();
    }
    _header = () => {
    return <Text style={[styles.txt, { backgroundColor: 'black' }]}>这是头部</Text>;
    }

    _footer = () => {
        return <Text style={[styles.txt, { backgroundColor: 'black' }]}>这是尾部</Text>;
    }
    _separator = () => {
        return <View style={{ height: 2, backgroundColor: '#f5f5f5' }}/>;
    }
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.messages}
                    ItemSeparatorComponent={this._separator}
                    refreshing={this.state.refreshing}
                    onRefresh={async()=>{
                        this.setState({refreshing:true});
                        await messageManager.getHomeMessages();
                        this.setState({refreshing:false});
                    }}
                    renderItem={({item,index })=>{
                        return (
                            <HomeMessageItem {...item} />
                        );
                    }}
                    keyExtractor={(message,index)=>{
                        return message.id;
                    }}
                />
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
    txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
    },
  })
