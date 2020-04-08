<template>
  <div class="wrap">
    <div class="header">
      <div class="info-nickname">新的好友</div>
      <div class="info-icon-wrap" @click="handleFindFriend">
        <img src="@/assets/images/icon-new-friend02.png" alt />
      </div>
    </div>
    <div class="main">
      <ul>
        <li v-for="(friend,index) in friendReqList" :key="index">
          <div class="list-left">
            <div class="avator">
              <img :src="friend.reqUser.headImgUrl" alt />
            </div>
            <div class="info">
              <p>{{friend.reqUser.nickName}}</p>
              <p class="txt-ellipsis">{{friend.req.reqMsg}}</p>
            </div>
          </div>
          <div class="list-right">
            <el-button @click="openDialogAccept(friend)" v-if="friend.req.status == 'NOCHECK'">接受</el-button>
            <button class="normal" v-if="friend.req.status == 'Y'">已通过</button>
            <button class="normal" v-if="friend.req.status == 'N'">已拒绝</button>
            <button class="normal" v-if="friend.req.status == 'H'">已过期</button>
          </div>
        </li>
      </ul>
    </div>
    <!-- 发送成功 -->
    <div class="accept-dialog dialog" v-if="visibleAccept" @click.stop>
      <div class="dialog-header">
        <div class="dialog-title">提示</div>
        <div class="dialog-btn-cancle">
          <img @click="CloseDialogAccept" src="@/assets/images/close.png" alt />
        </div>
      </div>
      <div class="dialog-main">
        <div class="message">接受成功</div>
        <div class="footer">
          <el-button @click="handleAccept">确定</el-button>
        </div>
      </div>
    </div>
    <!-- 查找好友 弹窗 -->
    <div class="find-friend-dialog dialog" v-if="visibleFindFriend" @click.stop>
      <div class="dialog-header">
        <div class="dialog-title">查找好友</div>
        <div class="dialog-btn-cancle">
          <img @click="CloseDialogFindFriend" src="@/assets/images/close.png" alt />
        </div>
      </div>
      <div v-if="result === ''" class="dialog-main">
        <input v-model="content" type="text" placeholder="手机号/起点ID搜索好友" />
        <el-button @click="getUserInfoById">查询</el-button>
      </div>
      <div v-if="result === 'N'" class="dialog-main">
        <p>该用户不存在</p>
        <el-button @click="searchAgain">再次查找</el-button>
      </div>
      <div v-if="result === 'Y'" class="dialog-main">
        <div class="top">
          <div class="dialog-avatar">
            <img :src="memberInfo.headImgUrl" alt />
          </div>
          <div class="dialog-nickname">{{memberInfo.nickName}}</div>
        </div>
        <div class="middle">
          <div v-if="canChat">
            <span style="line-height: 28px;">备注</span>
            <input style="width: 200px; margin-bottom: 0px;" type="text" placeholder="请添加备注" />
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
          <button v-if="canChat" class="active-btn-fillet">发送消息</button>
          <button v-else @click="openDialogAddFriend" class="active-btn-fillet">添加好友</button>
        </div>
      </div>
      <!-- <div class="dialog-main">
        <input v-model="content" type="text" placeholder="手机号/起点ID搜索好友" />
      </div>
      <div class="footer">
        <el-button @click="getUserInfoById">查询</el-button>
      </div>-->
    </div>
    <!--  -->
    <div class="add-friend-dialog dialog" v-if="visibleAddFriend" @click.stop>
      <div class="dialog-header">
        <div class="dialog-title">添加好友</div>
        <div class="dialog-btn-cancle">
          <img @click="CloseDialogAddFriend" src="@/assets/images/close.png" alt />
        </div>
      </div>
      <div class="dialog-main">
        <el-input
          type="textarea"
          placeholder="请输入验证信息"
          v-model="msg"
          maxlength="100"
          rows="6"
          show-word-limit
        ></el-input>
        <div class="footer">
          <button class="normal-btn" @click="CloseDialogAddFriend">取消</button>
          <el-button @click="handleFriendAdd" :disabled="msg==''">确定</el-button>
        </div>
        <span class="tip">你需要发送验证请求，对方通过后才能添加其为朋友</span>
      </div>
    </div>
    <!-- 接受成功 -->
    <div class="accept-dialog dialog" v-if="visibleAccept" @click.stop>
      <div class="dialog-header">
        <div class="dialog-title">提示</div>
        <div class="dialog-btn-cancle">
          <img @click="CloseDialogAccept" src="@/assets/images/close.png" alt />
        </div>
      </div>
      <div class="dialog-main">
        <div class="message" style="line-height: 20px">发送成功</div>
        <div class="footer">
          <button style="background: transparent;border: 1px solid #ddd;width:80px;height: 34px;border-radius: 6px;" @click="handleAccept">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/components/common/bus";
import {
  apiFriendReqList,
  apiReplyAddFriend,
  apiUserSearch,
  apiFriendAdd
} from "@/api/api.js";

