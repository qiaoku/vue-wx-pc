<template>
  <div
    class="member-info-wrap dialog"
    v-if="visible"
    :style="{ top: infoPosition.top + 'px', left: infoPosition.left + 'px' }"
    @click.stop
  >
    <div class="dialog-header">
      <div class="dialog-btn-cancle">
        <img @click="CloseDialogSetting" src="@/assets/images/close.png" alt />
      </div>
    </div>
    <div class="dialog-main">
      <div class="top">
        <div class="dialog-avatar">
          <img :src="memberInfo.headImgUrl ? memberInfo.headImgUrl : avatar" alt />
        </div>
        <div class="dialog-nickname">{{memberInfo.nickName}}</div>
      </div>
      <div class="middle">
        <div>
          <span>微信号</span>
          <span>{{memberInfo.qdId}}</span>
        </div>
        <div>
          <span>地区</span>
          <span>{{memberInfo.country + memberInfo.province + memberInfo.city }}</span>
        </div>
      </div>
      <div class="footer">
        <button @click="feedBack" class="normal-btn-fillet">意见反馈</button>
        <button @click="logout" class="active-btn-fillet">退出登录</button>
        <p class="edition">起点 1.0.0</p>
      </div>
    </div>
  </div>
</template>

<script>
// import avatar from "@/assets/images/default.png";

export default {
  name: "MemberInfo",
  props: ["visible", "memberInfo", "infoPosition", "canChat"],
  data(){
    return{
      avatar:  require ("@/assets/images/default.png"),
    }
  },
  methods: {
    newChat() {
      this.$store.commit(
        "addChat",
        this.$store.state.linkmans.indexOf(this.memberInfo)
      );
      this.$store.commit("hideAll");
    },
    CloseDialogSetting() {
      this.$store.commit("setMyInfo", false);
    },
    // 退出登录
    logout() {
      localStorage.clear();
      this.$router.push("/login");
      this.$message.success("已经退出");
    },
    // 意见反馈
    feedBack(){
      this.$store.commit("setFeedback", true);
    },
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
  height: 485px;
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
