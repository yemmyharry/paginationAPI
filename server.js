const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./userSchema')

mongoose.connect('mongodb://localhost/pagination', { useUnifiedTopology: true ,  useNewUrlParser: true})
.then(console.log('database connected'))
.catch(err => err)

const db = mongoose.connection
db.once('open', async ()=>{
    if (User.countDocuments().exec() > 0 ) 
    return 
    Promise.all([
        User.create({ name: 'bill'}),
        User.create({ name: 'biull'}),
        User.create({ name: 'bijll'}),
        User.create({ name: 'birll'}),
        User.create({ name: 'bioll'}),
        User.create({ name: 'biell'}),
        User.create({ name: 'bisll'}),
        User.create({ name: 'bidll'}),
        User.create({ name: 'bitll'}),
        User.create({ name: 'binll'}),
        User.create({ name: 'bimnll'}),
        User.create({ name: 'biesll'})
    ]).then(()=>console.log('added users'))
})


// const users = [
//     {id: 1, name: 'Bill'},
//     {id: 2, name: 'Billie'},
//     {id: 3, name: 'Billy'},
//     {id: 4, name: 'Billa'},
//     {id: 5, name: 'Billed'},
//     {id: 6, name: 'Bile'},
//     {id: 7, name: 'Billr'},
//     {id: 8, name: 'Biller'},
//     {id: 9, name: 'Biil'},
//     {id: 10, name: 'Bilol'}
// ]


// app.get('/users', (req, res)=>{
//     const page = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)

//     const startIndex = (page - 1) * limit
//     const endIndex = page * limit

//     const results = {}
//     if ( endIndex < users.length){
//       results.next = {
//         page: page + 1,
//         limit: limit
//         }   
//     }
   

//     if (startIndex > 0) {
//         results.previous = {
//             page: page - 1,
//             limit: limit
//         }
//     }

//     results.users = users.slice(startIndex, endIndex)

//     res.json(results)
// })

app.get('/users', paginatedResults(User), (req, res)=>{
    res.json(res.paginated)
})

function paginatedResults(model){
    //a middleware function always takes req, res and next and thats what will be returned below
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
    
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const results = {}

        if ( endIndex < await model.countDocuments().exec()){
          results.next = {
            page: page + 1,
            limit: limit
            }   
        }
       
    
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
    
        try {
             results.users = await model.find().limit(limit).skip(startIndex).exec()
             res.paginated = results
             next()
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

app.listen(3000, ()=>{
    console.log("Server connected")
})