import React, { Component } from 'react'
import {
    Text,
    View,
    FlatList,
 } from 'react-native';

import {
    SearchBar,
    Toast,
} from 'antd-mobile';

import friendMessage from '../data_server/FriendManager';

import FriendItem from '../view_component/FriendItem';

export default class FindFriendScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        title:'搜索好友',
    });

    constructor(props) {
      super(props)

      this.state = {
         nickname:'',
         friends:[],
      }
    }

    _separator = () => {
        return <View style={{ height: 2, backgroundColor: '#f5f5f5' }}/>;
    }
    _ListEmptyComponent = ()=>{
      return <View><Text style={{textAlign:'center'}}> 列表为空</Text></View>;
    }
    render() {
        return (
        <View>
            <SearchBar
                placeholder="输入好友昵称"
                value={this.state.nickname}
                onChange={(nickname)=>this.setState({nickname})}
                onCancel={()=>{
                    console.log('onCancel');
                    this.setState({nickname:''})
                }}
                onSubmit={()=>{
                    console.log('onSubmit');
                    console.log(this.state.nickname);
                    friendMessage.findFriend(this.state.nickname)
                    .then((result)=>{
                        if (result.state) {
                            this.setState({friends:result.data});
                        } else {
                            console.log(result.message);
                        }

                    })
                }}
            />
            <FlatList
                data={this.state.friends}
                ListEmptyComponent= {this._ListEmptyComponent}
                renderItem={({item,index})=>{
                    return (
                        <FriendItem
                            {...item}
                            tapItem={async(user)=>{
                                console.log(user);
                                Toast.loading('操作中', 0);
                                const result = await friendMessage.followFriend(user.id);
                                Toast.hide();
                                if (result.state) {
                                    Toast.success('关注好友成功', 2);
                                } else {
                                    Toast.fail(result.message, 2);
                                }
                            }}
                        />
                    );
                }}
                keyExtractor={(user,index)=>{
                    return user.id;
                }}
            />
        </View>
        )
    }
}
