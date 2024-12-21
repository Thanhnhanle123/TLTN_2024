const express = require('express')
const router = express.Router()
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực
const validateRequest = require(__path_validates + 'validate')

// controller user
const userController = require(__path_controllers + 'user.controller')

// validate for user
const {
  userSchema,
  userSchemaLogin,
  userSchemaUpdate
} = require(__path_validates + 'userValidate')

// register
router.post('/register', validateRequest(userSchema), userController.register)
// login
router.post('/login', validateRequest(userSchemaLogin), userController.login)
router.post(
  "/loginAdmin",
  validateRequest(userSchemaLogin),
  userController.loginAdmin
);
router.post('/login/google', auth.authGoogle, userController.loginGoogle)
// update
router.post(
  '/update-info',
  validateRequest(userSchemaUpdate),
  auth.authenticateJWT,
  userController.updateInfo
)
// verify-email
router.get(
  '/verify-email',
  auth.authenticateJWTEmail,
  userController.verifyEmail
)

// get user information
router.get('/findById/:id', auth.authenticateJWT, userController.findById)
router.get('/registerHost/:id', userController.registerHost)
router.get(
  '/getAll',
  auth.authenticateJWT,
  auth.role('Admin'),
  userController.getAll
)
router.get(
  '/count/',
  auth.authenticateJWT,
  auth.role('Admin'),
  userController.countUser
)
// gửi link đến email để cho phep change mật khẩu mới
router.post('/forgot-password', userController.forgotPassword)
//
router.get('/reset-password/:token', userController.resetPassword)
router.post(
  '/change-password-forgot/:token',
  userController.changePasswordForgot
)

module.exports = router
