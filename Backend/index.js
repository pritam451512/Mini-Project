const express=require("express");  //Express library import kar rahe ho
const app=express();  // Express function ko call karke ek app (server instance) create kar rahe hain
const main=require("./config/database");
const User=require("./Models/users")
const validUser=require("./utils/validUser")
const bcrypt=require("bcrypt");
const cookieParser=require('cookie-parser')   //cookie ko parse krne ke liye
const jwt=require('jsonwebtoken');  //jwt token generate krne ke liye
require('dotenv').config();
const auth=require("./middleware/userAuth")
const authrouter=require("./routes/authRoutes")
const redisClient=require("./config/redis");
const expenseRoutes = require("./routes/expenseRoutes")
const incomeRoutes = require("./routes/incomeRoutes") 
const groupRoutes = require("./routes/groupRoutes")
const cors = require("cors")
const budgetRoutes = require("./routes/budgetRoutes")

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://spendora.vercel.app"
]

app.use(cors({
  origin: "https://spendora-app-yjqm.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));//frontend se connect krega syd

app.use(express.json());//parse JSON body from requests
app.use(cookieParser());//request ki cookies ko read karne ke liye hota hai

app.get("/", (req, res) => {
  res.send("Spendora API is running 🚀")
})


app.use("/",authrouter);
app.use("/api",expenseRoutes);
app.use("/api",incomeRoutes);

app.use("/api",groupRoutes)

app.use("/api", budgetRoutes)


    async  function InitialiZation(){
    try{
        

            await Promise.all([redisClient.connect(),main()]) //ab isme dono he parallel connect honge pehle aghe piche connect ho rhe the
               console.log("DB Connected");
        
                 app.listen(process.env.PORT,()=>{
                console.log("Listening at port number 5000"); 
              })
          
    }
    catch(err){
             console.log("Error: "+err);
    }
 }

 InitialiZation();

//  main()  
//  .then(async()=>{  
//     console.log("Connected to DB")
//     app.listen(process.env.PORT,()=>{
//     console.log("Listening at port number 5000");
//     })
   
// })

//  .catch((err)=>console.log(err));