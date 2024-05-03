export default{
    template:`
    <div>
  <div class="container py-5 h-100">
    <div class="row justify-content-center align-items-center h-100">
      <div class="col-12 col-lg-9 col-xl-7">
        <div class="card shadow-2-strong card-registration" style="border-radius: 15px;">
          <div class="card-body p-4 p-md-5">
            <h3 class="mb-4 pb-2 pb-md-0 mb-md-5">Store Manager Registration Form</h3>

              <div class="row">
                <div class="col-md-6 mb-4">

                  <div class="form-outline">
                  <label class="form-label" for="username">Username</label>
                    <input type="text" id="username" class="form-control form-control-lg " v-model="user.username" required/>
                  </div>

                  <div class="form-outline">
                  <label class="form-label"  for="email" >Email</label>
                    <input  id="email" type="email" class="form-control form-control-lg" v-model="user.email" required/>
                    </div>

                  <div class="form-outline">
                  <label class="form-label" for="password">Password</label>
                 <input type="password" id="password" class="form-control form-control-lg" v-model="user.password" required/>
                  </div>

                </div>

                </div>
              </div>
              <div class="mb-4 pt-2 text-center">
                <input class="btn btn-primary btn-lg" type="submit" value="Submit" @click="create_user"/>
              </div>

         
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    `,

data(){
    return{
        user:{
            username: null,
            email: null,
            password:null,
            

        },
    }

},
methods:{
    async create_user(){
        const res=await fetch('api/storemanager_register',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(this.user),
        })
        const data=await res.json()
        if(res.ok){
            this.$router.push({path:'/'})
            alert(data.message)
        }
    }
}
}