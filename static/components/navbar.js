export default{
    template:
    `


    <nav class="navbar navbar-expand-lg" id="nav">
    <div class="container-fluid">
    <a class="navbar-brand ms-3 ">
    <img src="https://seeklogo.com/images/G/grocery-store-logo-3B65A40953-seeklogo.com.png" alt="" width="90" height="60">
  </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav  ms-3" style="font-size:22px;">
         
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" v-if="role=='admin'" to="/category_activate">Category</router-link>
          </li>
          <li class="nav-item " v-if="role=='user'" >
          <router-link class="nav-link active" aria-current="page" v-if="role=='user'" to="/home">Shop By Category</router-link>
          </li>
          
          <li class="nav-item " v-if="role=='store_manager'" >
          <router-link class="nav-link active" aria-current="page" to="/home">Home</router-link>
          </li>
          <li class="nav-item " v-if="role=='user'" >
          <router-link class="nav-link" aria-current="page" v-if="role=='user'" to="/display_user_cart">Cart</router-link>
          </li>
          <li class="nav-item " v-if="role=='store_manager'" >
          <router-link class="nav-link" aria-current="page" to="/stock_report">Summary</router-link>
          </li>
          <li class="nav-item " v-if="role=='admin'" >
          <router-link class="nav-link" aria-current="page" to="/user_activate">Users</router-link>
          </li>
          </ul>
          <div class="d-flex ms-auto mt-3">
          <p class="nav-item" style="font-size:25px;">
          <router-link class="btn btn-lg active me-5" aria-current="page" v-if="!is_login" to="/">Login</router-link>
        </p>
          <p class="nav-item " v-if="is_login" >
          <button class="btn btn-lg active me-5" @click='logout()' >Logout</button>
        </p>
        </div>
          
          
        
      </div>
    </div>
  </nav>
  
    `,
    data(){
        return{
        role:sessionStorage.getItem('role'),
        is_login:sessionStorage.getItem('isLogin'),
        id:sessionStorage.getItem('user-id'),

    }
    }
      ,
      methods:{
      async logout(){
        const token=await fetch(`/get/token/${this.id}`,{
          method:"POST",
        })
        const data=await token.json()
        if(data.message=="Successful"){
        const res=await fetch(`/user_logout/${this.id}`,{
          method:"POST",
          headers:{
            "Authentication-Token":data.token,
            'Content-Type':'application/json'
          }
        })
        if (res.ok){
        sessionStorage.removeItem('isLogin')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('user-id')
        this.$router.push('/')
        this.$router.go()}}
        else{
          sessionStorage.removeItem('isLogin')
          sessionStorage.removeItem('role')
          sessionStorage.removeItem('user-id')
          alert("Session Expired...Login Again!!!")
          this.$router.push('/')
          this.$router.go('/')
          
        }
    }},
}