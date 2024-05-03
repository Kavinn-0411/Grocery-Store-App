export default{
    template:
    `
    <div id="main">
    <h4 style="position:absolute;top:50px;left:630px">Welcome To Grocery Store</h4>
    <div v-if="message=='No categories found'" style="position:absolute;left:600px;top:250px;">
    <p>Shop Open Soon !!!</p>
    </div>

 

<div class="row" style="position:absolute;left:100px;top:150px"  >
<div>
<input type="search" v-model="search" placeholder="search" style="position:absolute;left:1200px" >
</div>
<br><br><br>
<div class="col-sm" v-for="(a,index) in search_cat()" v-if="a.is_approved " >
<div class="card" >
<div class="card-body" >
  <h5 class="card-title" id="a">{{a.name}}</h5>
    <p class="card-text">{{a.description}}</p>
    <div class="text-center mb-3">
    <button class="btn btn-success btn-lg" @click="item_view(a.id)" >View Items</button>
    </div>
    <p></p>
</div>
</div>
</div>

</div>
</div>

    `,
    data(){
        return{
            category:null,
            token:localStorage.getItem("auth-token"),
            search:null,
            list:null,
            message:null
        }
    },
    methods:{
       
        async item_view(id){
                localStorage.setItem("category_id",id)
                this.$router.push("/user_item_get")
            }   ,
        
            search_cat: function(){

                if(this.search==null){
                    return this.category
                }
                else{
                    return this.category.filter((a) =>
                    a.name.toLowerCase().includes(this.search.toLowerCase()))
                }
               
              ;

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