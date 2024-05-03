export default{
    template:`
<div id="login" >
<div class="d-flex justify-content-center" style="margin-top:100px" >
<div class="mb-3 p-5 bg-light" >
<div class="text-danger" v-if="error!=null"> *{{error}} </div>
  <label for="user-email" class="form-label">UserName/Email Address</label>
  <input class="form-control" id="user-email" placeholder="Username/Email" v-model="cred.email_username">
  <label for="user-password" class="form-label">Password</label>
  <input type="password" class="form-control" id="user-password" placeholder="Atleast 10 characters" v-model="cred.password" >
  <div class="text-center">
  <button class="btn btn-primary mt-3 " @click="login">Login </button>
  </div>
  <p></p>
  <p></p>
  <p>New User?</p>
  <p></p>
  <router-link class="link active" aria-current="page" to="/register">Register!!</router-link>
  </div>
  </div>
</div>
    `,
    data(){
        return {
            cred:{
            email_username:null,
            password:null,},
            error:null,
    }},
    methods:{
        async login(){
            const res= await fetch('/user_login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(this.cred),
            })
            const data=await res.json()
            if(res.ok){
                sessionStorage.setItem('isLogin',true)
                sessionStorage.setItem('role',data.role)
                sessionStorage.setItem('user-id',data.id)
                this.$router.push({path:'/home'})
                this.$router.go()
                
                
                
            }
            else{
                this.error=data.message
            }
        },
    },
}