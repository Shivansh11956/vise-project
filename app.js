const express = require('express')
const app = express()
const path = require('path')
const userModel = require('./models/user');
const mutualModel = require('./models/mutual_fund')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { log } = require('console');
const user = require('./models/user');

app.set('view engine','ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())

const isLogged = (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }
  
    jwt.verify(token, 'shhhhh', (err, user_email) => {
      if (err) {
        return res.redirect('/login');
      }
      req.user = user_email;
      next();
    });
};
app.get('/',(req,res)=>{
    res.render('landing');
})
app.get('/create',(req,res)=>{
    res.render('create-account');
})
app.get('/dashboard',isLogged,(req,res)=>{
    res.render('dashboard');
})
app.get('/login',(req,res)=>{
    console.log(req.cookies)
    res.render('login_account')
})
app.post('/create-account',async (req,res)=>{
    let {name,email,mobileno,username,password,confirmpassword} = req.body;
    
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let createdUser = await userModel.create({
                name : name,
                email : email,
                mobileno : mobileno,
                username : username,
                password : hash
            }) 
            let token = jwt.sign({email : email},"shhhhh")
            res.cookie('token',token)
            res.redirect('/login')
        })
    })    
})
app.post('/add_mutual_fund', async (req, res) => {
    let { fund_name, fund_code, nav, invested_amount, invested_date, investment_type } = req.body;
    let token = req.cookies.token;
    let decoded = jwt.verify(token, 'shhhhh');

    let mutual = await mutualModel.findOne({ fundName: fund_name, userName: decoded.email });

    if (mutual) { 
        console.log("Mutual fund is already there");
        console.log(mutual);

        let updatedUser = await mutualModel.findOneAndUpdate(
            { userName: decoded.email, fundName: fund_name }, 
            {
                $push: {
                    navArr : nav,
                    investedAmount: invested_amount,
                    boughtUnits: invested_amount / nav,
                    buyingDates: invested_date,
                    assettClass: investment_type
                }
            },
            { new: true }
        );
        console.log(updatedUser);
    } else {
        let createdMutual = await mutualModel.create({  
            userName: decoded.email,
            fundName: fund_name,
            fundCode: fund_code,
            navArr : [nav],
            investedAmount: [invested_amount],  
            boughtUnits: [invested_amount / nav],
            buyingDates: [invested_date],
            assettClass: [investment_type]
        });
    }

    res.redirect('/add-mutual');
});

app.post('/login-account',async (req,res)=>{
    let {email,password} = req.body;
    // console.log("Received email:", req.body.email);
    let user = await userModel.findOne({email:email});
    if(!user){
        return res.redirect('/login')
    }
    bcrypt.compare(password, user.password, (err, isValid) => {
        if (err){
            console.error("Error comparing passwords:", err);
            return res.redirect('/login');
        }
        if (!isValid) {
            console.log("Invalid credentials.");
            return res.redirect('/login');
        }
        let token = jwt.sign({ email: user.email }, "shhhhh", { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.redirect('/dashboard');
    });
})
app.get('/add-mutual',isLogged,(req,res)=>{
    res.render('add-mutual');
})
app.get('/api/mutual-funds', async (req, res) => {
    try {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, 'shhhhh');
        let allmutuals = await mutualModel.find({ userName: decoded.email}) || [];
        
        res.json(
            JSON.parse(
                JSON.stringify(allmutuals, (_, value) =>
                    typeof value === "bigint" ? value.toString() : value
                )
            )
        );
    } catch (error) {
        console.error("Error fetching mutual funds:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get('/logout',(req,res)=>{
    res.cookie('token','');
    res.redirect('/')
})

app.get('/mutual-funds',isLogged,async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,'shhhhh')
    let allmutuals = await mutualModel.find({userName : decoded.email})
    console.log(allmutuals)
    console.log(req.cookies.token)
    res.render('mutual-funds',{allmutuals : allmutuals});
})

app.listen(3000,()=>{
    console.log('running');
});