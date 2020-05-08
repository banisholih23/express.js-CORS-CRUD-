const { users: initialData } = require('../utils/DB')
const userModel = require('../models/users')
const qs = require('querystring')

const getPage = (_page) => {
  const page = parseInt(_page)
  if (_page > 0) {
    return page
  } else {
    return 1
  }
}

const getPerPage = (_perPage) => {
  const perPage = parseInt(_perPage)
  if (perPage && perPage > 0) {
    return perPage
  } else {
    return 5
  }
}

const getNextLinkQueryString = (page, totalPage, currentQuery) => {
  if(page < totalPage) {
    const generatedPage = {
      page: page + 1
    }
    return qs.stringify({...currentQuery, ...generatedPage })
  } else {
    return null
  }
}

const getPrevLinkQueryString = (page, currentQuery) => {
  if (page > 1) {
    const generatedPage = {
      page: page - 1
    }
    return qs.stringify({...currentQuery, ...generatedPage })
  } else {
    return null
  }
}

module.exports = {
  getAllUsers: (request, response) => {
    const { page, limit } = request.query
    const totalData = initialData.length
    const totalPage = Math.ceil(totalData / getPerPage(limit))

    const sliceStart = (getPage(page) * getPerPage(limit)) - getPerPage(limit)
    const sliceEnd = (getPage(page) * getPerPage(limit))

    const prevLink = getPrevLinkQueryString(getPage(page), request.query)
    const nextLink = getNextLinkQueryString(getPage(page), totalPage, request.query)
    const data = {
      success: true,
      msg: 'List all users data',
      data: [...initialData].slice(sliceStart, sliceEnd),
      pageInfo: {
        page: getPage(page),
        totalPage: Math.ceil(totalData / getPerPage(limit)),
        perPage: getPerPage(limit),
        totalData,
        nextLink: nextLink && `http://localhost:8080/users?${nextLink}`,
        prevLink: prevLink && `http://localhost:8080/users?${prevLink}`
      }
    }
    response.status(200).send(data)
  },
  createUser: (request, response) => {
    const { name, email } = request.body
    if (name && email !== '' && email !== '') {
      // melakukan check apakah ada user dengan email yang sama
      const isExists = userModel.getUsersByEmail(email, initialData)
      // jika tidak ada user dengan email yang sama
      if (isExists < 1) {
        // membuat user menggunakan model create user
        const result = userModel.createUser(name, email, initialData)
        if (result) {
          // response success: true
          const data = {
            success: true,
            msg: 'User has been created succcesfuy',
            data: request.bodt
          }
          response.status(201).send(data)
        } else { // jika createUser gagal
          const data = {
            success: false,
            msg: 'email has been registered'
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'all from mush be filled'
        }
        response.status(400).send(data)
      }
    }
  },
  updateUser: (request, response) => {
    const { id } = request.params
    const { name, email } = request.body
    const fetchUser = userModel.getUsersById(id, initialData)
    if (fetchUser.data.length > 0) {
      if (name && email && name !== '' && email !== '') {
        const results = userModel.updateUser(name, email, fetchUser.index, initialData)
        const data = {
          success: true,
          msg: 'User has been update',
          data: results
        }
        response.status(200).send(data)
      } else {
        const data = {
          success: false,
          msg: 'All form must be filled'
        }
        response.status(401).send(data)
      }
    }
  },
  deleteUser: (request, response) => {
    const { id } = request.params
    const fetchUser = userModel.getUsersById(id, initialData)
    if (fetchUser.data.length > 0) {
      const results = userModel.deleteUser(fetchUser.index, initialData)
      if (results) {
        const data = {
          success: true,
          msg: `user with id ${id} is deleted`
        }
        response.status(200).send(data)
      } else {
        const data = {
          success: false,
          msg: 'cannot delete data, user nt found'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'cannot delete data, user not found'
      }
      response.status(400).send(data)
    }
  }
}
