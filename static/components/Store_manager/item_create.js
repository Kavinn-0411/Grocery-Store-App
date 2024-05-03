export default{
    template:`
    <div id="main">
    <div class="card-body p-4 p-md-5">
            <h3 class="mb-4 pb-2 pb-md-0 mb-md-5">Item Creation</h3>
            <form>

              <div class="row">
                <div class="col-md-6 mb-4">

                  <div class="form-outline">
                  <label class="form-label" for="itemname">Item Name</label>
                    <input type="text" id="itemname" class="form-control form-control-lg " v-model="item.name" />
                  </div>
                  <br>
                  <div class="input-group mb-3">
    <div class="input-group-prepend">
    <label class="input-group-text" for="inputGroupSelect01">Quantity Type</label>
  </div>
  <select class="custom-select" id="inputGroupSelect01" v-model="item.quantity_type">
    <option selected>Choose...</option>
    <option value="Kg">Kg</option>
    <option value="Litre">Ltr</option>
    <option value="Unit">Unit</option>
  </select>
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
                    <input type="date" id="Expiry Date" class="form-control form-control-lg " v-model="item.expiry_date" />
                  </div>
                    <div class="mb-4 pt-2 text-center">
                <input class="btn btn-primary btn-lg" type="submit" value="Create" @click="create_item"/>
              </div>
                  </div> </div></form></div>
    </div>
    `,
    data(){
        return{
            item:{
                name:null,
                quantity_type:null,
                image_url:null,
                rate_per_unit:null,
                quantity:null,
                expiry_date:null
            },
            token:localStorage.getItem("auth-token"),
            cat_id:localStorage.getItem("category_id")
        }
    },
    methods:{
        async create_item(){
          const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
            method:"POST",
          })
          const data1=await token.json()
          if(data1.message=="Successful"){
            const res=await fetch(`api/create_item/${this.cat_id}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authentication-Token':data1.token
                },
                body:JSON.stringify(this.item),
            })
            const data=await res.json()
            if(res.ok){
            localStorage.removeItem("category_id")
            alert(data.message)
            this.$router.go(0)
    }
    else{
        alert(data.message)
    }}

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