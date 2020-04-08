<template>
  <div class="left-search-wrap">
    <div class="left-search-input-wrap" @click.stop>
      <i class="left-search"></i>
      <input class="left-search-input" placeholder="查找联系人或群" v-model="searchText" />
    </div>
    <div class="search-result-wrap list-wrap" v-if="isShowSearch" @click.stop>
      
      <div class="search-result-title" v-if="friends.length !== 0">好友</div>
      <div
        v-for="(friend, index) in friends"
        :key="'friend' + index"
        class="search-result-friend"
        @click="handleNewChat(index, 0)"
      >
        <img class="search-result-avatar" :src="friend.headImgUrl" />
        <div class="search-result-text">{{friend.nickName }}</div>
      </div>
      <div class="search-result-title"  v-if="groups.length !== 0">群组</div>
      <div
        v-for="(group, index) in groups"
        :key="'group' + index"
        class="search-result-friend"
        @click="handleNewChat(index, 1)"
      >
        <img class="search-result-avatar" :src="group.headImgUrl" />
        <div class="search-result-text">{{ group.nickName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import headImgUrl from "@/assets/images/default.png";

export default {
  name: "LeftSearch",
  data() {
    return {
      searchText: "",
      friends: [],
      groups: [],
      noResult: 'no-result'
    };
  },
  watch: {
    searchText(val) {
      const ctn = val.trim();
      if (ctn === "") {
        this.handleHideSearchResult();
        return;
      }
      this.handleShowSearchResult();
    }
  },
  computed: {
    isShowSearch() {
      return this.$store.state.isShowSearch;
    }
  },
  methods: {
    handleHideSearchResult() {
      this.$store.commit("setSearch", false);
    },
    handleShowSearchResult() {
      const linkmans = this.$store.state.chatList;
      this.friends = [];
      this.groups = [];

      linkmans.map(linkman => {
        const ctn = this.searchText.trim();
        console.log(ctn)
        // if (linkman.nickname.includes(ctn) || linkman.alias.includes(ctn)) {
        //   if (linkman.type === "group") {
        //     this.groups.push(linkman);
        //   } else {
        //     this.friends.push(linkman);
        //   }
        // }
        if(linkman.nickName && linkman.nickName.includes(ctn)){
          if (linkman.type === "group") {
            this.groups.push(linkman);
          } else {
            this.friends.push(linkman);
          }
        }else if(!linkman.nickName && linkman.nickName && linkman.nickName.includes(ctn) ){
          if (linkman.type === "group") {
            this.groups.push(linkman);
          } else {
            this.friends.push(linkman);
          }
        }
      });
      if (this.friends.length !== 0 || this.groups.length !== 0) {
        this.$store.commit("setSearch", true);
      }
      if ( this.friends.length == 0 && this.groups.length == 0){
         this.$message({
          type: 'warning',
          message: '查无此结果!!!',
          center: true
        });
        //  this.searchText = "";
      }
    },
    handleNewChat(index, type) {
      let result;
      if (type === 0) {
        result = this.friends;
      } else {
        result = this.groups;
      }
      // const linkmans = this.$store.state.linkmans;
      const linkmans = this.$store.state.chatList;
      for (let i = 0; i < linkmans.length; i++) {
        if (linkmans[i].id === result[index].id) {
          this.$store.commit("addChat", i);
          break;
        }
      }
      this.searchText = "";
    }
  }
};
</script>

 <style lang="less" scoped>
.left-search-wrap {
  .left-search-input-wrap {
    display: flex;
    align-items: center;
    width: 250px;
    height: 29px;
    background: #303841;
    border-radius: 15px;
    margin: 0 auto;
    cursor: pointer;
    padding-left: 14px;
    box-sizing: border-box;
    .left-search {
      width: 14px;
      height: 12px;
      background: url("../../../assets/images/icon-search.png") no-repeat;
    }
    .left-search-input {
      height: 14px;
      font-size: 14px;
      color: rgba(106, 118, 129, 1);
      line-height: 24px;
      padding: 0px 11px;
    }
  }
  .no-result {
      display: none;
    }
  .search-result-wrap {
    width: 250px;
    max-height: 660px;
    overflow: auto;
    background-color: #303841;
    position: absolute;
    margin-left: 10px;
    border-radius: 2px;
    box-shadow: 0 0 10px #2a2a2a;
    z-index: 10;
    
    .search-result-title {
      padding: 5px 12px;
      height: 25px;
      color: #fff;
      // font-size: 16px;
      background-color: #303841;
      display: flex;
      align-items: center;
    }
    .search-result-friend {
      display: flex;
      align-items: center;
      height: 70px;
      padding: 0 10px;
      background-color: #363e47;
      cursor: pointer;
      .search-result-avatar {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }

      .search-result-text {
        height: 30px;
        color: #fff;
        font-size: 14px;
        display: flex;
        align-items: center;
      }
      &:hover {
        background-color: #303841;
      }
    }
  }
  .list-wrap {
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 8px;
      /*background-color: #2e3238;*/
      background-color: #eee;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #c3c3c3;
    }
  }
}
</style>
