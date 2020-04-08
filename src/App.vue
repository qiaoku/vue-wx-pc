<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  height:100%;
}

</style>
<script>
import bus from "@/components/common/bus";
export default {
  data() {
    return {
      
      websock: null
    };
  },
  created() {
    this.initWebSocket();
  },
   methods: {
    // 获取websocket api 地址
    getWebsocketApi() {
      this.initWebSocket();
    },
    initWebSocket() {
      let wsUrl = "ws://101.37.116.134:5555/ws";
      //  let wsUrl = "ws://192.168.0.169:5555/ws";
      this.websock = new WebSocket(wsUrl);
      this.websock.onopen = this.websoketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketonclose;
    },
    //连接成功
    websoketonopen() {
      let loginData = {
        token: localStorage.getItem("TOKEN"),
        plat: "WEB"
      };
      this.websocketSend(loginData);
    },
    // 连接建立失败重连
    websocketonerror() {
      this.getWebsocketApi();
    },
    // 发送数据
    websocketSend(e) {
      this.websock.send(JSON.stringify(e));
    },
    websocketonmessage(res) {
      const resdata = JSON.parse(res.data);
      console.log(resdata);
      if (resdata) {
        switch (resdata.action) {
          // 第一次（或重连初始化并获取用户未读消息）
          case "LOGIN_REPLY":
            console.log("websocket连接成功了");
            break;
          // 添加好友请求
          case "ADD_FRIEND":
            console.log("添加好友请求");
            bus.$emit("addFriend", resdata);
            break;
          // 好友请求回应推送
          case "USER_ADD_FRIEND_REPLY":
            console.log("好友请求回应推送");
            bus.$emit("addFriendReply", resdata);
            break;
          //点对群聊天推送
          case "CHAT_PTOG":
            bus.$emit("chatPtog", resdata);
            break;
          //点对群聊天推送--多端在线，消息同步
          case "CHAT_PTOG_SYN":
            bus.$emit("chatPtogSyn", resdata);
            break;
          // 点对点聊天推送
          case "CHAT_PTOP":
            bus.$emit("chatPtop", resdata);
            break;
          // 点对点聊天，发送方多端在线，其他端消息同步
          case "CHAT_PTOP_SYN":
            console.log(resdata + '$$$$$$')
            bus.$emit("chatPtopSyn", resdata);
            break;
          //被群主踢出群聊推送--被T的那个人收到推送
          case "USER_GROUP_NOTICE":
            bus.$emit("userGroupNotice", resdata);
            break;
          //入群申请消息
          case "USER_GROUP_ASK_IN":
            bus.$emit("userGroupAskIn", resdata);
            break;
          //入群申请审核通知
          case "USER_GROUP_ASK_IN_REPLY":
            bus.$emit("userGroupAskInReply", resdata);
            break;
          //群主踢人出群聊--其他群成员收到推送--静默删除被T那个人的客户端再该群的数据
          case "USER_GROUP_DELETE_NOTICE_OTHER":
            bus.$emit("userGroupDelete", resdata);
            break;
        }
      }
    },
    // 关闭连接
    websocketonclose() {
      if (this.websock) {
        this.websock.close();
        this.websock = null;
      }
    }
  }
}
</script>
