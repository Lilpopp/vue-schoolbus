import request from '../utils/request';
import path from "./path"

/**
 * 用户模块
 */
//登陆
export const login = (username, password) => {
    return request({
        dataType: "json",
        url: path.user + "/login",
        method: 'post',
        data: {
            "username": username,
            "password": password
        }
    });
};
//注册
export const register = (username, password, sex, phone) => {
    return request({
        dataType: "json",
        url: path.user + "/register",
        method: 'post',
        data: {
            "username": username,
            "password": password,
            "sex": sex,
            "phone": phone,
            "is_super": false
        }
    });
};
//修改信息
export const userChange = (password, sex, phone, comment) => {
    return request({
        dataType: "json",
        url: path.user + "/change",
        method: 'post',
        data: {
            "password": password,
            "sex": sex,
            "phone": phone,
            "comment": comment
        }
    });
};
//查看一个用户的信息
export const findOneUser = () => {
    return request({
        url: path.user + "/user",
        method: 'get'
    });
};
//查看用户列表
export const findUser = (pageNum, pageSize, userName) => {
    return request({
        dataType: "json",
        url: path.user + "/all",
        method: 'post',
        data: {
            "page_num": pageNum,
            "page_size": pageSize,
            "user_name": userName
        }
    });
};
/**
 * 校车模块
 */
//添加校车
export const addBus = (busName, busAllNum) => {
    return request({
        dataType: "json",
        url: path.bus + "/add",
        method: 'post',
        data: {
            "bus_name": busName,
            "bus_all_num": busAllNum
        }
    });
}
//修改校车
export const changeBus = (busId, busName, busState, busAllNum, busNum) => {
    return request({
        dataType: "json",
        url: path.bus + "/change",
        method: 'post',
        data: {
            "bus_id": busId,
            "bus_name": busName,
            "bus_state": busState,
            "bus_all_num": busAllNum,
            "bus_num": busNum
        }
    });
}
//获得校车列表
export const allBus = (pageNum, pageSize, busName) => {
    return request({
        dataType: "json",
        url: path.bus + "/all",
        method: 'post',
        data: {
            "page_num": pageNum,
            "page_size": pageSize,
            "bus_name": busName
        }
    });
}
//获得单个校车信息
export const oneBus = busId => {
    return request({
        url: path.bus + "/bus/" + busId,
        method: 'get',
    });
}
//删除校车
export const deleteBus = busId => {
    return request({
        dataType: "json",
        url: path.bus + "/delete",
        method: 'post',
        data: {
            "bus_id": busId
        }
    });
}
/**
 * 路径模块
 */
//添加路径
export const addRoute = (beginSite, endSite, pathwaySite) => {
    return request({
        dataType: "json",
        url: path.route + "/add",
        method: 'post',
        data: {
            "begin_site": beginSite,
            "end_site": endSite,
            "pathway_site": pathwaySite
        }
    });
}
//获取路径 startSite,endSite为空就是不搜索
export const allRoute = (pageNum, pageSize, beginSite, endSite) => {
    return request({
        dataType: "json",
        url: path.route + "/all",
        method: 'post',
        data: {
            "page_num": pageNum,
            "page_size": pageSize,
            "begin_site": beginSite,
            "end_site": endSite
        }
    });
}
//更改路径
export const changeRoute = (routeId, beginSite, endSite, pathwaySite) => {
    return request({
        dataType: "json",
        url: path.route + "/change",
        method: 'post',
        data: {
            "route_id": routeId,
            "begin_site": beginSite,
            "end_site": endSite,
            "pathway_site": pathwaySite
        }
    });
}
//删除路径
export const deleteRoute = (routeId) => {
    return request({
        dataType: "json",
        url: path.route + "/delete",
        method: 'post',
        data: {
            "route_id": routeId
        }
    });
}
/**
 * 发车线路/正在运行车辆线路 模块
 */
//添加发车线路
export const addSchedule = (beginSite, endSite, routeId, beginTime, busId, schedulePrice) => {
    return request({
        dataType: "json",
        url: path.schedule + "/add",
        method: 'post',
        data: {
            "begin_site": beginSite,
            "end_site": endSite,
            "route_id": routeId,
            "begin_time": beginTime,
            "bus_id": busId,
            "schedule_price": schedulePrice
        }
    });
}
//改变发车路线
export const changeSchedule = (scheduleId, beginSite, endSite, routeId, beginTime, busId, schedulePrice) => {
    return request({
        dataType: "json",
        url: path.schedule + "/change",
        method: 'post',
        data: {
            "schedule_id": scheduleId,
            "begin_site": beginSite,
            "end_site": endSite,
            "route_id": routeId,
            "begin_time": beginTime,
            "bus_id": busId,
            "schedule_price": schedulePrice
        }
    });
}
//查看所有的发车线路
export const allSchedule = (pageNum, pageSize, beginSite, endSite, busName) => {
    return request({
        dataType: "json",
        url: path.schedule + "/all",
        method: 'post',
        data: {
            "page_num": pageNum,
            "page_size": pageSize,
            "begin_site": beginSite,
            "end_site": endSite,
            "bus_name": busName
        }
    });
}
//删除发车路线
export const deleteSchedule = (scheduleId) => {
    return request({
        dataType: "json",
        url: path.schedule + "/delete",
        method: 'post',
        data: {
            "schedule_id": scheduleId,
        }
    });
}
/**
 * 预定模块
 */
//预定
export const addOrder = (scheduleId) => {
    return request({
        dataType: "json",
        url: path.order + "/add",
        method: 'post',
        data: {
            "schedule_id": scheduleId,
        }
    });
}
//支付
export const payOrder = (orderId) => {
    return request({
        dataType: "json",
        url: path.order + "/pay",
        method: 'post',
        data: {
            "order_id": orderId,
        }
    });
}
//查看预定信息
export const allOrder = (pageNum, pageSize) => {
    return request({
        dataType: "json",
        url: path.order + "/all",
        method: 'post',
        data: {
            "page_num": pageNum,
            "page_size": pageSize
        }
    });
}
//删除预定信息
export const deleteOrder = (orderId) => {
    return request({
        dataType: "json",
        url: path.order + "/delete",
        method: 'post',
        data: {
            "order_id": orderId
        }
    });
}

export const insertData = (data, path) => {
    return request({
        url: 'http://localhost:8080' + path,
        method: 'post',
        data: data
    })
}

export const insertDataParam = (data, path) => {
    return request({
        url: 'http://localhost:8080' + path,
        method: 'post',
        params: data
    })
}

export const deleteData = (data, path) => {
    return request({
        url: 'http://localhost:8080' + path,
        method: 'post',
        params: data
    })
}

export const updateData = (data, path) => {
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
