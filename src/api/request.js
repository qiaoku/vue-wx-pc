import axios from 'axios';
import qs from 'qs'
import CONFIG from "./config"

//实例化一个对象
const request = axios.create({
    // baseURL: 'http://127.0.0.1:9000',
    baseURL:CONFIG.ROOT,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    timeout: 10000,
  })
  // 'token': localStorage.getItem('token'),
  // 添加请求拦截器
  request.interceptors.request.use(
    config => {
        localStorage.setItem('TOKEN','IOS-5c8a14e633e34b81a9dfc32fe8e3c0fe')
        config.headers.common['TOKEN']=localStorage.getItem('TOKEN');
        
    //   let toket =localStorage.getItem('token')
    //   if(toket){
    //     config.headers.common['TOKEN']='IOS-44f2192fa54242b894780d33f5382fa9';
    //   }
      // 在发送请求之前做些什么
      if (config.method === 'post') {
        // console.log(CONFIG.ROOT)
        // 序列化
        config.data = qs.stringify(config.data)
      } else if(config.method === 'get'){
        // 添加heder
      }
      return config;
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  )
  //响应拦截
  request.interceptors.response.use(
    response => {
      if (response.data.code == 200) {
        return Promise.resolve(response.data)
      }
      return Promise.resolve(response.data)
    },
    error => {
      if (error.response) {
        console.log(error.response)
        switch (error.response.status) {
          case 404:
              console.log( this.$message)
            this.$message.error("404 Not Fount :)");
            break;
          case 500:
            this.$message.error("系统异常，请联系管理后台人员 :)");
            break;
          default:
            this.$message.error(error.response.statusText);
        }
      }
      return Promise.reject(error)
    }
  )
  export default request