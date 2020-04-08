<template>
  <div style="height: 73px;">
    <div class="wrap">
      <info-block
        :visible="isShowMemberInfo"
        :memberInfo="chatterInfo"
        :infoPosition="infoPosition"
        :canChat="canChat"
      ></info-block>
      <div class="info-wrap">
        <div class="info-pack" :style="{ visibility: isNoChat ? 'hidden' : 'visible' }">
          <div class="info-nickname">{{ nickname }}</div>
          <div class="info-icon-wrap">
            <img @click.stop="handleShowMembers" src="@/assets/images/icon-persons.png" alt />
          </div>
        </div>
      </div>

      <div
        class="members-wrap list-wrap"
        :class="{ 'members-wrap-hidden': !isShowMembers }"
        :style="{position:'absolute',left:position.left,top:position.top}"
        @click.stop="handleHideMemberInfo"
      >
        <div class="members-detail-wrap">
          <div class="member-wrap" @click="handleShowGroupChat">
            <!-- <i class="icon-add-friends"></i> -->
            <img class="member-avatar" src="@/assets/images/icon-add-friends.png" alt />
            <div class="member-nickname txt-ellipsis">添加</div>
          </div>
          <div class="member-wrap" v-for="(member, index) in members" :key="'member' + index">
            <img
              class="member-avatar"
              :src="member.headImgUrl"
              @click.stop="handleShowMemberInfo($event,member, index)"
            />
            <div class="member-nickname txt-ellipsis">{{member.nickName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/components/common/bus";
// import headImgUrl from "@/assets/images/default.png";
import InfoBlock from "@/components/InfoBlock";
import { apiUserSearch } from "@/api/api.js";

function getLinkman(ctx) {
  const state = ctx.$store.state;
  let currentChatId = state.currentChatId;
  if (currentChatId === -1) {
    return null;
  }
  let currentChatType = state.currentChatType;
  if (currentChatType === "friend") {
    for (let friend of state.friend) {
      if (friend.id === currentChatId) {
        return friend;
      }
    }
  } else if (currentChatType === "group") {
    for (let group of state.group) {
      if (group.id === currentChatId) {
        return group;
      }
    }
  }
}

export default {
  name: "RightHeader",

  components: {
    InfoBlock
  },
  data() {
    return {
      newFriend: true,
      isHidden: false,
      memberInfoIndex: -1,
      infoPosition: {
        left: -1,
        top: -1
      },
      position: { left: 0, right: 0 },
      canChat:'',
      chatterInfo:''
    };
  },
  created() {
    this.position = JSON.parse(localStorage.getItem("position"));
    bus.$on("onresize", () => {
      this.position = JSON.parse(localStorage.getItem("position"));
    });
  },
  computed: {
    isShowMembers() {
      return this.$store.state.isShowMembers;
    },
    isShowGroupchat() {
      return this.$store.state.isShowGroupchat;
    },
    isShowMemberInfo() {
      return this.$store.state.isShowMemberInfo;
    },
    isNoChat() {
      return this.$store.state.currentChatId === -1;
    },
    // 获取昵称
    nickname() {
      const linkman = getLinkman(this);
      if (linkman === null) {
        return "";
      }
      // console.log(linkman.nickName);
      return linkman.nickName;
    },
    members() {
      const linkman = getLinkman(this);
      console.log(linkman);
      let members = [];
      if (linkman === null) {
        return [];
      }
      // if (linkman.type !== "group") {
      //   return [linkman];
      // }
      // if (linkman.type == "group") {
      //   members = linkman.members;
      // }
      if (this.$store.state.currentChatType === "friend") {
        console.log([linkman]);
        return [linkman];
      } else if (this.$store.state.currentChatType === "group") {
        members = linkman.members;
      }
      console.log(members);
      return members;
    },
    memberInfo() {
      const linkman = getLinkman(this);
      if (!linkman) {
        return {};
      }
      if (linkman.type !== "group") {
        return linkman;
      }
      return this.members[this.memberInfoIndex];
    },
    
    isShowChatterInfo() {
      return this.$store.state.isShowChatterInfo;
    },
    // chatterInfo() {
    //   const linkman = getLinkman(this);
    //   if (!linkman) {
    //     return {};
    //   }
    //   if (linkman.type !== "group") {
    //     return linkman;
    //   }
    //   console.log(this.members[this.memberInfoIndex]);
    //   return this.members[this.memberInfoIndex];
    // }
  },
  methods: {
    handleShowMembers() {
      this.$store.commit("setMembers", !this.$store.state.isShowMembers);
    },
    handleShowMemberInfo(event,member, index) {
      const { clientX: x, clientY: y } = event;
      this.infoPosition.top = y;
      this.infoPosition.left = x;
      this.memberInfoIndex = index;
      this.chatterInfo = member;
      console.log(member)
      // 通过起点号判断对方是否好友
      let content = member.qdId;
      if(content){
        apiUserSearch({
          content: content
        })
        .then( res => {
          if (res.status === 200) {
              // status 普通好友    INFO  非好友  null 
              if (res.data.status == null) {
                this.canChat = false;
              } else if (res.data.status == "INFO") {
                this.canChat = true;
              }
            } else if (res.status === 302) {
              this.$message.error(res.msg)
            }
        })
        .catch( err => {
          console.log( err)
        })
      }
      this.$store.commit("setMemberInfo", true);
    },
    handleHideMemberInfo() {
      this.$store.commit("setMemberInfo", false);
    },
    handleShowGroupChat() {
      this.$store.commit("setGroupChat", true);
    },
    // canChat() {
    //   const member = this.members[this.memberInfoIndex];
    //   if (!member) {
    //     return false;
    //   }
    //   for (let linkman of this.$store.state.linkmans) {
    //     if (member.id === linkman.id) {
    //       return true;
    //     }
    //   }
    //   // let content = member.qdId;
    //   // console.log(content)
    //   // if(content){
    //   //   apiUserSearch({
    //   //     content: content
    //   //   })
    //   //   .then( res => {
    //   //     console.log(res)
    //   //     this.$nextTick(()=>{
    //   //       return true;
    //   //     })
    //   //   })
    //   //   .catch( err => {
    //   //     console.log( err)
    //   //     this.$nextTick(()=>{
    //   //       return false;
    //   //     })
    //   //   })
    //   // }
    //   return false;
    // },
  }
};
</script>

<style lang="less" scoped>
.wrap {
  // position: relative;
  height: 62px;
  background-color: #fff;
  .info-wrap {
    height: 62px;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fff;
    z-index: 10;
    .info-pack {
      height: 62px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      .info-nickname {
        margin-left: 20px;
        font-size: 16px;
        padding: 0 7px;
        cursor: pointer;
      }

      .info-icon-wrap {
        margin-right: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 14px;
        height: 21px;
        img {
          width: 14px;
          height: 21px;
          cursor: pointer;
        }
      }
    }
  }
  .members-wrap {
    width: 252px;
    height: 766px;
    box-shadow: 10px 0px 10px 0px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-left: 1px solid #f0f0f0;
    box-sizing: border-box;
    opacity: 1;
    transition: 0.3s;
    visibility: visible;
    position: absolute;
    z-index: 0;
    // right: -252px;
    left: 0;
    top: 0px;
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
  }
  .members-wrap-hidden {
    // position: relative;
    transition: 0.3s;
    z-index: -1;
    opacity: 0;
    visibility: hidden;
    right: 0px;
  }
  .members-detail-wrap {
    min-height: 95px;
    max-height: 300px;
    padding-left: 25px;
    display: flex;
    flex-wrap: wrap;
    .member-wrap {
      width: 54px;
      height: 76px;
      margin-top: 19px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .member-avatar {
        width: 38px;
        height: 38px;
        cursor: pointer;
        border-radius: 50%;
      }
      .member-nickname {
        width: 52px;
        height: 30px;
        font-size: 13px;
        color: #363e47;
        margin-top: 6px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
.icon-add-friends {
  display: block;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(240, 240, 240, 1);

  cursor: pointer;
}
</style>
