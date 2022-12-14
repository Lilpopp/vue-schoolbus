// 在src目录下创建文件夹utils，并创建文件request.js，用来存储网络请求对象axios

import axios from "axios";

// 创建一个属于自己的网络请求对象
const instance = axios.create({
    // 网络请求的公共配置
    //请求的超时时间为5秒
    timeout: 5000
})

// 定义拦截器，拦截器是最常用的。常用于获取数据之前和发送数据之前做一些处理

// 发送数据之前的拦截器
instance.interceptors.request.use(
    //config是定义成功的函数
    // config 包含着网络请求的所有信息
    config => {
        if (localStorage.getItem("token")) {
            config.headers['token'] = localStorage.token;
        }
        // post请求需要转换格式，要单独处理。如果
        // 字典传递进去抛出"参数缺失,请提供完整参数"的错误,请参考35博客
            return config
    },
    // error 定义失败的函数
    error => Promise.reject(error)
)

// 获取数据之前的拦截器
instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
)

export default instance;// 导出网络请求
