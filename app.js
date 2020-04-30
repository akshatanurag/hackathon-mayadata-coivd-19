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

    // let axiosRes = await axios({
    //     "method":"GET",
    //     "url":"https://covid-19-statistics.p.rapidapi.com/reports/total",
    //     "headers":{
    //     "content-type":"application/octet-stream",
    //     "x-rapidapi-host":"covid-19-statistics.p.rapidapi.com",
    //     "x-rapidapi-key":"429f1e372amsh301f3be908fb59bp10d532jsnd5bb83db3c50"
    //     },"params":{
    //     "date":getDate()
    //     }
    //     })
    let countryList = await axios({
        "method":"GET",
        "url":"https://covid-19-statistics.p.rapidapi.com/regions",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"covid-19-statistics.p.rapidapi.com",
        "x-rapidapi-key":"429f1e372amsh301f3be908fb59bp10d532jsnd5bb83db3c50"
        }
        })
    let myObj = [];
    let countyData = await axios.get('https://api.covid19api.com/summary')
    myObj.push(`{"${countyData.data.Countries[0].CountryCode}" : ${countyData.data.Countries[0].TotalConfirmed}`)
    let countryCode = []; let TotalConfirmed = []
    for(var i=0;i<countyData.data.Countries.length;i++){
    countryCode.push(countyData.data.Countries[i].CountryCode)
    TotalConfirmed.push(countyData.data.Countries[i].TotalConfirmed)
    myObj.push(`"${countryCode[i]}" : ${TotalConfirmed[i]}`)
    }
    myObj.push("}")
    //console.log(myObj)
    res.render("index",{
        result: countyData.data.Global,
        countryList: countryList.data.data,
        mapData: myObj
    })
})
let port = 3000 | process.env.PORT
app.listen(port,process.env.IP,()=>{
    console.log('Live on 3000')
})