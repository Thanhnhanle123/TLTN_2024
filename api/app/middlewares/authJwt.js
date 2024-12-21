require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const { JWT_ISSUER, JWT_TOKEN, JWT_TOKEN_TIME } = require(__path_configs +
  'token')
const identifier = require(__path_configs + 'identifierRole')
const { checkType } = require(__path_common + 'check')
const usersModel = require(__path_models + 'user.model') // Nhập mô hình người dùng từ thư mục mô hình

const client_id = process.env.GG_CLIENT_ID
const client = new OAuth2Client(client_id)

const verifyToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client_id
    })
    return ticket.getPayload() // Extract and return payload
  } catch (error) {
    throw error
  }
}

// Function to compare a password with its hashed version
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Create an encoded JWT token for the user
 * @param {string} userId - The ID of the user
 * @returns {string} - Encoded JWT token
 */
const encodedToken = userId => {
  return jwt.sign(
    {
      iss: JWT_ISSUER,
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_TOKEN_TIME * 24 * 60 * 60
    },
    JWT_TOKEN
  )
}

// Middleware for authenticating JWT
const authenticateJWT = (req, res, next) => {
  console.log(req.header('Authorization'))
  const token = req.header('Authorization')?.split(' ')[1]
  if (token) {
    jwt.verify(token, JWT_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' })
      }
      req.user = user
      next()
    })
  } else {
    res.status(401).json({ message: 'No authentication token provided' })
  }
}

// Middleware for authenticating JWT from query
const authenticateJWTEmail = (req, res, next) => {
  const token = req.query.token
  if (token) {
    jwt.verify(token, JWT_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' })
      }
      req.user = user
      next()
    })
  } else {
    res.status(401).json({ message: 'No authentication token provided' })
  }
}

const role = requiredRole => async (req, res, next) => {
  try {
    const requiredRoleNew =
      checkType(requiredRole) == 'string'
        ? identifier(requiredRole)
        : requiredRole
    var user = await usersModel.findByPk(req.user.sub)

    if (user) {
      user = user.dataValues
    } else {
      // Nếu vị trí không tìm thấy
      return { status: 409, message: 'Người dùng không tồn tại', data: [] } // Trả về thông báo lỗi
    }
    // Check if the user is authenticated and has a role
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: User not authenticated' })
    }

    // Check if the user's role matches the required role
    if (user.role < requiredRoleNew) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Insufficient role privileges' })
    }

    // User is authorized for this role
    next()
  } catch (error) {
    next(error)
  }
}

// Middleware for Google authentication
const authGoogle = async (req, res, next) => {
  try {
    const { token } = req.body
    if (token) {
      const decoded = jwt.decode(token, { complete: true })
      if (Math.floor(Date.now() / 1000) > decoded.payload.exp) {
        return res.status(403).json({ message: 'Invalid token' })
      }
      const payload = await verifyToken(token)
      req.payload = payload
      next()
    } else {
      res.status(401).json({ message: 'No authentication token provided' })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  comparePassword,
  encodedToken,
  authenticateJWT,
  authenticateJWTEmail,
  authGoogle,
  role
}
