<template>
  <div class="left-chat-list-wrap">
    <div class="left-chat-list-tab">
      <a
        v-for="(nav, index) in navs"
        :key="'nav' + index"
        :title="nav.title"
        @click="handleChangeTab(index)"
        :class="currentNav===index ? 'active' : ''"
      >{{nav.title}}</a>
    </div>
    <keep-alive>
      <component :is="navs[currentNav].tab"></component>
    </keep-alive>
  </div>
</template>

<script>
import TabChat from "./Tabs/TabChat";
import TabLinkman from "./Tabs/TabLinkman";

export default {
  name: "LeftChatList",

    components: {
      TabChat,
      TabLinkman,
    },
  data() {
    return {
      activeTab: 0,
      navs: [
        {
          title: "聊天列表",
          tab: TabChat
        },
        {
          title: "通讯录",
          tab: TabLinkman
        }
      ]
    };
  },
  computed: {
    currentNav() {
      return this.$store.state.currentTabIndex;
    }
  },
  methods: {
    handleChangeTab(index) {
      // this.activeTab = index;
      this.$store.commit("setCurrentTab", index);
    }
  }
};
</script>

<style lang="less" scoped>
.left-chat-list-wrap {
  height: 100%;
  position: relative;
  .left-chat-list-tab {
    position: absolute;
    bottom: 0;
    display: flex;
    a {
      text-decoration: none;
      width: 135px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #6a7681;
      cursor: pointer;
    }
    .active {
      background-color: #303841;
    }
  }
  .left-chat-list-tab-wrap {
    min-height: 280px;
    // height: calc(100vh - 154px);
    height: 612px;
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
  }
}
</style>
