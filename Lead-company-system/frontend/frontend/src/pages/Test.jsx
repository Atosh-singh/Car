import { useEffect } from "react"
import axios from "axios"

function Test(){

useEffect(()=>{

axios.get("http://localhost:5000/api/leads")
.then(res=>{
console.log(res.data)
})

},[])

return <h1>Test API</h1>

}

export default Test