<template>
    <div class="nav-tab">
        <ul>
            <li :class="activeTab===index ? 'active' : ''" @click="handleNavTab(item,index)" v-for="(item,index) in navList" :key="index">
                {{item.title}}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return{
            navList:[
                {title: '聊天列表', link:'Home'},
                { title: '通讯录', link:'friendList'}
            ],
            activeTab: 0,
        }
    },
    methods:{
        handleNavTab(item,index){
            console.log(item.link)
            this.activeTab = index;
            this.$router.push({
                name: item.link
            })
        }
    }
}
</script>
<style lang="less" scoped>
.nav-tab{
   ul {
       display: flex;
       li {
           height: 60px;
           width: 135px;
            text-align: center;
            color: #6A7681;
            cursor: pointer;
       }
       .active {
           background-color: #303841;
       }
   }

}
</style>