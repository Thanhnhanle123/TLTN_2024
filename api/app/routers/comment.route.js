const express = require('express')
const router = express.Router()
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực

// controller comment
const commentController = require(__path_controllers + 'comment.controller')

// get comment information
router.get(
  '/getall/',
  auth.authenticateJWT,
  auth.role('Admin'),
  commentController.getAll
)

router.get('/getCommentByHotelId/:id', commentController.getCommentByHotelId)
router.get('/delete/:id', commentController.deleteComment)
// Add route to create a comment
router.post('/create', auth.authenticateJWT, commentController.createComment)
module.exports = router
