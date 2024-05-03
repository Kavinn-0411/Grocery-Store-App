import home from "./components/home.js"
import login from "./components/login.js"
import register from "./components/User_Interface/register.js"
import category_activate from "./components/Admin/category_activate.js"
import category_create from "./components/Store_manager/category_create.js"
import item_create from "./components/Store_manager/item_create.js"
import item_get from "./components/Store_manager/item_get.js"
import dashboard_items from "./components/User_Interface/dashboard_items.js"
import add_to_cart from "./components/User_Interface/add_to_cart.js"
import user_cart from "./components/User_Interface/user_cart.js"
import stock_report from "./components/Store_manager/stock_report.js"
import signup from "./components/Store_manager/signup.js"
import user_activate from "./components/Admin/user_activate.js"
import edit_category from "./components/Store_manager/edit_category.js"
import edit_items from "./components/Store_manager/edit_items.js"

const routes=[{path:'/home',component:home},
{path:'/',component:login,name:"Login"},
{path:'/register',component:register,name:"Register"},
{path:'/category_activate',component:category_activate,name:"category_activate"},
{path:'/category_create',component:category_create,name:"category_create"},
{path:'/item_create',component:item_create,name:"item_create"},
{path:'/item_get',component:item_get,name:"item_get"},
{path:'/user_item_get',component:dashboard_items,name:"dashboard_items"},
{path:'/item_purchase',component:add_to_cart,name:"item_purchase"},
{path:'/display_user_cart',component:user_cart,name:"user_cart"},
{path:'/stock_report',component:stock_report},
{path:'/storemanager_signup',component:signup},
{path:'/user_activate',component:user_activate},
{path:'/edit_category',component:edit_category},
{path:'/edit_item',component:edit_items}
]




export default new VueRouter({
    routes,
})