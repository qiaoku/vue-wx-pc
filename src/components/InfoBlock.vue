<template>
  <div
    class="member-info-wrap dialog"
    v-if="visible"
    :style="{ top: infoPosition.top + 'px', left: infoPosition.left + 'px' }"
    @click.stop=""
  >
    <div class="dialog-header">
      <div class="dialog-btn-cancle">
        <img @click="handleHideMemberInfo" src="@/assets/images/close.png" alt />
      </div>
    </div>
    <div class="dialog-main">
      <div class="top">
        <div class="dialog-avatar">
          <img :src="memberInfo.headImgUrl" alt />
        </div>
        <div class="dialog-nickname">{{memberInfo.nickName}}</div>
      </div>
      <div class="middle">
        <div v-if="canChat">
          <span>备注</span>
          <input type="text" placeholder="请添加备注" />
        </div>
        <div>
          <span>起点ID</span>
          <span>{{memberInfo.qdId}}</span>
        </div>
        <div>
          <span>地区</span>
          <span>{{memberInfo.city }}</span>
        </div>
      </div>
      <div class="footer">
        <button v-if="canChat" @click="handleChangeChat(memberInfo)"  class="active-btn-fillet">发送消息</button>
        <button v-else  class="active-btn-fillet">添加好友</button>
      </div>
    </div>
    
  </div>
</template>

<script>
// import avatar from "@/assets/default.png";

export default {
  name: "MemberInfo",
  props: ["visible", "memberInfo", "infoPosition", "canChat"],
  methods: {
    newChat() {
      this.$store.commit(
        "addChat",
        this.$store.state.linkmans.indexOf(this.memberInfo)
      );
      this.$store.commit("hideAll");
    },
    handleHideMemberInfo(){
      if(this.$store.state.memberOrChat === 'member'){
         this.$store.commit("setMemberInfo", false);
      }else if(this.$store.state.memberOrChat === 'chat'){
        this.$store.commit("setChatterInfo", false);
      }
    },
    handleChangeChat(data){
      console.log(data)
      this.$store.commit("setMemberInfo", false);
       this.$store.commit("setMembers", false);
      this.$store.state.chatList.forEach((item,index) => {
        if(item.id === data.userId && item.type === 'friend'){
           this.$store.state.chatList.splice(index,1);
        }
      });
      let chat ='';
      this.$store.state.friend.forEach(friend => {
        if(data.userId === friend.id){
          chat = friend;
        }
      });
       this.$store.state.chatList.push({...chat,type:'friend', messages: []})
       this.$store.state.currentChatType = 'friend';
       this.$store.state.currentChatId = data.userId ;
    }
  }
};
</script>

<style lang="less" scoped>
.icon {
  display: block;
   background: url(../assets/images/opt-but.png) no-repeat; 
  background-size: 487px 462px;
}

.member-info-wrap {
  position: absolute;
  width: 252px;
  // height: 398px;
  z-index: 11;
  visibility: visible;
  .dialog-header {
    height: 18px;
    width: 100%;
    position: relative;
    .dialog-btn-cancle {
      width: 8px;
      height: 8px;
      position: absolute;
      right: 0px;
      img {
        width: 8px;
        height: 8px;
        cursor: pointer;
      }
    }
  }
  .dialog-main {
    text-align: center;
    .top {
      .dialog-avatar {
        margin: 0 auto;
        width: 113px;
        height: 113px;
        img {
          width: 113px;
          height: 113px;
          border-radius: 50%;
        }
      }
      .dialog-nickname {
        color: #363e47;
        margin-top: 13px;
      }
    }
    .middle {
      margin-top: 70px;
      div {
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        padding: 8px;
        span:first-child {
          color: #c9c9c9;
        }
        span:last-child {
          color: #333333;
        }
      }
    }
    .footer {
      margin-top: 30px;
      button {
        width: 193px;
      }
      .normal-btn-fillet {
        margin-bottom: 10px;
      }
      .edition {
        font-size: 12px;
        color: #999;
        margin-top: 15px;
      }
    }
  }
}

.member-info-wrap-hidden {
  visibility: hidden;
}
</style>
