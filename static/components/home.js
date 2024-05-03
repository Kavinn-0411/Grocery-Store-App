import dashboard from "./User_Interface/dashboard.js"
import admin from "./admin.js"
import store_manager from "./store_manager.js"
export default{
    template: `
    <div><dashboard v-if="userRole=='user'"/>
    <store_manager v-if="userRole=='store_manager'" />
    <admin v-if="userRole=='admin'"/>
    </div>

    `,
    data(){
        return{
            userRole:sessionStorage.getItem('role'),
        }
    },
    components:{
      dashboard,
      store_manager,
      admin
    },
  
    
 

    
}