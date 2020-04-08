import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// import headImgUrl from "@/assets/images/default.png";
// import group from "@/assets/images/default_group.png";
// import addGroupChat from "@/assets/images/addGroupChat.png"

import { apiGetUserInfoById, apiFriendList,
        apiGroupGetGroupById,
        apiChatSentMsgPTP,apiChatSentMsgPTG,
        apiConversationList} from '@/api/api.js'
import { pinyin } from "@/assets/js/pinyin";

const store = new Vuex.Store({
  state: {
    token: "",
    isShowExpression: false,
    isShowMembers: false,
    isShowMemberInfo: false,
    isShowMyInfo: false,
    isShowChatterInfo: false,
    memberOrChat:'',
    isShowSearch: false,
    isShowFeedback: false,
    isShowGroupchat:false,
    // 当前聊天人数
    chatCount: 0,
    currentTabIndex: 0,
    currentRight: 0,
    currentLinkman: 0,
    myself: {},
    chats: [
    ],
    linkmans: [
    ],
    friend:[],
    group:[],
    mailList:[],
    chatList: [],//会话列表
    currentChatId: -1,
    currentChatType: '',
    currentChatMsg:[],
    isfriend: '',
  },
  mutations: {
    serIsFriend(state,isfriend){
      state.isfriend = isfriend;
    },
    setExpression(state, isShowExpression) {
      if (isShowExpression) {
        state.isShowMembers = false;
        state.isShowMemberInfo = false;
        state.isShowMyInfo = false;
        state.isShowChatterInfo = false;
      }
      state.isShowExpression = isShowExpression;
    },
    setMembers(state, isShowMembers) {
      if (isShowMembers) {
        state.isShowExpression = false;
        state.isShowMyInfo = false;
        state.isShowChatterInfo = false;
      }
      state.isShowMembers = isShowMembers;
    },
    setMemberInfo(state, isShowMemberInfo) {
      state.memberOrChat = 'member',
      state.isShowMemberInfo = isShowMemberInfo;
    },
    setChatterInfo(state, isShowChatterInfo) {
      if (isShowChatterInfo) {
        // state.isShowMembers = false;
        state.isShowMemberInfo = false;
        state.isShowExpression = false;
        state.isShowMyInfo = false;
        state.isShowChatterInfo = false;
      }
      state.memberOrChat = 'chat',
      state.isShowChatterInfo = isShowChatterInfo;
    },
    setMyInfo(state, isShowMyInfo) {
      if (isShowMyInfo) {
        state.isShowMembers = false;
        state.isShowMemberInfo = false;
        state.isShowExpression = false;
        state.isShowChatterInfo = false;
      }
      state.isShowMyInfo = isShowMyInfo;
    },
    setFeedback(state,isShowFeedback){
      if (isShowFeedback) {
        state.isShowMembers = false;
        state.isShowMemberInfo = false;
        state.isShowExpression = false;
        state.isShowChatterInfo = false;
        // state.isShowMyInfo = false;
      }
      state.isShowFeedback = isShowFeedback;
    },
    setGroupChat(state,isShowGroupchat){
      if (isShowGroupchat) {
        // state.isShowMembers = false;
        state.isShowMemberInfo = false;
        state.isShowExpression = false;
        state.isShowChatterInfo = false;
        // state.isShowMyInfo = false;
      }
      state.isShowGroupchat = isShowGroupchat;
    },
    setCurrentTab(state, tabIndex) {
      state.currentTabIndex = tabIndex;
    },
    setCurrentRight(state, rightIndex) {
      state.currentRight = rightIndex;
    },
    setCurrentLinkman(state, index) {
      state.currentLinkman = index;
    },
    hideAll(state) {
      state.isShowMembers = false;
      state.isShowMemberInfo = false;
      state.isShowExpression = false;
      state.isShowChatterInfo = false;
      state.isShowMyInfo = false;
      state.isShowSearch = false;
    },
    setChatId(state, data) {
      state.currentChatId = data.id;
      state.currentChatType = data.type;
      state.currentRight = 0;
    },
    setChatMsg(state,data){
      state.currentRight = 0;
      state.currentChatMsg = data.chat;
    },
    setSearch(state, isShowSearch) {
      state.isShowSearch = isShowSearch;
    },
    sendMessage(state, msg) {
      state.chatList.forEach( (chat,index) => {
        if (chat.id === state.currentChatId) {
          //    console.log(msg)
             let currentChatType = state.currentChatType;
             console.log(currentChatType)
             if(currentChatType === 'friend'){
              apiChatSentMsgPTP({
                receiverId : msg.receiverId ,
                msg: msg.msg,
                type: msg.type,
                signId: msg.signId 
              })
              .then( res => {
                if(res.status === 200){
                 state.chatList[index].messages.push({...res.data,headImgUrl:state.myself.headImgUrl})
                  // chat.messages = '5'
                  console.log( state.chatList)
                 
                }else if(res.status === 302){
                  this.$message.error(res.msg);
                }
              })
              .catch( err => {
                console.log( err )
              })
             }else if(currentChatType === 'group'){
              apiChatSentMsgPTG({
                groupId : msg.receiverId ,
                msg: msg.msg,
                type: msg.type,
                signId: msg.signId 
              })
              .then( res => {
                if(res.status === 200){
                 state.chatList[index].messages.push({...res.data,headImgUrl:state.myself.headImgUrl})
                  // chat.messages = '5'
                  console.log( state.chatList)
                 
                }else if(res.status === 302){
                  this.$message.error(res.msg);
                }
              })
              .catch( err => {
                console.log( err )
              })
             }
            }
      })
    },
    addChat(state,data) {
      state.currentTabIndex = 0;
      state.currentRight = 0;
      console.log(data)
      // 群
      if(data.type == 'group'){
        state.chatList.forEach((item,index) => {
          if(item.id === state.mailList[data.i].linkmans[data.j].id && item.type === 'group'){
            state.chatList.splice(index,1)
          }
        })
        state.chatList.push({...state.mailList[data.i].linkmans[data.j],type:'group', messages: []});
        state.currentChatType = 'group';
        state.currentChatId = state.mailList[data.i].linkmans[data.j].id ;
      // 好友
      }else if(data.type == 'friend'){
        state.chatList.forEach((item,index) => {
          if(item.id === state.mailList[data.i].linkmans[data.j].id && item.type === 'friend'){
            state.chatList.splice(index,1)
          }
        })
        state.chatList.push({...state.mailList[data.i].linkmans[data.j],type:'friend', messages: []})
        state.currentChatType = 'friend';
        state.currentChatId = state.mailList[data.i].linkmans[data.j].id ;
      }
      // 当前聊天人数
      state.chatCount += 1;
      
    },
    getMyself(state,myselfData){
      state.myself = myselfData;
    },
    getFriendList(state,friendList) {
      state.friend = friendList;
    },
    getGroupList(state,groupList) {
      state.group = groupList;
    },
    getMailList(state) {
      
      let group = state.group;
      let friend = state.friend;
      let kinds = [];
      let kindCount = -1;
      let currentType = "";
      
      friend.forEach(friendItem => {
        friendItem.initial = pinyin
          .getFullChars(friendItem.nickName)
          .toUpperCase()
          .substr(0, 1);

        if (friendItem.initial !== currentType) {
          kinds.push({
            title: friendItem.initial,
            linkmans: []
          });
          currentType = friendItem.initial;
          kindCount += 1;
        }

        kinds[kindCount].linkmans.push({ ...friendItem });
      });
        kinds.sort(function(a,b){
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        })
          kinds.unshift({
            type: "group",
            title: "群组",
            linkmans: group
          });
      state.mailList = kinds;
    },
    getChatList(state,getChatList){
      // state.chatList = chatList;
      getChatList.forEach((getChat,index) => {
        // console.log(getChat,index)
        if(getChat.type === "PTP"){ 
          console.log(getChat,index)
          state.chatList.push({...getChat,type:'friend',id:getChat.receiverId,messages:[JSON.parse(getChat.lastMsg)]})
        }else if(getChat.type === "PTG"){
          state.chatList.push({...getChat,type:'group',id:getChat.receiverId,messages:[JSON.parse(getChat.lastMsg)]})
        }
      })
    }
  },
  actions: {
    // 获取用户信息
    fetchMyself( {commit}) {
      apiGetUserInfoById({
        id: 8
      })
      .then (res => {
        if(res.status === 200){
          commit('getMyself',res.data)
        }else if(res.status === 302){
          this.$message.error(res.msg);
        }
      })
      .catch (res => {
        console.log(res)
      })
    },
    //获取好友列表
    fetchFriendList( {commit}) {
      apiFriendList({
      })
      .then (res => {
        if(res.status === 200){
          commit('getFriendList',res.data)
        }else if(res.status === 302){
          this.$message.error(res.msg);
        }
      })
      .catch (res => {
        console.log(res)
      })
    },
    //获取用户所有群
    fetchGroupGetGroupList({commit}) {
      apiGroupGetGroupById({

      })
      .then( res => {
        if(res.status === 200){
          commit('getGroupList',res.data)
        }else if(res.status === 302){
          this.$message.error(res.msg);
        }
      })
      .catch( err => {
        console.log( err )
      })
    },
    // 获取会话列表
    fetchConversationList( {commit}) {
      apiConversationList({

      })
      .then( res => {
        if(res.status === 200){
          console.log(res.data)
          commit('getChatList',res.data)
        }else if(res.status === 302){
          this.$message.error(res.msg);
        }
      })
      .catch (err => {
        console.log( err)
      })
    }
  }
});

export default store;
