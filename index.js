import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = 3000;
// REST Countries public API's url:
const API_URL = "https://restcountries.com/v3.1/name/";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//home page
app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://programming-quotesapi.vercel.app/api/random");
        const result = response.data;
        console.log(result);
        res.render("index.ejs",{
            quote: result.quote,
            author: result.author,
        });
    } catch (error) {
        console.error("Failed to make request", error.message);
        res.render("index.ejs",{error: "Try to reload the page"});
    };
});

app.get("/countries", (req, res) => {
    res.render("countries.ejs");
})

//get official name of the country
app.post("/get-official-name",  async (req, res) =>{
    const country = req.body["name"];
    try{
        const response = await axios.get(API_URL+country);
        const result = response.data[0];
        res.render("countries.ejs",{
            officialName: result.name.official,
            inputName: country
        });
    } catch (error) {
        console.error(error.message);
        res.redirect("/countries.ejs");
    }
});

//get the currency of a country
app.post("/get-currency", async (req, res) => {
    const country = req.body["name"];
    try{
        const response = await axios.get(API_URL+country);
        const result = response.data[0];
        res.render("countries.ejs",{
            countryName: result.name.official,
            currency: Object.values(result.currencies)[0].name,
            symbol: Object.values(result.currencies)[0].symbol,
        });
    } catch (error) {
        console.error(error.message);
        res.redirect("/countries.ejs");
    }
});

//get the region that a country is located in
app.post("/get-region", async (req, res) => {
    const country = req.body.name;
    try{
        const response = await axios.get(API_URL+country);
        const result = response.data[0];
        res.render("countries.ejs",{
            region: result.region,
            countryName: result.name.official});
    } catch(error){
        console.error(error.message);
        res.redirect("/countries.ejs");
    }
})

//get the capital of a country
app.post("/get-capital", async(req, res) => {
    const country = req.body.name;
    try{
        const response = await axios.get(API_URL+country);
        const result = response.data[0];
        res.render("countries.ejs",{
            capital: result.capital[0],
            countryName: result.name.official});
    } catch(error){
        console.error(error.message);
        res.redirect("/countries.ejs");
    }
})

app.listen(port, (req, res) => {
    console.log(`Server running at port ${port}`);
})