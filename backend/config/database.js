const mongoose = require('mongoose')

const connectToDB = async()=>{
    try{
        mongoose.connect(process.env.DB_URL).then(()=>
            console.log('Database Successfully Connected')
        ).catch((e)=>console.log("Some Error Occured",e))
    }
    catch(e){
        console.error("Internal Server Error",e)
    }
}

module.exports=connectToDB