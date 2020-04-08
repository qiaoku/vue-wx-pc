<template>
  <div class="left-header-wrap">
    <set-dialog
      :visible="isShowMyInfo"
      :memberInfo="myInfo"
      :infoPosition="infoPosition"
      :canChat="true"
    ></set-dialog>
    <div class="header-msg">
      <div class="avatar" @click="handleShowMyInfo($event)">
        <img :src="myInfo.headImgUrl ? myInfo.headImgUrl : headImgUrl" alt  />
      </div>
      <div class="nickname txt-ellipsis">{{myInfo.nickName}}</div>
    </div>
    <div class="header-btn">
      <img @click="handleShowGroupChat" :src="addGroupChat" alt />
    </div>
  </div>
</template>
<script>
import setDialog from "@/components/setDialog";
export default {
  data() {
    return {
      headImgUrl:  require ("@/assets/images/default.png"),
      addGroupChat: require("@/assets/images/addGroupChat.png"),
      infoPosition: {
        left: -1,
        top: -1
      }
    };
  },
  created(){
   
   
  },
  computed: {
    myInfo() {
      return this.$store.state.myself;
    },
    isShowMyInfo() {
      return this.$store.state.isShowMyInfo;
    },
    
  },
  
  methods: {
    handleShowMyInfo(event) {
      console.log(event);
      const { clientX: x, clientY: y } = event;
      this.infoPosition.top = y;
      this.infoPosition.left = x;
      this.$store.commit("setMyInfo", true);
    },
    handleShowGroupChat(){
      this.$store.commit("setGroupChat", true);
    }
  },
  components: {
    setDialog,
  }
};
</script>
<style lang="less" scoped>
.left-header-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 9px 13px 13px;
  .header-msg {
    display: flex;
    align-items: center;
    .avatar {
      width: 38px;
      height: 38px;
      img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
    .nickname {
      color: #fff;
      margin-left: 13px;
      width: 100px;
    }
  }
  .header-btn {
    width: 29px;
    height: 29px;
    // background:#303841;
    border-radius: 50%;
    img {
      width: 29px;
      height: 29px;
      cursor: pointer;
    }
  }
}
</style>