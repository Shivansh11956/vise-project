const { name } = require('ejs')
const mongoose = require('mongoose')
mongoose.connect(`mongodb://127.0.0.1:27017/vise`)

const mutualSchema = mongoose.Schema({
    userName : String,
    fundName : String,
    fundCode : BigInt,
    navArr : [Number],
    investedAmount : [Number],
    boughtUnits : [Number],
    buyingDates : [Date],
    assettClass : [String]
})

module.exports = mongoose.model("mutual",mutualSchema)