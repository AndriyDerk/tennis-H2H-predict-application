const Router = require('express')
const userRouter = require('../controllers/user.controller')

const router = new Router()

router.get('/', userRouter.postStatistic)

module.exports = router