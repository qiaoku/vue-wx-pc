<template>
  <div
    class="member-info-wrap dialog"
    v-if="visible"
    @click.stop
  >
    <div class="dialog-header">
                <div class="dialog-title">意见反馈</div>
                <div class="dialog-btn-cancle">
                  <img @click="CloseDialogfeedback" src="@/assets/images/close.png" alt />
                </div>
              </div>
              <div class="dialog-main">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="textarea"
                  maxlength="100"
                  rows="7"
                  show-word-limit
                ></el-input>
                <div class="footer">
                  <button class="normal-btn" @click="CloseDialogfeedback">取消</button>
                  <el-button :disabled='textarea==""'>确定</el-button>
                </div>
              </div>
  </div>
</template>

<script>
// import avatar from "@/assets/images/default.png";

export default {
  name: "MemberInfo",
  props: ["visible", "memberInfo", "canChat"],
  data(){
      return{
          textarea:''
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
    CloseDialogfeedback(){
        this.$store.commit("setFeedback", false);
    }
  }
};
</script>

<style lang="less" scoped>
.member-info-wrap {
  width:393px;
  height:275px;
  z-index: 11;
  visibility: visible;
  position: absolute;
  margin-left: 136px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  .dialog-header {
        height: 18px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .dialog-title {
          color: #363E47;
          font-size: 14px;
        }
        .dialog-btn-cancle {
          width: 8px;
          height: 8px;
          img {
            width: 8px;
            height: 8px;
            cursor: pointer;
          }
        }
      }
      .dialog-main{
        .el-textarea {
          margin-top: 12px;
          width:354px;
          // height:147px;
        }
        .footer {
          margin-top: 17px;
          display: flex;
          flex-direction: row-reverse;
          button {
            width:70px;
            height:26px;
            line-height: 26px;
          }
          .normal-btn {
            border: 1px solid #f0f0f0;
            box-sizing: border-box;
            background-color: transparent;
            margin-left: 8px;
          }
        }
    }
}


</style>
<style lang="less">
  .el-textarea__inner {
    background-color: #fcfcfd;
    border: none;
    outline: none;
  }
  .el-button {
    padding: 0;
    color: #fff;
    background: linear-gradient(75deg, #43baeb 1%, #74dbf5 99%);
    border: none;
  }
  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    cursor: not-allowed;
    color: #fff;
    background: linear-gradient(75deg, #43baeb 1%, #74dbf5 99%);
    border: none;
}
</style>
