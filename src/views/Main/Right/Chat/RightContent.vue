<template>
  <div id="content" class="wrap list-wrap">
    <info-block
      :visible="isShowChatterInfo"
      :memberInfo="chatterInfo"
      :infoPosition="infoPosition"
      :canChat= true
    ></info-block>
    <div class="no-chat-wrap" v-if="isNoChat">
      <i class="icon icon-logo"></i>
      <div class="no-chat-text">未选择聊天</div>
    </div>
    <div v-else>
      <div class="no-new-message" v-if="isNoMessage">暂时没有新消息</div>
      <div v-else>
        <div v-for="(msg, index) in messages" :key="'msg' + index">
          <p v-if="msg.type === 'notice'" class="msg-notice">{{ msg.msg }}</p>
          <div  class="msg-chat">
            <p class="msg-notice msg-time" v-if="isShowTime(index)">
              {{ time(msg.sendTime) }}
            </p>
            <div class="msg-main-right" v-if="isMyself(msg.sendId)">
              <div class="msg-right-wrap isuser">
                <pre 
                  class="msg-ctn"
                  v-html="msg.msg"
                ></pre>
              </div>
              <img
                :src="msg.headImgUrl"
                class="msg-avatar msg-avatar-right"
                @click.stop="handleShowChatterInfo($event, index)"
              />
            </div>
            <div class="msg-main" v-else>
              <img
                :src="msg.headImgUrl"
                class="msg-avatar"
                @click.stop="handleShowChatterInfo($event, index)"
                ref="fff"
              />
              <div class="msg-right-wrap">
                <!-- <div class="msg-nickname">{{ msg.nickname }}</div> -->
                <pre class="msg-ctn" v-html="msg.msg"></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/components/common/bus";
import InfoBlock from "@/components/InfoBlock";
import headImgUrl from "@/assets/images/user01.png";
// import $ from 'jquery';

export default {
  name: "RightContent",
  components: {
    InfoBlock
  },
  data() {
    return {
      infoPosition: {
        left: -1,
        top: -1
      },
      chatterInfoIndex: -1,
      
    };
  },
  created(){
    let _this = this;
    //点对点聊天推送
    bus.$on('chatPtop',function(res){ 
      console.log(res)
      let id = res.data.sendId;
      _this.$store.state.chatList.forEach(chat => {
        if(chat.id == id && chat.type === 'friend'){
          chat.messages.push({...res.data,sendTime:res.sendTime,msgId:res.msgId})
        }
      })
      
    })
    // 点对群聊天推送
    bus.$on( 'chatPtog', function(res){
      console.log(res)
      let groupId = res.data.group.id;
      _this.$store.state.chatList.forEach(chat => {
        if(chat.id == groupId && chat.type === 'group'){
          chat.messages.push({
            ...res.data.group,
            headImgUrl: res.data.sendUser.headImgUrl,
            msg: res.data.msg,
            sendId:res.data.sendId,
            sendTime: res.sendTime,
            msgId: res.msgId,
            type: res.data.type
          })
        }
      })
    })
  },
  computed: {
    isNoChat() {
      return this.$store.state.currentChatId === -1;
    },
    isNoMessage() {
      const currentChatId = this.$store.state.currentChatId;
      let chatMessagesLength;
      this.$store.state.chats.forEach(chat => {
        if (chat.chatId === currentChatId) {
          chatMessagesLength = (chat.messages.length === 0)
        }
      });
      return chatMessagesLength

    },
    messages() {
      const currentChatId = this.$store.state.currentChatId;
      let chatMessages;
      this.$store.state.chatList.forEach( chat => {
        if (chat.id === currentChatId) {
          chatMessages = chat.messages;
        }
      })
      return chatMessages
    },
    isShowChatterInfo() {
      return this.$store.state.isShowChatterInfo;
    },
    chatterInfo() {
      return {
        id: "p1",
        type: "A",
        nickname: "用户一",
        gender: "",
        alias: "",
        region: "这是地区",
        headImgUrl
      };
    }
  },
  methods: {
    isShowTime(index) {
      const messages = this.messages;

      if (index === 0) {
        return true;
      }

      return messages[index].time - messages[index - 1].time >= 120000;
    },
    isMyself(sender) {
      return this.$store.state.myself.id === sender;
    },
    time(date) {
      const d = new Date(date);
      const h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      const m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      return `${h}:${m}`;
    },
    handleShowChatterInfo(event, index) {
      const { clientX: x, clientY: y } = event;
      this.infoPosition.top = y;
      this.infoPosition.left = x;
      this.chatterInfoIndex = index;
      this.$store.commit("setChatterInfo", true);
    }
  }
};
</script>

<style lang="less" scoped>
.wrap {
  flex-grow: 1;
  padding: 0 19px;
  min-height: 369px;
  max-height: calc(100vh - 211px);
  overflow: auto;
  // position: relative;
}

.item {
  height: 80px;
  background-color: red;
}

.list-wrap {
  overflow: auto;
}

.list-wrap::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  /*background-color: #2e3238;*/
  background-color: #eee;
  border-radius: 10px;
}

.list-wrap::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #c3c3c3;
}

.no-chat-wrap {
  margin-top: 130px;
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.icon {
  display: block;
  background: url("../../../../assets/images/opt-but.png") no-repeat;
  background-size: 487px 462px;
}

.icon-logo {
  width: 100px;
  height: 90px;
  background-position: -96px -150px;
}

.no-chat-text {
  height: 20px;
  color: #ccc;
  font-size: 13px;
}

.no-new-message {
  height: 20px;
  margin-top: 130px;
  color: #ccc;
  font-size: 13px;
  text-align: center;
}

.msg-notice {
  max-width: 50%;
  text-align: center;
  margin: 10px auto;
  line-height: 25px;
  color: #b2b2b2;
  font-size: 12px;
}

.msg-chat {
  margin-bottom: 16px;
}

.msg-main {
  display: flex;
}

.msg-main-right {
  display: flex;
  justify-content: flex-end;
}

.msg-time {
  padding-top: 16px;
}

.msg-avatar {
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 2px;
}

.msg-avatar-right {
  margin-right: 0;
  margin-left: 10px;
}

.msg-right-wrap {
  display: flex;
  flex-direction: column;
  pre {
    max-width: 250px;
    border-radius:0px 10px 10px 10px;
    background-color: #f4f5fa;
  }
}
.isuser {
  pre {
    max-width: 250px;
    border-radius:10px 0px 10px 10px;
    background-color: #d9f7ff;
  }
}

.msg-nickname {
  color: #4f4f4f;
  font-size: 12px;
  height: 22px;
  line-height: 22px;
}

.msg-ctn {
  max-width: 474px;
  background-color: #fff;
  padding: 9px 13px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 22.4px;
  color: #000;
  word-break: normal;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  margin: 0;
}
</style>
