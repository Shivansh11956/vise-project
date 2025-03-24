const { name } = require('ejs')
const mongoose = require('mongoose')
mongoose.connect(`mongodb://127.0.0.1:27017/vise`)

const fixedSchema = mongoose.Schema({
    userName : String,
    fdName : String,
    fdType : String,
    maturityPeriod : String,
    date : Date,
    fdInvestment : Number,
    interestRate : Number
})

module.exports = mongoose.model("fixed",fixedSchema)