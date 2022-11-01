require('dotenv').config()
const express = require('express')
const router = require(`./routers/index`)

const app = new express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use('/', router)

const start = async () =>{
    try {
        app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`))
    }catch (e){
        console.log(e)
    }
}

start()