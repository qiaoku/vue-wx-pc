<template>
  <div class="left-chat-list-tab-wrap">
    <div @click="addFriend" class="new-friends-wrap">
      <div class="icon-new-friends">
        <img src="@/assets/images/icon-new-friend.png" alt />
      </div>
      <p>新的好友</p>
    </div>
    <div v-for="(kind, index) in kinds" :key="'kind' + index">
      <div class="kind-title">{{ kind.title }}</div>
      <div
        v-for="(linkman, lIndex) in kind.linkmans"
        :key="'linkman' + lIndex"
        class="wrap"
        :class="{
          'wrap-selected': currentLinkman === 'k' + index + 'l' + lIndex
        }"
        @click="handleNewChat(index, lIndex,kind)"
      >
        <div class="avatar-wrap">
          <img class="avatar" :src="linkman.headImgUrl" />
        </div>
        <div class="nickname">
          {{linkman.nickName}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import headImgUrl from "@/assets/images/default.png";
export default {
  name: "TabChat",
  data() {
    return {
      currentLinkman: ""
    };
  },
  created() {
    // this.$store.dispatch("fetchFriendList");
    // this.$store.dispatch("fetchGroupGetGroupList");
    this.$store.commit("getMailList");
  },
  computed: {
    kinds() {
      let kinds = this.$store.state.mailList; 
      return kinds;
    }
  },
  methods: {
    handleShowDetail(kindIndex, lIndex) {
      this.currentLinkman = "k" + kindIndex + "l" + lIndex;
      const id = this.kinds[kindIndex].linkmans[lIndex].id;
      const linkmans = this.$store.state.linkmans;
      this.$store.commit("setCurrentRight", 1);
      for (let i = 0; i < linkmans.length; i++) {
        if (id === linkmans[i].id) {
          this.$store.commit("setCurrentLinkman", i);
          break;
        }
      }
    },
    handleNewChat(i, j,kind) {
      // 判断是群/好友
      console.log(i, j,kind)
      console.log(this.kinds)
      if(kind.type == "group"){
         this.$store.commit("addChat",{
           type: 'group',
           i: i,
           j: j
         });
      }else{
        this.$store.commit("addChat",{
           type: 'friend',
            i: i,
           j: j
         });
      }

    },
    addFriend() {
      this.$store.commit("setCurrentRight", 1);
    }
  }
};
</script>

<style lang="less" scoped>
.new-friends-wrap {
  height: 70px;
  user-select: none;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 13px;
  font-size: 13px;
  cursor: pointer;
  .icon-new-friends {
    width: 38px;
    height: 38px;
    margin-right: 15px;
    img {
      width: 38px;
      height: 38px;
    }
  }
}
.kind-title {
  color: #787b87;
  padding: 2px 18px;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
}

.wrap {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  font-size: 13px;
  cursor: pointer;
  color: #989898;
  user-select: none;
}

.wrap-selected {
  background-color: #404953;
  color: #fff;
}

.avatar-wrap {
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

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 2px;
}

.nickname {
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 13px;
}
</style>
