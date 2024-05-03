export default{
    template:
    `
    <div id="main">

    <h3 style="position:absolute;top:50px;left:600px">Search For Products</h3>
    <div v-if="message" style="position:absolute;left:630px;top:250px;">
    <p>No items added</p>
    </div>


<div class="row" style="position:absolute;left:100px;top:150px">
<div>
<input type="search" v-model="search" placeholder="search" style="position:absolute;left:900px" >
</div>
<div class="dropdown" style="position:absolute;left:1200px">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Filter
  </button>
  <ul class="dropdown-menu">
    <li><button class="btn btn-primary dropdown-item" @click="filter(1)">High to Low</button></li>
    <li><button class="btn btn-primary dropdown-item" @click="filter(2)">Low to High</button></li>
    
  </ul>
</div>
<br><br><br>
  <div class="col-sm" v-for="(a,index) in search_item()" v-if="!item.message" :key="index">
    <div class="card" >
    <img :src=a.image_url class="card-img-top" :alt=a.name width="70" height="100">
    <div class="card-body" >
      <h5 class="card-title" :id="'cardTitle_' + index">{{a.name}}</h5>
        <p class="card-text">Price:{{a.rate_per_unit}}/{{a.quantity_type}}</p>
        <p></p>
        <p class="card-text">Quantity Available:{{a.quantity}}</p>
        <p></p>
        <p></p>
        <div v-if="a.quantity!=0">
        <button class="btn btn-primary" @click="purchase(a.name,a.quantity,a.rate_per_unit,a.quantity_type,a.image_url)">Add to cart</button>
        </div>      
        <div lass="text-centre" v-if="a.quantity==0" style="color:red;">
        <p>Out of Stock !</p>
        </div>    
        </div>

  </div>
    </div>
</div>
    
    </div>
    `,
    data(){
        return{
            item:null,
            token:localStorage.getItem("auth-token"),
            search:null,
            quantity:null,
            message:null
        }
    },
    methods:{
        async purchase(item_name,item_q,item_rate,item_qtype,url){
            localStorage.setItem("item-name",item_name)
            localStorage.setItem("quantity",item_q)
            localStorage.setItem("item_rate",item_rate)
            localStorage.setItem("quantity-type",item_qtype)
            localStorage.setItem("url",url)
            this.$router.push('/item_purchase')

        },
        search_item: function(){

          if(this.search==null){
              return this.item
          }
          else{
              return this.item.filter((a) =>
              a.name.toLowerCase().includes(this.search.toLowerCase()))
          }
         
        ;

      },

      async filter(id){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch(`api/filter_item/${localStorage.getItem("category_id")}/${id}`,{
          method:"POST",
            headers:{"Authentication-Token":data1.token},
        })
        const data=await res.json()
        if(res.ok){
            this.item=data
        }
        else{
            this.message=data.message
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


}

    },
    async mounted(){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch(`api/get_item/${localStorage.getItem("category_id")}`,{
            headers:{"Authentication-Token":data1.token},
        })
        const data=await res.json()
        if(res.ok){
            this.item=data
        }
        else{
            this.message=data.message
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
}