const express = require('express')
const router = express.Router()
const refreshTokenCOntroller = require('../../controllers/refreshTokenController')

router.route('/').get(refreshTokenCOntroller.handleRefreshToken)

module.exports = router
