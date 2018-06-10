import React,{Component} from 'react';
import {
    Text,
    View,
    Button,
    Image,
    FlatList,
    Alert,
    StyleSheet,
    Dimensions
} from 'react-native'
import {
    Toast,
    Card
} from 'antd-mobile';
import PubSub from 'pubsub-js';

import FriendItem from '../view_component/FriendItem';

import friendManager from '../data_server/FriendManager';

export default class FriendScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        title:'好友',
        headerLeft:null,
        headerRight:(
            <Button
                title="加好友"
                onPress={()=>{
                    PubSub.publish('add-friend');
                }}
            />
        ),
        tabBarIcon: ({ focused }) => (
            <Image
              source={focused?require('../images/icon3.png'):require('../images/icon2.png')}
              style={{width:28,height:28}}
            />
        )
    });

    constructor(props) {
      super(props)

      this.state = {
         friends:[],
         refreshing:false,
      }
    }


    loadFriends(){
        friendManager.getFriend()
        .then((result)=>{
            Toast.hide();
            this.setState({refreshing:false});
            if (result.state == true ) {
                this.setState({friends:result.data});
            } else {
                Toast.fail(result.message,2);
            }
        })
        .catch((error) => {
          Toast.hide();
        });
    }

    componentDidMount(){

        console.log('aaa');
        PubSub.subscribe( 'add-friend',()=>{
            this.props.navigation.navigate('FindFriendScreen');
        });

        Toast.loading('加载中', 0,true);
        this.loadFriends();

    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.friends}
                    refreshing={this.state.refreshing}
                    onRefresh={async()=>{
                        this.setState({refreshing:true});
                        this.loadFriends();
                    }}
                    renderItem={({item,index})=>{
                        return (
                            <FriendItem
                                {...item}
                                tapItem={async(user)=>{
                                  Alert.alert(
                                    '警告',
                                    "确认删除好友？",
                                    [
                                      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                      {text: 'OK', onPress: async(user)=>{
                                          console.log(user);
                                          const userId = user.friendship.followedId;
                                          console.log(userId);
                                          await friendManager.deleteFriend(userId);
                                        }
                                      },
                                    ],
                                    { cancelable: false }
                                  )


                                }}
                            />
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
  })
