const express = require('express')
const axios = require("axios");

var app = express();

app.use(express.static(__dirname+'/public')) //see
app.set("view engine","ejs")

let getDate = ()=>{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd-1}`
}

app.get("/",async(req,res)=>{

    let axiosRes = await axios({
        "method":"GET",
        "url":"https://covid-19-statistics.p.rapidapi.com/reports/total",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"covid-19-statistics.p.rapidapi.com",
        "x-rapidapi-key":"429f1e372amsh301f3be908fb59bp10d532jsnd5bb83db3c50"
        },"params":{
        "date":getDate()
        }
        })
    let countryList = await axios({
        "method":"GET",
        "url":"https://covid-19-statistics.p.rapidapi.com/regions",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"covid-19-statistics.p.rapidapi.com",
        "x-rapidapi-key":"429f1e372amsh301f3be908fb59bp10d532jsnd5bb83db3c50"
        }
        })
    //let countyData = await axios.get('https://api.covid19api.com/summary')
    res.render("index",{
        result: axiosRes.data.data,
        countryList: countryList.data.data
    })
})

app.listen(3000,()=>{
    console.log('Live on 3000')
})