const Router = require('express')
const userRouter = require('../controllers/user.controller')

const router = new Router()

router.post('/', userRouter.postStatistic)

module.exports = router