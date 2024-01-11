import {createRouter, createWebHashHistory} from 'vue-router'

import PhotoMain from '@/views/PhotoMain.vue'
import PhotoShow from '@/views/PhotoShow.vue'
import loginView from "@/views/LoginView.vue";
import registerView from "@/views/RegisterView.vue";
import RetrievePasswordView from "@/views/RetrievePasswordView.vue";
import logoutView from "@/views/LogoutView.vue";
import videoShow from "@/views/VideoShow.vue";
import videoMain from "@/views/VideoMain.vue";

const router = createRouter({
    history:createWebHashHistory(),
    routes: [
        {
          path:'/video',
          component: videoMain,
        },
        {
            path:"/videoshow/:id",
            component:videoShow,
            props:true
        },
        {
            path:'/',
            component:PhotoMain
        },
        {
            path: "/show/:id",
            component: PhotoShow,
            props:true
        },
        {
            //登陆
            path:"/login",
            component:loginView,
        },
        {
            //注册
            path:"/register",
            component:registerView,
        },
        {
            //找回密码
            path:"/retrievePassword",
            component:RetrievePasswordView
        },
        {
            //找回密码
            path:"/logout",
            component:logoutView
        }
    ]
})

router.beforeEach((to,from,next)=>{
    const token = localStorage.getItem("token");
    if(to.path === '/login' || to.path === '/register'|| to.path === '/retrievePassword'|| to.path === '/error'){
        next();
    }else{
        if(token == null || token === ''){
            next('/login');
        } else{
            next();
        }
    }
})
export default router
