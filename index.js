const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: false})) //midleware

app.get('/', (request, response) => {
  const data = {
    nama: 'Bani',
    lastname: 'sholih'
  }
  response.send(data)
})

//impoted route
const users = require('./src/routes/users')

app.use('/users', users)

app.get('*', (request, response) => {
  response.sendStatus(404).send('page not found')
})

// app.post('/users', (request, response) => {
//   console.log(request.body)
//   response.status(201).send({
//     msg: `Hello ${request.body.username}! Welcome to our backend`
//   })
// })



//Create, read , update, delete
//POST, GET, PUT/PATCH, DEELETE

app.listen(8080, () => {
  console.log('Express app is listening on 8080 port')
})
