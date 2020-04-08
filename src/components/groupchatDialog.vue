<template>
  <div class="member-info-wrap dialog" v-if="visible" @click.stop>
    <div class="dialog-left">
      <div class="left-search-input-wrap" @click.stop>
        <i class="left-search"></i>
        <input class="left-search-input" placeholder="搜索" v-model="searchText" />
      </div>
      <div class="left-chat-list">
        <div v-for="(kind, index) in kinds" :key="index" class="chat-type">
          <p class="kind-title">{{ kind.title }}</p>
          <ul>
            <li
              @click="handleLinkman(linkman)"
              v-for="(linkman, lIndex) in kind.linkmans"
              :key="lIndex"
            >
              <div class="chat-left">
                <div class="chat-avatar">
                  <img :src="linkman.headImgUrl" />
                </div>
                <div class="chat-nickname">{{linkman.nickName}}</div>
              </div>
              <div class="chat-right">
                <img v-if="!linkman.isChecked" :src="isCheck " alt />
                <img v-if="linkman.isChecked" :src="checked " alt />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="dialog-right">
      <p>
        <span class="addgroup">发起群聊</span>
        <span v-if="!this.addMember.length">已选择的联系人</span>
        <span v-if="this.addMember.length">
          已选择
          <span class="num">{{this.addMember.length + '个'}}</span>联系人
        </span>
      </p>
      <div class="dialog-btn-cancle">
        <img @click="CloseDialogGroupChat" src="@/assets/images/close.png" alt />
      </div>
      <ul>
        <li v-for="(item, i) in addMember" :key="i">
          <div class="chat-left">
            <div class="chat-avatar">
              <img :src="item.headImgUrl" />
            </div>
            <div class="chat-nickname">{{item.nickName}}</div>
          </div>
          <div class="chat-right">
            <img @click="handleDelMember(item,i)" :src="unchecked " alt />
          </div>
        </li>
      </ul>
      <div class="handlebtn">
        <button @click="CloseDialogGroupChat" class="normal-btn">取消</button>
        <el-button @click="handleGroupCreat" :disabled="addMember.length == 0">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { pinyin } from "@/assets/js/pinyin"
import { apiGroupCreate, } from "@/api/api.js"
export default {
  name: "groupChat",
  props: ["visible"],
  data() {
    return {
      searchText: "",
      isCheck: require("@/assets/images/icon-check.png"),
      checked: require("@/assets/images/icon-checked.png"),
      unchecked: require("@/assets/images/icon-unchecked.png"),
      membersData: [],
      addMember: [],
      ids:[]
    };
  },
  created(){
    // this.$store.dispatch('fetchFriendList');
  },
  computed: {
    kinds(){
      let linkmans = this.$store.state.friend;
      let kinds = [];
      let kindCount = -1;
      let currentType = "";
      for (let linkman of linkmans) {
        if(linkman.nickName){
          linkman.initial = pinyin.getFullChars(linkman.nickName).toUpperCase().substr(0,1);
          console.log(linkman.first)
          if (linkman.initial !== currentType) {
          kinds.push({
            title: linkman.initial,
            linkmans: []
          });
          currentType = linkman.initial;
          kindCount += 1;
        }
        }
        kinds[kindCount].linkmans.push({ ...linkman });
      }
      kinds.sort(function(a,b){
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      })
      console.log(kinds);
      return kinds;
    }
  },
  methods: {
    CloseDialogGroupChat() {
      this.$store.commit("setGroupChat", false);
    },
    handleLinkman(linkman) {
      linkman.isChecked = !linkman.isChecked;
      if (linkman.isChecked) {
        this.addMember.push(linkman);
        this.ids.push(linkman.id);
        console.log(this.ids.join(','))
      } else {
        this.addMember.pop();
      }
    },
    handleDelMember(item, i) {
      this.addMember.splice(i, 1);
      this.kinds.forEach(element => {
        element.linkmans.forEach(kind => {
          if (item.id == kind.id) {
            kind.isChecked = false;
          }
        });
      });
    },
    // 创建群
    handleGroupCreat(){
      apiGroupCreate({
        ids: this.ids.join(',')
      })
      .then( res => {
        console.log(res)
        if(res.status == 200){
          console.log(res)
          this.$message.success(res.msg);
          this.CloseDialogGroupChat();
          this.$store.dispatch("fetchGroupGetGroupList");
        }else if (res.status === 302) {
            this.$message.error(res.msg);
          }
      })
      .catch( err => {
        console.log(err)
      })
    }
  }
};
</script>
<style lang="less" scoped>
.member-info-wrap {
  font-size: 14px;
  width: 549px;
  height: 485px;
  z-index: 11;
  visibility: visible;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-left: 136px;
  padding: 0;
  border-radius: 0;
  display: flex;
  .dialog-left {
    width: 274px;
    box-sizing: border-box;
    border-right: 1px solid #f0f0f0;
    .left-search-input-wrap {
      margin: 20px 0 0 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-left: 14px;
      box-sizing: border-box;
      width: 229px;
      height: 25px;
      border: 1px solid #f0f0f0;
      border-radius: 2px;
      .left-search {
        width: 14px;
        height: 12px;
        display: inline-block;
        background: url("../assets/images/icon-search.png") no-repeat;
      }
      .left-search-input {
        height: 14px;

        color: rgba(106, 118, 129, 1);
        line-height: 24px;
        padding: 0px 11px;
      }
    }
    .left-chat-list {
      // margin-left: 20px;
      max-height: 440px;
      overflow: auto;
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
      .kind-title {
        padding: 0 20px;
        color: #666;
        font-size: 12px;
        line-height: 30px;
      }
      ul {
        li {
          height: 70px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .chat-left {
            display: flex;
            align-items: center;
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
            .chat-right {
              width: 20px;
              height: 20px;
              img {
                width: 20px;
                height: 20px;
              }
            }
            .chat-msg-nickname {
              color: #fff;
              height: 20px;
            }
          }
          &:hover {
            background-color: #e8e7e7;
          }
        }
        // .ischecked {
        //   background-color: #D5D4D4;
        //   color: #fff;
        // }
      }
    }
  }
  .dialog-right {
    flex: 1;
    padding: 20px 17px 18px 26px;
    .dialog-btn-cancle {
      width: 8px;
      height: 8px;
      position: absolute;
      right: 10px;
      top: 10px;
      img {
        width: 8px;
        height: 8px;
        cursor: pointer;
      }
    }
    p {
      span {
        color: #999;
        span {
          color: #333;
          padding: 0 3px;
        }
      }
      .addgroup {
        color: #333;
        margin-right: 10px;
      }
    }
    ul {
      height: 380px;
      overflow: auto;
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
        height: 70px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .chat-left {
          display: flex;
          align-items: center;
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
          .chat-msg-nickname {
            color: #fff;
            height: 20px;
          }
        }
        .chat-right {
          width: 17px;
          height: 17px;
          img {
            width: 17px;
            height: 17px;
            cursor: pointer;
          }
        }
      }
      // .ischecked {
      //   background-color: #D5D4D4;
      //   color: #fff;
      // }
    }
    .handlebtn {
      margin-top: 20px;
      display: flex;
      flex-direction: row-reverse;
      button {
        width: 70px;
        height: 26px;
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
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  cursor: not-allowed;
  color: #fff;
  background: linear-gradient(75deg, #43baeb 1%, #74dbf5 99%);
  border: none;
}
</style>
