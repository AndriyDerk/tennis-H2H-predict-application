const axios = require('axios')
const  cheerio = require('cheerio')

const date = new Date();

class userController{
    async postStatistic(req, res, next) {
        try{
            let {firstName, secondName, groundType, currentScore} = req.body

            if(!groundType)groundType='overall';
            if(!currentScore)res.json("error")

                let firstArr = [], secondArr = []

            const getHTML =  async (url) =>{
                const response = await axios.get(url)
                return cheerio.load(response.data)
            }

            const typeOfGround = ['indoors', 'hard', 'grass', 'clay']
            const getGround = (string)=>{
                let position = -1
                for(let i = 0; i < typeOfGround.length; i++){
                    position = string.search(typeOfGround[i])
                    if(position>0)return typeOfGround[i]
                }
                return 'overall'
            }

            const getScore = (string)=>{
                let newString ='', tf=0
                for(let i = 0; i<string.length; i++){
                    if(string[i]=='<')tf+=3;
                    else
                    if(string[i]=='/')tf-=2;
                    else
                    if(string[i]=='>')tf-=2
                    else
                    if(!tf && string[i]!=',')newString+=string[i];
                }
                return newString
            }

            firstName = firstName.toLowerCase()
            secondName = secondName.toLowerCase()
            firstName = firstName.replace(' ','-')
            secondName = secondName.replace(' ','-')

            const alongNYears = process.env.ALONGNYEARS
            let value
            for(let i = date.getFullYear(); i > date.getFullYear()-5; i--){
                const firstPlayerData = await getHTML(`https://www.tennisexplorer.com/player/${firstName}/?annual=${i}`).catch(err=>{
                    return res.json("error")
                })
                const secondPlayerData = await getHTML(`https://www.tennisexplorer.com/player/${secondName}/?annual=${i}`).catch(err=>{
                    return res.json("error")
                })
                firstPlayerData('tr.one').each( (i, el) => {//firstPlayer statistic by 'one'
                    if(firstPlayerData(el).find('strong').text().toLowerCase().search(firstName.replace('-', ' '))>-1)
                    {
                        value = firstPlayerData(el).find('td.t-name').text().split('-')

                        let name = firstPlayerData(el).find('td.t-name').text().toLowerCase()
                        let score = getScore(firstPlayerData(firstPlayerData(el).find('td.tl')).find('a').html())
                        score = score.split(" ");
                        if(name.search(firstName.replace('-', ' '))>0){
                            score.forEach((point, j)=>{
                                point = point.split('-')
                                score[j]=point[1]+'-'+point[0]
                            })
                        }

                        firstArr.push({
                            "ground": getGround(firstPlayerData(el).html()),
                            "score": score,
                        })



                    }
                })

                firstPlayerData('tr.two').each( (i, el) => {//firstPlayer statistic by 'two'
                    if(firstPlayerData(el).find('strong').text().toLowerCase().search(firstName.replace('-', ' '))>-1)
                    {
                        value = firstPlayerData(el).find('td.t-name').text().split('-')

                        let name = firstPlayerData(el).find('td.t-name').text().toLowerCase()
                        let score = getScore(firstPlayerData(firstPlayerData(el).find('td.tl')).find('a').html())
                        score = score.split(" ");
                        if(name.search(firstName.replace('-', ' '))>0){
                            score.forEach((point, j)=>{
                                point = point.split('-')
                                score[j]=point[1]+'-'+point[0]
                            })
                        }

                        firstArr.push({
                            "ground": getGround(firstPlayerData(el).html()),
                            "score": score,
                        })



                    }
                })

                /****************************************************/

                secondPlayerData('tr.one').each( (i, el) => {//secondPlayer statistic by 'one'
                    if(secondPlayerData(el).find('strong').text().toLowerCase().search(secondName.replace('-', ' '))>-1)
                    {
                        value = secondPlayerData(el).find('td.t-name').text().split('-')

                        let name = secondPlayerData(el).find('td.t-name').text().toLowerCase()
                        let score = getScore(secondPlayerData(secondPlayerData(el).find('td.tl')).find('a').html())
                        score = score.split(" ");
                        if(name.search(secondName.replace('-', ' '))>0){
                            score.forEach((point, j)=>{
                                point = point.split('-')
                                score[j]=point[1]+'-'+point[0]
                            })
                        }

                        secondArr.push({
                            "ground": getGround(secondPlayerData(el).html()),
                            "score": score,
                        })



                    }
                })

                secondPlayerData('tr.two').each( (i, el) => {//secondPlayer statistic by 'two'
                    if(secondPlayerData(el).find('strong').text().toLowerCase().search(secondName.replace('-', ' '))>-1)
                    {
                        value = secondPlayerData(el).find('td.t-name').text().split('-')

                        let name = secondPlayerData(el).find('td.t-name').text().toLowerCase()
                        let score = getScore(secondPlayerData(secondPlayerData(el).find('td.tl')).find('a').html())
                        score = score.split(" ");
                        if(name.search(secondName.replace('-', ' '))>0){
                            score.forEach((point, j)=>{
                                point = point.split('-')
                                score[j]=point[1]+'-'+point[0]
                            })
                        }

                        secondArr.push({
                            "ground": getGround(secondPlayerData(el).html()),
                            "score": score,
                        })
                    }
                })

            }

            /************************************************/

            let tf=0
            let firstResults = [], secondResults = [], firstResultsOverall = [], secondResultsOverall = [], sum1Overall=0, sum2Overall=0, sum1=0, sum2=0
            for(let i = 0; i < firstArr.length; i++){//calculate for firstPerson
                for(let j = 0; j < firstArr[i].score.length-1; j++){
                    if(firstArr[i].score[j]===currentScore){
                        sum1Overall++
                        if(groundType===firstArr[i].ground){
                            sum1++
                            tf=0
                            firstResults.forEach((point)=>{
                                if(point.score===firstArr[i].score[j+1]){
                                    point.number++;
                                    tf=1
                                }
                            })
                            if(!tf){
                                firstResults.push({
                                    'score': firstArr[i].score[j+1],
                                    'number': 1
                                })
                            }
                        }
                        tf=0
                        firstResultsOverall.forEach((point)=>{
                            if(point.score===firstArr[i].score[j+1]){
                                point.number++;
                                tf=1
                            }
                        })
                        if(!tf){
                            firstResultsOverall.push({
                                'score': firstArr[i].score[j+1],
                                'number': 1
                            })
                        }

                    }
                }
            }

            for(let i = 0; i < secondArr.length; i++){//calculate for secondPerson
                for(let j = 0; j < secondArr[i].score.length-1; j++){
                    if(secondArr[i].score[j]===currentScore){
                        sum2Overall++
                        if(groundType===secondArr[i].ground){
                            sum2++
                            tf=0
                            secondResults.forEach((point)=>{
                                if(point.score===secondArr[i].score[j+1]){
                                    point.number++;
                                    tf=1
                                }
                            })
                            if(!tf){
                                secondResults.push({
                                    'score': secondArr[i].score[j+1],
                                    'number': 1
                                })
                            }
                        }
                        tf=0
                        secondResultsOverall.forEach((point)=>{
                            if(point.score===secondArr[i].score[j+1]){
                                point.number++;
                                tf=1
                            }
                        })
                        if(!tf){
                            secondResultsOverall.push({
                                'score': secondArr[i].score[j+1],
                                'number': 1
                            })
                        }

                    }
                }
            }

            firstResults.sort(function(a, b) {
                return b.number - a.number ;
            });

            firstResultsOverall.sort(function(a, b) {
                return b.number - a.number ;
            });

            secondResults.sort(function(a, b) {
                return b.number - a.number ;
            });

            secondResultsOverall.sort(function(a, b) {
                return b.number - a.number ;
            });

            firstResults.forEach((point)=>{
                point.number=((point.number/sum1)*100).toFixed(2)+'%'
            })

           secondResults.forEach((point)=>{
                point.number=((point.number/sum2)*100).toFixed(2)+'%'
           })

            firstResultsOverall.forEach((point)=>{
                point.number=((point.number/sum1Overall)*100).toFixed(2)+'%'
            })

            secondResultsOverall.forEach((point)=>{
                point.number=((point.number/sum2Overall)*100).toFixed(2)+'%'
            })
            return res.json({"firstResults": firstResults, "firstResultsOverall": firstResultsOverall, "secondResults": secondResults, "secondResultsOverall": secondResultsOverall})
        }catch (err){
            return res.json("error")
        }

    }
}

module.exports = new userController()