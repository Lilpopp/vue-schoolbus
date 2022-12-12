import request from '../utils/request';
import axios from "axios";
import path from "./path"
//登陆
export const login = (username,password) => {
    return request({
        dataType: "json",
        url: path.user+"/login",
        method: 'post',
        data: {
            "username":username,
            "password":password
        }
    });
};
//注册
export const register = (username,password,sex,phone) => {
    return request({
        dataType: "json",
        url: path.user+"/register",
        method: 'post',
        data: {
            "username":username,
            "password":password,
            "sex":sex,
            "phone":phone,
            "is_super":false
        }
    });
};
//修改信息
export const userChange = (password,sex,phone,comment) => {
    return request({
        dataType: "json",
        url: path.user+"/change",
        method: 'post',
        data: {
            "password":password,
            "sex":sex,
            "phone":phone,
            "comment":comment
        }
    });
};
//查看一个用户的信息
export const findOneUser = () => {
    return request({
        url: path.user+"/user",
        method: 'get'
    });
};
//查看用户列表
export const findUser = (pageNum,pageSize,userName) => {
    return request({
        dataType: "json",
        url: path.user+"/all",
        method: 'post',
        data: {
            "page_num":pageNum,
            "page_size":pageSize,
            "user_name":userName
        }
    });
};


export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const insertData = (data,path) => {
    return request({
        url: 'http://localhost:8080' + path,
        method: 'post',
        data: data
    })
}

export const insertDataParam = (data,path) => {
    return request({
        url: 'http://localhost:8080' + path,
        method: 'post',
        params: data
    })
}

export const deleteData = (data,path) => {
    return request({
        url: 'http://localhost:8080' + path,
        method: 'post',
        params: data
    })
}

export const updateData = (data ,path) => {
    return request({
        url: 'http://localhost:8080' + path,
        method: 'post',
        data: data
    })
}

export const getDataParam = (query, path) => {
    return request({
        url: 'http://localhost:8080' + path,
        method: 'get',
        params: query
    })
};

export const getDataNoParam = (path) => {
    return request({
        url: 'http://localhost:8080' + path,
        method: 'get',
        params: ""
    })
};
