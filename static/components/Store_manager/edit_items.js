export default{
    template:`
    <div id="main">
    <div class="card-body p-4 p-md-5">
            <h3 class="mb-4 pb-2 pb-md-0 mb-md-5">Item Creation</h3>
            <form>

              <div   class="row g-3 needs-validation">
                <div class="col-md-6 mb-4">

                  <div class="form-outline">
                  <label class="form-label" for="itemname">Item Name</label>
                    <input type="text" id="itemname" class="form-control form-control-lg " v-model="item.name"  />
                  </div>
                  <div class="form-outline">
                  <label class="form-label" for="q_type">Quantity_type</label>
                    <input type="text" id="q_type" class="form-control form-control-lg " v-model="item.quantity_type" />
                  </div>
                  <div class="form-outline">
                  <label class="form-label" for="price">Rate per unit</label>
                    <input type="number" id="price" class="form-control form-control-lg " v-model="item.rate_per_unit" />
                  </div>
                  <div class="form-outline">
                  <label class="form-label" for="q">Quantity</label>
                    <input type="number" id="q" class="form-control form-control-lg " v-model="item.quantity" />
                  </div>
                  <div class="form-outline">
                  <label class="form-label" for="itemurl">Image Url</label>
                    <input type="text" id="itemurl" class="form-control form-control-lg " v-model="item.image_url" />
                  </div>
                  <div class="form-outline">
                  <label class="form-label" for="edate">Expiry Date</label>
                    <input type="date" id="Expiry Date" class="form-control form-control-lg " v-model="item.expiry_date" required/>
                  </div>
                    <div class="mb-4 pt-2 text-center">
                <input class="btn btn-primary btn-lg" type="submit" value="Edit" @click="edit_item"/>
                <input class="btn btn-danger btn-lg" type="submit" value="cancel" @click="cancel"/>
              </div>
                  </div> </div></form></div>
    </div>
    `,
    data(){
        return{
            item:{
                name:localStorage.getItem("name"),
                quantity_type:localStorage.getItem("quantity_type"),
                image_url:localStorage.getItem("url"),
                rate_per_unit:localStorage.getItem("rate_per_unit"),
                quantity:localStorage.getItem("quantity"),
                expiry_date:null
            },
            token:localStorage.getItem("auth-token"),
            id:localStorage.getItem("item_id")
        }
    },
    methods:{
        async edit_item(){
          const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          const data1=await token.json()
          if(data1.message=="Successful"){
            const res=await fetch(`api/edit_item/${this.id}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authentication-Token':data1.token
                },
                body:JSON.stringify(this.item),
            })
            const data=await res.json()
            if(res.ok){
            alert(data.message)
            localStorage.removeItem("item_id"),
            localStorage.removeItem("name"),
            localStorage.removeItem("url"),
            localStorage.removeItem("expiry_date"),
            localStorage.removeItem("quantity"),
           localStorage.removeItem("quantity_type"),
           localStorage.removeItem("rate_per_unit")
            this.$router.push('home')
    }}
    else{
      sessionStorage.removeItem('isLogin')
      sessionStorage.removeItem('role')
      sessionStorage.removeItem('user-id')
      alert("Session Expired...Login Again!!!")
      this.$router.push('/')
      
    }

},
async cancel(){
  localStorage.removeItem("item_id"),
            localStorage.removeItem("name"),
            localStorage.removeItem("url"),
            localStorage.removeItem("expiry_date"),
            localStorage.removeItem("quantity"),
           localStorage.removeItem("quantity_type"),
           localStorage.removeItem("rate_per_unit")
            this.$router.push('home')
}
}
}