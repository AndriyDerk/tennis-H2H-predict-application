const axios = require('axios')
const  cheerio = require('cheerio')

class userController{
    async postStatistic(req, res, next){
        let {firstName, secondName} = req.body

        const getHTML =  async (url) =>{
            const {data} = await axios.get(url)
            return cheerio.load(data)
        }

        let arr = firstName.split(' ')
        let name1='', name2='';
        for(let i = 0; i < arr.length; i++){name1+=arr[i]+'+'}
        name1 = name1.slice(0, -1)
        arr = secondName.split(' ')
        for(let i = 0; i < arr.length; i++){name2+=arr[i]+'+'}
        name2 = name2.slice(0, -1)

        const $ = await getHTML(`https://www.ultimatetennisstatistics.com/playerProfile?name=${name1}&tab=profile`).catch(err=>{
            console.log('err')//TODO: add err
        })





        return res.json({})//TODO: add callback


    }
}

module.exports = new userController()