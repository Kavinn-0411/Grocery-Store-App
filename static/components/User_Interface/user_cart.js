export default{
    template:`
    <div id="main">
    <img src="https://png.pngtree.com/png-clipart/20190920/original/pngtree-shopping-cart-convenient-icon-png-image_4637407.jpg"
    width="50px" height="40px" style="position:absolute;top:50px;left:650px" >
    <h3  style="position:absolute;top:50px;left:700px">CART</h3>
    <div v-if="message" style="position:absolute;top:150px;left:580px">
    <h4  >{{message}}</h4>
    <router-link to="/home" style="position:relative;left:50px">Continue Shopping</router-link>
    </div>
    <div class="col" style="position:absolute;left:100px;top:150px">
<div class="row-sm" v-for="t in transactions">
<div class="card">
<div v-if="!t.status">
<h5 class="card-title text-center bg-secondary">{{t.item_name}}</h5>
Quantity:{{t.item_quantity}}<br>
Amount:₹ {{t.amount}}<br>
<button class="btn btn-primary mt-2 " @click="remove(t.transaction_id)">Remove From Cart </button>
</div>
</div>
<br>
<br>
</div>
   
<div v-if="total_amount" style="position:relative;left:500px;top:50px">
<h5 >Total Amount:₹ {{total_amount}}</h5>
<br>
<button class="btn btn-success text-end " @click="purchase">Confrim Purchase</button>
</div>
</div>
    </div>
    
    `,
data(){
    return{
        transactions:null,
        total_amount:null,
        message:null
    }
},
methods:{
 async remove(id){
    const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
        method:"POST",
      })
      const data1=await token.json()
      if(data1.message=="Successful"){
    const res=await fetch(`/remove/cart/${id}`,{
        method:"POST",
        headers:{
            "Authentication-Token":data1.token,
            'Content-Type':'application/json'
        },
    })
    const data=await res.json()
    if(res.ok){
        alert(data.message)
        this.$router.go()
    }}
    else{
        sessionStorage.removeItem('isLogin')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('user-id')
        alert("Session Expired...Login Again!!!")
        this.$router.push('/')
        
      }

},
async purchase(){
    const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
        method:"POST",
      })
      const data1=await token.json()
      if(data1.message=="Successful"){
    const res=await fetch(`api/user_purchase`,{
        method:"POST",
        headers:{
            "Authentication-Token":data1.token,
            'Content-Type':'application/json'
        },
    })
    const data=await res.json()
    if(data.message="Purchase Successfull!!"){
        alert(data.message)
        this.$router.push('/home')
    }
    else{
        alert(data.message)
    }
      }
      else{
        sessionStorage.removeItem('isLogin')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('user-id')
        alert("Session Expired...Login Again!!!")
        this.$router.go()
        this.$router.push('/')
        
      }


}
},
    async mounted(){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch('/user_cart',{
            headers:{
                "Authentication-Token":data1.token

            }
        })
        const data=await res.json()
        if(res.ok){
           this.transactions=data.data
           this.total_amount=data.total_amount
        }
        else{
            this.message="Your Grocery Cart is empty now."
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
