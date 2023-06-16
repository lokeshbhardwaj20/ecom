
const express = require("express");
const ejs = require('ejs')
const app = express()
const bodyParser = require("body-parser");
const https = require("https")
const mongoose = require("mongoose")

app.set("view engine", "ejs")  // to access ejs file in viewws
app.use(express.static("public")); // to access public folder
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/ecomDB")
const productSchema = new mongoose.Schema({           // creating db schema 
    productName: String,
    productQty: Number,
    productPrice: Number,

})

const Product = mongoose.model("Product", productSchema)     // create model 

const items = [];



app.get("/contact", (req, res) => {   //rendering contact page

    res.render("contact", { items: items })

});

app.get("/", async (req, res) => {
    try {
        const products = await Product.find()
        res.render("index", { products: products })
    } catch (err) {
        console.log(err)
    }

})



app.get("/admin", async (req, res) => {   //render admin router
    try {
        const products = await Product.find()
        res.render("admin", { items: items, products: products })


    } catch (err) {
        console.log(err)
    }

})

app.post("/contact", (req, res) => {        //access customer query data from contact router
    const myObj = {
        name: req.body.name,
        contact: req.body.contact,
        email: req.body.email,
        comment: req.body.comment,

    }
    items.push(myObj)
    // console.log(myObj)
    console.log(items)
    res.redirect("/")
})


app.post("/admin/delete", async (req, res) => {
    try {
        const productId = req.body.productId;
        // console.log(productId)
        await Product.findOneAndDelete({_id:productId})

        res.redirect("/admin");
    } catch (err) {
        console.log(err);
    }
});



app.post("/admin", async (req, res) => {    // making new products details  from admin page & render to home router
    try {
        const productObj = new Product({
            productName: req.body.productName,
            productQty: req.body.productQty,
            productPrice: req.body.productPrice,
        });

        await productObj.save();
        const getId = req.body.getId

        console.log(getId)

        res.redirect("/admin")
    }
    catch (err) {
        console.log(err)
    }


})

// api using weather forecast

app.get("/weather", (req, res) => {
    const url = "https://api.openweathermap.org/data/2.5/weather?q=noida&appid=348243ad1433f09b7eb7ad49f834db42&units=metric";
    https.get(url, (response) => {
        console.log(response.statusCode)
        response.on("data", (data) => {
            const weatherData = JSON.parse(data)
            const weatherDescription = weatherData.weather[0].description

            const temp = weatherData.main.temp



            res.write("Weather Description : " + weatherDescription)

            res.write("currently temperature in Noida is " + temp + " degree")
            res.send()
        })
    })

});



app.listen(5000, () => {
    console.log("server starting at port 5000.")
})

