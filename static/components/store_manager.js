export default{
    template:
    `
    <div id="main">

    <h3 style="position:absolute;top:50px;left:600px">Welcome Store Manager!</h3>
    <div v-if="message=='No categories found'" style="position:absolute;left:600px;top:250px;">
    <p>No categories added</p>
    </div>


<div class="row" style="position:absolute;left:100px;top:150px"  >
  <div class="col-sm" v-for="(a,index) in category" v-if="a.is_approved " >
    <div class="card" >
    <div class="card-body" >
      <h5 class="card-title" id="a">{{a.name}}</h5>
        <p class="card-text">{{a.description}}</p>
        <div class="text-center mb-3">
        <button class="btn btn-success btn-lg" @click="item_view(a.id)" >View Items</button>
        </div>
        <div class="text-center">
        <button class="btn btn-primary" @click="item_create(a.id)" >+</button>
        </div>
        <p></p>
        <button class="btn btn-primary" @click="edit_category(a.id)">Edit</button>
    </div>
  </div>
    </div>
</div>
    <div style="position:absolute;right:75px;bottom:75px" >
    <button class="btn btn-primary btn-lg mt-3" @click="category_create" >+</button>
    </div>
    </div>
    `,
    data(){
        return{
            category:null,
            message:null,
            token:localStorage.getItem("auth-token"),
        }
    },
    methods:{
        async category_create(){
            this.$router.push('/category_create')
        } ,
        async item_create(cat_id){
            localStorage.setItem("category_id",cat_id)
            this.$router.push('/item_create')
        } ,
        async item_view(id){
                localStorage.setItem("category_id",id)
                this.$router.push("/item_get")
            }   ,
        async edit_category(id){
            localStorage.setItem("category_id",id)
            this.$router.push("/edit_category")
            }
         
    },
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
        }}
        else{
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('role')
            sessionStorage.removeItem('user-id')
            alert("Session Expired...Login Again!!!")
            this.$router.push('/')
            
          }

       
   },
}   