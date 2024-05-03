export default{
    template:
    `
    <div id="main">

    <p style="position:absolute;top:75px;left:660px">Welcome Store Manager!</p>
    <div v-if="item.message" style="position:absolute;left:630px;top:250px;">
    <p>No items added</p>
    </div>


<div class="row" style="position:absolute;left:100px;top:150px"  >
  <div class="col-sm" v-for="(a,index) in item" v-if="!item.message">
    <div class="card" >
    <div class="card-body" >
    <img :src=a.image_url class="card-img-top" :alt=a.name width="70" height="100">
      <h5 class="card-title" id="a">{{a.name}}</h5>
        <p class="card-text">Quantity: {{a.quantity}} {{a.quantity_type}}</p>
        <p class="card-text">Price: ₹{{a.rate_per_unit}}/{{a.quantity_type}}</p>
        <p></p>
        <span class="d-grid gap-2 d-md-flex ">
      <button class="btn btn-primary" @click="edit(a.id,a.name,a.image_url,a.expiry_date,a.quantity,a.quantity_type,a.rate_per_unit)" >Edit </button>
      <button class="btn btn-primary "  @click="remove(a.id)">Remove</button>
      </span>
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
        }
    },
    methods:{
        async remove(id){
            const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
                method:"POST",
              })
              const data1=await token.json()
              if(data1.message=="Successful"){
            const res= await fetch(`/remove/item/${id}`,{
                headers:{
                    "Authentication-Token":data1.token
                }})
                const data=await res.json()
                if(res.ok){
                        
                        alert(data.message)
                        this.$router.go(0)
                }}
                else{
                    sessionStorage.removeItem('isLogin')
                    sessionStorage.removeItem('role')
                    sessionStorage.removeItem('user-id')
                    alert("Session Expired...Login Again!!!")
                    this.$router.push('/')
                    
                  }

        },
        async edit(id,name,url,expiry_date,quantity,quantity_type,rate_per_unit){
            localStorage.setItem("item_id",id)
            localStorage.setItem("name",name)
            localStorage.setItem("url",url)
            localStorage.setItem("expiry_date",expiry_date)
            localStorage.setItem("quantity",quantity)
            localStorage.setItem("quantity_type",quantity_type)
            localStorage.setItem("rate_per_unit",rate_per_unit)
            this.$router.push('/edit_item')
        }

    },
    async mounted(){
        const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          const data1=await token.json()
          if(data1.message=="Successful"){
        const res=await fetch(`api/create_item/${localStorage.getItem("category_id")}`,{
            headers:{"Authentication-Token":data1.token},
        })
        const data=await res.json()
        if(res.ok){
            this.item=data
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