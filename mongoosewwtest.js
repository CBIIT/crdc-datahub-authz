const mongoose = require('mongoose');
// var uri = "mongodb://wwadmin:1234abcd@127.0.0.1:27017/test?retryWrites=true"
var uri = "mongodb://127.0.0.1:27017/User"
var uri2 = "mongodb://localhost:27017"

const Schema = mongoose.Schema;


const testtt = new Schema({
// const eventSchema = new Schema({
    firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  IDP: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

// const testtt = new mongoose.Schema({
//     firstName:String
// })
const testModel = mongoose.model('User', testtt )

mongoose.connect(uri)
    .then(()=>{
        console.log('Yes')
    })
    .catch(err =>{
        console.log(err)
    })

// const jfeijfie = testModel.findOne()
const jfeijfie = testModel.find({firstName:"Johdn"})
console.log(jfeijfie)

