export default{
    template:`
    <div id="main">
    <div class="card-body p-4 p-md-5">
            <h3 class="mb-4 pb-2 pb-md-0 mb-md-5">Category Creation</h3>
            <form>

              <div class="row">
                <div class="col-md-6 mb-4">

                  <div class="form-outline">
                  <label class="form-label" for="categoryname">Category Name</label>
                    <input type="text" id="categoryname" class="form-control form-control-lg " v-model="category.name" />
                  </div>

                  <div class="form-outline">
                  <label class="form-label"  for="description" >Description</label>
                    <input type="text" id="description" class="form-control form-control-lg" v-model="category.description"/>
                    </div>
                    <div class="mb-4 pt-2 text-center">
                <input class="btn btn-primary btn-lg" type="submit" value="Create" @click="create_category"/>
              </div>
                    </div> </div></form></div>
    </div>
    `,
    data(){
        return{
            category:{
                name:null,
                description:null
            },
        }
    },
    methods:{
        async create_category(){
            const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
                method:"POST",
              })
              const data1=await token.json()
              if(data1.message=="Successful"){
            const res=await fetch('/api/category_creation',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authentication-Token':data1.token
                },
                body:JSON.stringify(this.category),
            })
            const data=await res.json()
            if(res.ok){
               alert(data.message)
               this.$router.go()
            }
         }
         else{
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('role')
            sessionStorage.removeItem('user-id')
            alert("Session Expired...Login Again!!!")
            this.$router.push('/')
            
          }
        
        
        },
  
    }
}