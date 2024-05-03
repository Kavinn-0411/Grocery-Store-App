import router from "./router.js"
import navbar from "./components/navbar.js"



new Vue({
    el:"#app",
    template:"<div><navbar/><router-view/></div>" ,
    router,
    components:{
        navbar,
    },
})