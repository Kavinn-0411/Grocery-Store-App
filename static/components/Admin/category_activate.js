export default{
    template:`
    <div id="main">

    <h3 style="position:absolute;top:50px;left:620px">STORE CATEGORIES</h3>
    <div v-if="message=='No categories found'" style="position:absolute;left:660px;top:250px;" >
    <p>No categories added</p>
    </div>
    <div class="row" style="position:absolute;left:50px;top:150px" >
  <div class="col-sm" v-for="(a,index) in category" >
  <p></p>
    <div class="card"  >
    <div class="card-body" >
      <h5 class="card-title text-center">{{a.name}}</h5>
        <p class="card-text text-center">{{a.description}}</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
        <a class="btn btn-primary " v-if="!a.is_approved" @click="category_approve(a.id)">Activate</a>
        <a class="btn btn-primary "  @click="category_remove(a.id)">Remove</a>
        </div>
    </div>
  </div>
    </div>
    

    </div>
    
    
    </div>
    `,
    data(){
        return{
            category:null,
            message:null,
        }
    },
    methods:{
     async category_approve(id){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch(`/activate/category/${id}`,{
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
        }
     }
     else{
        sessionStorage.removeItem('isLogin')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('user-id')
        alert("Session Expired...Login Again!!!")
        this.$router.push('/')
        this.$router.go('/')
      }
    },
     async category_remove(id){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch(`/remove/category/${id}`,{
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
        }
     }
     else{
        sessionStorage.removeItem('isLogin')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('user-id')
        alert("Session Expired...Login Again!!!")
        this.$router.push('/')
        this.$router.go('/')
     }
    },},
    async mounted(){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch('/api/category_creation',{
            headers:{"Authentication-Token":data1.token},
        })
        const data=await res.json()
        if(res.ok){
            this.category=data["data"]
            this.message=data["message"]
            
        }
        else{
            this.message=data["message"]
        }}
        else{
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('role')
            sessionStorage.removeItem('user-id')
            alert("Session Expired...Login Again!!!")
            this.$router.push('/')
            this.$router.go('/')
         }
    }}
