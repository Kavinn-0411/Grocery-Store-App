export default{
    template:
    `
    <div id="add_to_cart">
    <div class="d-flex justify-content-center" style="margin-top:10vh">
<div class="mb-3 p-5 bg-light">
<img :src=url class="card-img-top" :alt=item_id width="70" height="100">
<div class="text-danger" v-if="error!=null"> *{{error}} </div>
  <p>Quantity Available:{{quantity}}</p>
  <p>Price:{{price}}/{{qtype}}</p>
  <input type="number" class="form-control" id="q" placeholder="Enter Quantity" v-model="user_q.item_quantity" >
  <div class="text-center">
  <button class="btn btn-primary mt-3 " @click="add">Add </button>
  </div>
  </div>
  
</div>
    </div>
    `,
    data(){
        return{
        quantity:localStorage.getItem("quantity"),
        qtype:localStorage.getItem("quantity-type"),
        price:localStorage.getItem("item_rate"),
        item_name:localStorage.getItem("item-name"),
        url:localStorage.getItem("url"),
        user_q:{"item_quantity":null},
        error:null
    }},
    methods:
    {
    async add(){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch(`/api/user_cart/${this.item_name}`,{
            method:"POST",
            headers:{
                "Authentication-Token":data1.token,
                'Content-Type':'application/json'
            },
            body:JSON.stringify(this.user_q)
        })
        const data=await res.json()
        if(res.ok){
            if(data.message=="Added to cart!!"){
                
              alert(data.message)
          this.$router.push('/user_item_get') 
            localStorage.removeItem("quantity"),
           localStorage.removeItem("quantity-type"),
             localStorage.removeItem("item_rate"),
           localStorage.removeItem("item-name"),
          localStorage.removeItem("url")
          
            }
            else{
                this.error=data.message
            }
        }
    }
    else{
        sessionStorage.removeItem('isLogin')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('user-id')
        alert("Session Expired...Login Again!!!")
        this.$router.push('/')
        
      }
    
    

    }
    }
}