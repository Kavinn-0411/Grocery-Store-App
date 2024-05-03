export default{
    template:`
    <div id="main">

    <h3 style="position:absolute;top:50px;left:660px">Users</h3>
    <div v-if="users.message" style="position:absolute;left:660px;top:250px;" >
    <p>No users added</p>
    </div>
    <div class="col" style="position:absolute;left:200px;top:150px"  >
    <h5 class="text-center">Store Managers</h5>
    <br>
  <div class="row-sm"  v-for="(a,index) in users" v-if="a.roles[0][6]==2" >
  <p></p>
    <div class="card"  >
    <div class="card-body" >
      <h5 class="card-text">{{a.email}}</h5>
      <span class="d-grid gap-2 d-md-flex ">
      <button class="btn btn-primary" v-if="!a.active"  @click="smanager_approve(a.id)">Activate </button>
      <button class="btn btn-primary "  @click="user_remove(a.id)">Remove</button>
      </span>
    </div>
  </div>
    </div>
    </div>

    <div class="col" style="position:absolute;left:860px;top:150px"  >
    <h5 class="text-center">Customers</h5>
    <br>
    <div class="row-sm"  v-for="(a,index) in users" v-if="a.roles[0][6]==3" >
    <p></p>
      <div class="card"  >
      <div class="card-body" >
        <h5 class="card-text">{{a.email}}</h5>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
        <a class="btn btn-primary "  @click="user_remove(a.id)">Remove</a>
        </div>
      </div>
    </div>
      </div>
      </div>
    
    
    </div>
    `,
    data(){
        return{
            users:null,
            token:localStorage.getItem("auth-token")
        }
    },
    methods:{
     async smanager_approve(id){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch(`/activate/storemanager/${id}`,{
            headers:{
                "Authentication-Token":data1.token,
            },
        })
        const data=await res.json()
        if(res.ok){
            alert(data.message)
            this.$router.go(0)
        }
        else{
            this.category=null
        }}
        else{
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('role')
            sessionStorage.removeItem('user-id')
            alert("Session Expired...Login Again!!!")
            this.$router.push('/')
            this.$router.go('/')
         }
     },
     async user_remove(id){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch(`/remove/users/${id}`,{
            headers:{
                "Authentication-Token":data1.token,
            },
        })
        const data=await res.json()
        if(res.ok){
            alert(data.message)
            this.$router.go(0)
        }
        else{
        this.category=null
        }}
        else{
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('role')
            sessionStorage.removeItem('user-id')
            alert("Session Expired...Login Again!!!")
            this.$router.push('/')
            this.$router.go('/')
         }
     }
    },
    async mounted(){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch('/api/user_register',{
            headers:{"Authentication-Token":data1.token},
        })
        const data=await res.json()
        if(res.ok){
            this.users=data
        }
        else{
            this.users=null
        }}
        else{
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('role')
            sessionStorage.removeItem('user-id')
            alert("Session Expired...Login Again!!!")
            this.$router.push('/')
            this.$router.go('/')
         }
   },
}