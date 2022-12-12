import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页',
                    permiss: '1'
                },
                component: () => import( /* webpackChunkName: "dashboard" */ "../views/dashboard.vue")
            }, {
                path: "/table",
                name: "basetable",
                meta: {
                    title: '用户管理',
                    permiss: '2'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/table.vue")
            }, {
                path: "/vehicle",
                name: "bus",
                meta: {
                    title: '车辆',
                    permiss: '3'
                },
                component: () => import( /* webpackChunkName: "form" */ "../views/vehicle.vue")
            }, {
                path: "/reserve",
                name: "reserve",
                meta: {
                    title: '预约',
                    permiss: '4'
                },
                component: () => import( /* webpackChunkName: "tabs" */ "../views/reserve.vue")
            }, {
                path: "/icon",
                name: "donate",
                meta: {
                    title: '车辆运行信息',
                    permiss: '5'
                },
                component: () => import( /* webpackChunkName: "tabs" */ "../views/icon.vue")
            },
            {
                path: "/RouteTable",
                name: "upload",
                meta: {
                    title: '线路',
                    permiss: '6'
                },
                component: () => import( /* webpackChunkName: "upload" */ "../views/RouteTable.vue")
            },
            {
                path: "/upload",
                name: "upload",
                meta: {
                    title: '线路',
                    permiss: '7'
                },
                component: () => import( /* webpackChunkName: "upload" */ "../views/upload.vue")
            }, {
                path: "/permission",
                name: "permission",
                meta: {
                    title: '权限管理',
                    permiss: '8'
                },
                component: () => import( /* webpackChunkName: "permission" */ "../views/permission.vue")
            }, {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue')
            },
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import( /* webpackChunkName: "login" */ "../views/login.vue")
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;