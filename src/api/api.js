import request from '@/api/request'


// 1. H5页面获取二维码内容，取到后用二维码工具生成二维码
export function apiGetScanReq (data){
    return request.post('/login/login/getScanReq',data)
}

// 2.H5轮训获取扫码状态;可以1秒一次;返回值内容中status标记登录状态（INFO:等待 N：拒绝登录 Y：允许登录）
export function apiGetScanStatus (data){
    return request.post('/login/login/getScanStatus',data)
}
// 
export function apiScanDo (data) {
    return request.post('/login/login/scan.do', data)
}
//************************ 好友增删改查 ************************ 
//1.1:添加好友请求  
export function apiFriendAdd (data) {
    return request.post('/v1/friend/add.do', data)
}
//1.8:是否是双边好友 
export function apiFriendCheck (data) {
    return request.post('/v1/friend/check',data)
}
//
export function apiGetUserInfoById (data) {
    return request.post('/v1/user/getUserInfoById.do', data)
}
//好友请求列表
export function apiFriendReqList (data) {
    return request.post('/v1/friend/reqList.do', data)
}
// 审核好友请求信息 
export function apiReplyAddFriend (data) {
    return request.post('/v1/friend/replyAddFrien.do',data)
}
// 获取好友列表，登录成功后，主动过来获取用户好友列表。一次拿完缓存下次无需再拿
export function apiFriendList (data) {
    return request.post('/v1/friend/list.do', data)
}
//1.3:根据手机号/起点号搜索用户信息 
export function apiUserSearch (data) {
    return request.post('/v1/user/search.do', data)
}

//************************ 群增删改，操作等 ************************ 
//1.1:创建群聊 
export function apiGroupCreate (data) {
    return request.post('/v1/group/create.do', data)
}
//1.7:获取用户的所有群 
export function apiGroupGetGroupById (data) {
    return request.post('/v1/group/getGroupById.do', data)
}


// *********************** 点对点聊天/群聊天 ****************************************
//1.1:点对点聊天 
export function apiChatSentMsgPTP (data) {
    return request.post('/v1/chat/sentMsgPTP.do',data)
}
// 1.2:点对群聊天 
export function apiChatSentMsgPTG (data) {
    return request.post('/v1/chat/sentMsgPTG.do', data)
}


// *********************** 点对点聊天/群聊天 ****************************************
//1.1:会话列表  
export function apiConversationList (data) {
    return request.post('/v1/conversation/list.do', data) 
}

