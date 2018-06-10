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

        Toast.loading('加载中', 0,()=>{},false);
        friendManager.setFrirndManagerListener((result)=>{
            if(result.state){
                this.setState({friends:result.data});
            } else {
                Toast.fail(result.message,1);
            }
        })


        this.loadFriends();

    }
    _separator = () => {
        return <View style={{ height: 2, backgroundColor: '#f5f5f5' }}/>;
    }
    _ListEmptyComponent = ()=>{
      return <View style={styles.container}><Image
          style={styles.image}
          source={require('../images/sorry.png')}
      /><View style={styles.text}><Text >好友列表为空</Text></View></View>;
    }

    render() {
        return (
                <FlatList
                    data={this.state.friends}
                    ItemSeparatorComponent={this._separator}
                    ListEmptyComponent={this._ListEmptyComponent}
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
                                      '确认删除好友吗？',
                                      [
                                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                                        {text: 'OK', onPress: async() => {
                                          const userId = user.friendship.followedId;
                                          console.log(userId);
                                          Toast.loading('操作中', 0);
                                          const result = await friendManager.deleteFriend(userId);
                                          Toast.hide();
                                          if (result.state) {
                                              Toast.success('删除好友成功', 2);
                                          } else {
                                              Toast.fail(result.message, 2);
                                          }
                                          this.loadFriends();
                                        }},
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
    image:{

      justifyContent:'flex-start',
      alignItems:'center',
      height:100,
      width:Dimensions.get('window').width,
      margin:10,
      resizeMode:'contain',
    },
    text:{
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
    },
  })
