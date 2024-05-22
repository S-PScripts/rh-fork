const express = require("express")
const axios = require("axios")
const fs = require("fs")

const app = express()
app.use(express.json())

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")
})

function generateString(length) {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}


function countLines(filename) {
    const file = fs.readFileSync(filename, "utf8")
    return file.split("\n").length
}

function getRandomLineAndDelete(filename) {
    const file = fs.readFileSync(filename, "utf8")
    const lines = file.split("\n")
    const randomLine = lines[Math.floor(Math.random() * lines.length)]
    fs.writeFileSync(filename, file.replace(randomLine + "\n", ""))
    return randomLine
}

function getRandomLine(filename) {
    const file = fs.readFileSync(filename, "utf8")
    const lines = file.split("\n")
    return lines[Math.floor(Math.random() * lines.length)]
}

app.post("/link", (req, res) => {
    const token = req.body.token
    
    if (token) {
        


        var link = null
        var find = false
        setInterval(function() {
            if (find == false) {
                const cache = getRandomLine(__dirname + "/links.txt")
                console.log(cache)
                axios({
                    method: "get",
                    url: cache
                }).then(() => {
                    find = true
                    link = cache
                    res.send(cache)
                    clearInterval(this)
                }).catch(err => {
                  if (err.response.data == "bad ip") {
                    find = true
                    link = cache
                    res.send(cache)
                    clearInterval(this)
                  }
                })
            }
        }, 1000)
      

    } else {
        res.sendStatus(403)
    }
})

app.post("/stock", (req, res) => {
    res.send({amount: countLines("links.txt")})
})

app.listen(3000, function() {
    console.log("Server is running on port 3000")
})