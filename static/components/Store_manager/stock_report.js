export default{
    template:`
    <div id="main">
    <h3>Get Stock Report Data!</h3><br>
    <button @click="download_csv">Download Csv</button><span v-if="isWaiting">Waiting....</span>
    </div>
    
    `,
    data(){
        return{
            isWaiting:false,
        }

    },
    methods:{
        async download_csv(){
            this.isWaiting=true
            const token=await fetch(`/get/token/${sessionStorage.getItem("user-id")}`,{
                method:"POST",
              })
              const data1=await token.json()
              if(data1.message=="Successful"){
            const res=await fetch('/download-csv',{
                headers:{
                    "Authentication-Token":data1.token
                }
            })
            const data=await res.json()
            if(res.ok){
                const taskid=data["task-id"]
                const intv=setInterval(async()=>{
                    const csv_res=await fetch(`/get-csv/${taskid}`)
                    if (csv_res.ok){
                        this.isWaiting=false
                        clearInterval(intv)
                        window.location.href=`/get-csv/${taskid}`
                        alert("Download Complete!")
                    }
                },1000
                
                )
            }
        }
    }
    }

}