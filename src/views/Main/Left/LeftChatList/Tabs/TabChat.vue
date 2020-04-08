<template>
  <div class="left-chat-list-tab-wrap">
    <div
      v-for="(chat, index) in chatList"
      :key="'chat' + index"
      class="chat-wrap"
      :class="{
        'chat-wrap-selected': currentChatIndex == index
      }"
      @click="handleChangeChat(chat,index)"
    >
      <div class="chat-avatar">
        <img :src="chat.headImgUrl" />
      </div>
      <div class="chat-msg">
        <div class="chat-msg-nickname">{{ chat.nickName }}</div>
      </div>
      <div class="chat-info">
        <div class="chat-info-icon-wrap" >
          <!-- <span :class="{'new-msg-count':true,'over-news': chat.newMsgCount > 99}" v-if="!chat.read">{{chat.newMsgCount > 99 ? '99+' : chat.newMsgCount }}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import headImgUrl from "@/assets/images/default.png"

export default {
  name: "TabChat",
  data() {
    return {};
  },
  created(){
    // this.$store.dispatch('fetchFriendList')
  },
  computed: {
    // chats() {
    //   const linkmans = this.$store.state.linkmans;
    //   return this.$store.state.friend
    //     .map(chat => {
    //       return {
    //         ...chat,
    //         ...linkmans[chat.linkmanIndex],
    //         message: null
    //       };
    //     })
    //     .sort(a => {
    //       return a.isOnTop ? -1 : 0;
    //     });
    // },
    chatList(){
      const chatList = this.$store.state.chatList;
      return chatList
    },
    currentChatIndex() {
      let index;
      if(this.chatList.length > 0){
        this.chatList.forEach((chat,i) => {
        if(chat.id === this.$store.state.currentChatId){
           index = i;
        }
      });
      }
      return index;
    }
  },
  methods: {
    handleChangeChat(chat,index) {
      this.$store.commit("setChatId", {
        id: this.chatList[index].id,
        type: this.chatList[index].type
      });
    },
    getTime(time) {
      const d = time;
      const h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      const m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      return `${h}:${m}`;
    }
  }
};
</script>

<style lang="less" scoped>
.new-msg-count {
    z-index: 2;
    width: auto;
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    font-size: 12px;
    background-color: #f43531;
}
.over-news{
  border-radius: 9px;
  min-width: 32px;
}
.list-title {
  color: #787b87;
  padding: 2px 18px;
  font-size: 14px;
  height: 24px;
}

.chat-wrap {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  font-size: 13px;
  cursor: pointer;
  color: #989898;
  user-select: none;
}

.chat-wrap-top {
  background-color: #2e3641;
}

.chat-wrap-selected {
  background-color: #404953;
  color: #fff;
}

.chat-avatar {
  margin-right: 13px;
  width: 38px;
  height: 38px;
  img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    cursor: pointer;
  }
}

.chat-msg {
  flex-grow: 1;
}

.chat-msg-nickname {
  color: #fff;
  height: 20px;
}

.chat-msg-message {
  user-select: none;
  overflow-wrap: normal;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 161px;
  height: 20px;
  margin: 0;
}

.chat-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat-info-time {
  color: #6b6f7c;
  user-select: none;
}

.chat-info-icon-wrap {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.icon {
  width: 20px;
  height: 20px;
  background: url(../../../../../assets/images/opt-but.png) no-repeat;
  background-size: 487px 462px;
}

.icon-mute-light {
  background-position: -311px -432px;
}

.icon-mute-dark {
  background-position: -401px -357px;
}
</style>
