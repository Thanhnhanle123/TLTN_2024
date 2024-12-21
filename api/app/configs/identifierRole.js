const identifier = name => {
  var role = 0
  switch (name) {
    case 'admin':
    case 'Admin':
      role = 1
      break
    case 'host':
    case 'Host':
      role = 2
      break
    default:
      break
  }
  return role
}

module.exports = identifier
