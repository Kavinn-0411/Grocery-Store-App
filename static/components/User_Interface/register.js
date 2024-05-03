export default{
    template:`
 <div id="main">
  <div class="container py-5 h-100" >
    <div class="row justify-content-center align-items-center h-100">
      <div class="col-12 col-lg-9 col-xl-7">
        <div class="card shadow-2-strong card-registration" style="border-radius: 15px;" id="register">
          <div class="card-body p-4 p-md-5">
            <h3 class="mb-4 pb-2 pb-md-0 mb-md-5">Registration Form</h3>
            <form class="row g-3 needs-validation">
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
                  <div class="form-outline ">
                  <label for="birthdayDate" class="form-label">Birthday</label>
                 <input type="date" class="form-control form-control-lg" id="birthdayDate" />
                  </div>


                  <div class="form-outline">
                  <label class="form-label" for="password">Password</label>
                 <input type="password" id="password" class="form-control form-control-lg" v-model="user.password" required/>
                  </div>
              </div>
              <div class="col-md-6 " style=";">
              <img src="https://nammamaligai.com/wp-content/uploads/2022/08/nm-.jpg"  height="325" width="330" alt="Registration Image" />
            </div>
              </div>
              <p>
              <div class="mb-4 pt-2 text-center">
                <input class="btn btn-primary btn-lg" type="submit" value="Submit" @click="create_user"/>
              </div>

            </form>
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
        const res=await fetch('api/user_register',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(this.user),
        })
        const data=await res.json()
        if(res.ok){
            alert(data.message)
            this.$router.push({path:'/'})
            
        }
    }
}
}