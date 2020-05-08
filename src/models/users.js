module.exports = {
  createUser: (name, email, data) => {
    const userData = {
      id: new Date().getTime(),
      name,
      email
    }
    if (data.push(userData)) {
      return true
    } else {
      return false
    }
  },
  getUsersById: (id, data = []) => {
    let idx = null 
    const userData = data.filter((user, index) => {
      if(user.id === parseInt(id)) {
        idx = index
        return user.id === parseInt(id)
      }
    })
    return {data: userData, index: idx}
  },
  getUsersByEmail: (email, data = []) => {
    return data.filter(user => {
      return user.email === email
    })
  },
  getUsersByName: (name, data = []) => {
    return data.filter(user => {
      return user.name === name
    })
  },
  updateUser: (name, email, index, data = []) => {
    const oldData = data
    const newData = {
      name,
      email
    }
    const asignData = {...oldData, ...newData}
    data[index] = asignData
    return asignData
  },
  deleteUser: (index, data = []) => {
    delete data[index]
    data = data.filter(object => object)
    return true
  }
}