<template>
  <div class="wrap">
    <div class="container">
      <div class="header">
        <img :src="logo" alt />
        <p>起点</p>
      </div>
      <div class="main">
        <div v-if="qrcodeShow" class="scan">
          <div>
            <div id="qrcode" ref="qrcodeContainer"></div>
            <!-- 创建一个div，并设置id为qrcode -->
          </div>
          <p>请使用起点的扫一扫登录</p>
        </div>
        <div v-else class="switch">
          <div class="img-wrap">
            <img :src="photo" alt />
          </div>
          <div v-if="loginTime < 60">
            <p>请在手机上确认登录操作</p>
            <p>切换账号</p>
          </div>
          <div v-if="loginTime >= 60">
            <p>
              确认登录操作超出时间限制
              <br />请重新登录
            </p>
            <button>重新登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2"; // 引入qrcode
import { apiGetScanReq, apiGetScanStatus } from "@/api/api.js";
import bus from "@/components/common/bus.js";

export default {
  data: function() {
    return {
      logo: require("@/assets/images/logo.png"),
      qrcode: require("@/assets/images/qrcode.png"),
      photo: require("@/assets/images/photo.png"),
      qrcodeShow: true, //默认可见
      qrCode: "", //二维码的标识符
      source: "", //登录来源
      loginTime: 0, //登录时长
      websock: null,
      status: ""
    };
  },
  created() {
    this.ShowapiGetScanReq();
    // this.initWebSocket();
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    // 生成二维码
    ShowapiGetScanReq() {
      apiGetScanReq({
        source: "IOS"
      })
        .then(res => {
          if (res.status === 200) {
            // 显示二维码
            this.qrcodeShow = true;
            this.qrCode = res.data;
            localStorage.setItem('id', res.data)
            this.showQRCode();
            this.loginUriState();
          } else if (res.status === 302) {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showQRCode() {
      this.$nextTick(() => {
        new QRCode(this.$refs.qrcodeContainer, {
          text: this.qrCode,
          width: 186,
          height: 186,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      });
    },
    //
    loginUriState() {
      let _this = this;
      apiGetScanStatus({
        id: _this.qrCode
      })
        .then(res => {
          // console.log(res.status);
          if (res.status === 200) {
            // this.qrcodeShow = false;
            if (res.data.status === "INFO") {
              //等待
              if(_this.loginTime < 60){
                _this.timer = setTimeout(() => {
                  _this.loginUriState();
                  _this.loginTime++;
                }, 1000);
              }
              // _this.$message(res.data.msg);
            } else if (res.data.status === "Y") {
              _this.$message.error(res.data.msg);
              _this.$router.push("/Main");
              _this.status = "Y";
              _this.loginTime = 0;
              clearInterval(this.timer);
              this.timer = null;
            } else if (res.data.status === "N") {
              _this.$message.success(res.data.msg);
              _this.status = "N";
              _this.loginTime = 0;
              clearInterval(this.timer);
              this.timer = null;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取websocket api 地址
    getWebsocketApi() {
      this.initWebSocket();
    },
    initWebSocket() {
      let wsUrl = "ws://101.37.116.134:5555/ws";
      // let wsUrl = "ws://192.168.0.169:5555/ws";
      this.websock = new WebSocket(wsUrl);
      this.websock.onopen = this.websoketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketonclose;
      console.log(this.websock);
    },
    //连接成功
    websoketonopen() {
      let loginData = {
        token: localStorage.getItem('token'),
        plat: "IOS"
      };
      this.websocketSend(loginData);
      console.log("webSocket连接成功");
    },
    // 连接建立失败重连
    websocketonerror() {
      this.getWebsocketApi();
    },
    // 发送数据
    websocketSend(e) {
      this.websock.send(JSON.stringify(e));
    },
    // 接收数据
    websocketonmessage(res) {
      const resdata = JSON.parse(res.data);
      console.log(resdata)
      if (resdata) {
        console.log(resdata)
        switch (resdata.action) {
          // 第一次（或重连初始化并获取用户未读消息）
          case "LOGIN_REPLY":
            console.log('websocket连接成功了')
            break;
          // 添加好友请求
          case "ADD_FRIEND":
            console.log("添加好友请求")
            bus.$emit("addFriend", resdata);
            break;
          // 好友请求回应推送
          case "USER_ADD_FRIEND_REPLY":
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
};
</script>

<style lang="less" scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  //   background-image: linear-gradient(#ced7dd, #99adbe);
  background-color: #f4f5fa;
  background-size: 100%;
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 280px;
    height: 400px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
    .header {
      display: flex;
      height: 27px;
      img {
        width: 26px;
        height: 27px;
      }
      p {
        line-height: 27px;
        margin-left: 6px;
        font-size: 14px;
        color: #333;
      }
    }
    .main {
      display: flex;
      justify-content: center;
      margin-top: 60px;
      text-align: center;
      p {
        margin-top: 40px;
        color: #999;
      }
      .scan {
        div {
          height: 186px;
          width: 186px;
          img {
            height: 186px;
            width: 186px;
          }
        }
      }
      .switch {
        .img-wrap {
          width: 92px;
          height: 92px;
          border-radius: 50%;
          margin: 0 auto;
          img {
            width: 92px;
            height: 92px;
          }
        }
        p:last-child {
          color: #225d9d;
          margin-top: 23px;
          cursor: pointer;
        }
        button {
          width: 226px;
          height: 40px;
          background: linear-gradient(
            75deg,
            rgba(67, 186, 235, 1) 1%,
            rgba(116, 219, 245, 1) 99%
          );
          border-radius: 20px;
          outline: none;
          border: none;
          color: #fff;
          margin-top: 33px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>