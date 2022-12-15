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
                component: () => import("../views/dashboard.vue")
            }, {
                path: "/table",
                name: "admin",
                meta: {
                    title: '用户管理',
                    permiss: '2'
                },
                component: () => import("../views/table.vue")
            },{
                path: "/reserve",
                name: "reserve",
                meta: {
                    title: '预约',
                    permiss: '3'
                },
                component: () => import("../views/order.vue")
            },  {
                path: "/vehicle",
                name: "vehicle",
                meta: {
                    title: '车辆管理',
                    permiss: '5'
                },
                component: () => import("../views/bus.vue")
            }, {
                path: "/RouteTable",
                name: "RouteTable",
                meta: {
                    title: '路径管理',
                    permiss: '6'
                },
                component: () => import("../views/route.vue")
            },{
                path: "/schedule",
                name: "schedule",
                meta: {
                    title: '车辆运行信息',
                    permiss: '7'
                },
                component: () => import("../views/schedule.vue")
            }, {
                path: "/permission",
                name: "permission",
                meta: {
                    title: '权限管理',
                    permiss: '9'
                },
                component: () => import("../views/permission.vue")
            }, {
                path: "/icon",
                name: 'icon',
                meta: {
                    title: '车辆运行信息',
                    permiss: '10'
                },
                component: () => import("../views/schedule.vue")
            },{
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import('../views/user.vue')
            },
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import("../views/login.vue")
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
router.beforeEach((to, from, next) => {
    if (to.path.startsWith('/login')) {
        window.localStorage.removeItem('token')
        next()
    } else {
        let user = window.localStorage.getItem('token')
        if (!user) {
            next({
                path: '/login'
            })
        } else {
            next()
        }
    }
});
export default router;