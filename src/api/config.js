// 项目域名地址
const url = "http://101.37.116.134:3001";
// const url = "http://192.168.0.169:3001";
let ROOT;
// 由于封装的axios请求中，会将ROOT打包进去，为了方便之后不再更改，判断当前环境，而生成不同的ROOT
if(process.env.NODE_ENV === "development"){
    // 开发环境下的代理环境
    ROOT = "/qidian";
}else {
    // 生产环境下的地址
    ROOT = url;
}
export default {
    ROOT, url
}