export default {
  name: "LinkmanInfo",
  data() {
    return {
      friendReqList: [],
      visibleAccept: false,
      visibleFindFriend: false,
      visibleAddFriend: false,
      reqId: "",
      content: "",
      result: "",
      memberInfo: "",
      canChat: false,
      msg: ""
    };
  },
  created() {
    let _this = this;
    this.getFriendReqList();
    bus.$on('addFriend',function(){
      console.log(_this)
     _this.getFriendReqList();
    })
  },
  components: {},
  methods: {
    // 获取好友请求列表
    getFriendReqList() {
      apiFriendReqList({})
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            this.friendReqList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    openDialogAccept(friend) {
      this.visibleAccept = true;
      this.reqId = friend.req.id;
      this.handleAccept();
    },
    CloseDialogAccept() {
      this.visibleAccept = false;
    },
    handleAccept() {
      apiReplyAddFriend({
        reqId: this.reqId,
        msg: "通过",
        status: "Y"
      })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            this.getFriendReqList();
            this.CloseDialogAccept();
          } else if (res.status === 302) {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleFindFriend() {
      this.visibleFindFriend = true;
      this.result = "";
      this.content = "";
    },
    CloseDialogFindFriend() {
      this.visibleFindFriend = false;
    },
    getUserInfoById() {
      if (this.content) {
        apiUserSearch({
          content: this.content
        })
          .then(res => {
            console.log(res);
            if (res.status === 200) {
              this.result = "Y";
              this.memberInfo = res.data;
              // status 普通好友    INFO  非好友  null 
              if (res.data.status == null) {
                this.canChat = false;
              } else if (res.data.status == "INFO") {
                this.canChat = true;
              }
            } else if (res.status === 302) {
              this.result = "N";
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message.error("请先输入手机号/起点ID");
      }
    },
    searchAgain() {
      this.result = "";
      this.content = "";
    },

    // 添加好友
    openDialogAddFriend() {
      this.visibleFindFriend = false;
      this.visibleAddFriend = true;
    },
    CloseDialogAddFriend() {
      this.visibleAddFriend = false;
    },
    handleFriendAdd() {
      if (this.memberInfo) {
        apiFriendAdd({
          id: this.memberInfo.id,
          msg: this.msg,
          // source: this.memberInfo.source
          source: "SEARCH"
        })
          .then(res => {
            console.log(res);
            if(res.status === 200){
              this.visibleAddFriend = false;
              this.visibleAccept = true;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="less" scope>
.wrap {
  height: 100%;
  // position: relative;
  .header {
    height: 62px;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
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
      width: 15px;
      height: 17px;
      img {
        width: 15px;
        height: 17px;
        cursor: pointer;
      }
    }
  }
  .main {
    ul {
      overflow-y: auto;
      height: 704px;
      &::-webkit-scrollbar {
        width: 5px;
        height: 8px;
        background-color: #eee;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #c3c3c3;
      }
      li {
        margin: 0 86px;
        height: 78px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f4f5fa;
        .list-left {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .avator {
            width: 38px;
            height: 38px;
            img {
              width: 38px;
              height: 38px;
              border-radius: 50%;
              cursor: pointer;
            }
          }
          .info {
            margin-left: 14px;
            p:first-child {
              color: #333;
              font-size: 13px;
            }
            p:last-child {
              width: 300px;
              margin-top: 6px;
              color: #666;
              font-size: 11px;
            }
          }
        }
        .list-right {
          button {
            width: 56px;
            height: 26px;
            border-radius: 3px;
          }
          .normal {
            background-color: transparent;
            color: #999;
            outline: none;
            border: none;
          }
        }
      }
    }
  }
  .accept-dialog {
    width: 250px;
    height: 180px;
    border-radius: 0px;
    z-index: 11;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: 136px;
    transform: translate(-50%, -50%);
    .message {
      line-height: 99px;
    }
  }
  .find-friend-dialog {
    width: 320px;
    // height: 180px;
    border-radius: 0px;
    z-index: 11;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: 136px;
    transform: translate(-50%, -50%);
    input {
      margin-bottom: 20px;
      border: 1px solid #f0f0f0;
      border-radius: 2px;
      padding: 5px;
      font-size: 14px;
      color: rgba(106, 118, 129, 1);
      width: 250px;
    }
    p {
      margin-bottom: 20px;
    }
  }
  .add-friend-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-left: 136px;
    .footer {
      margin-bottom: 10px;
      button {
        height: 26px;
        width: 58px !important;
      }
      .normal-btn {
        margin-right: 10px;
      }
    }
    .tip {
      font-size: 12px;
      color: #888;
    }
  }
  .dialog {
    .dialog-header {
      height: 18px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      .dialog-title {
        color: #363e47;
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
    .dialog-main {
      margin-top: 30px;
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
  // width: 56px;
  padding: 0 15px !important;
  height: 26px;
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  cursor: not-allowed;
  color: #fff;
  background: linear-gradient(75deg, #43baeb 1%, #74dbf5 99%);
  border: none;
}
</style>