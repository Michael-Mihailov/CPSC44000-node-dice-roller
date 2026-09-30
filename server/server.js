const express = require("express")
const cors = require("cors")
const {rateLimit} = require("express-rate-limit")

const app = express()
const port = 3000

app.use(cors())

// limit to 100 requests per every 10 seconds
const limiter = rateLimit({
    windowMs: 10000,
    limit: 100
})
app.use(limiter)



const MIN_ROLLS = 1
const MIN_SIDES = 2
const MAX_ROLLS = 100                     // The maximum amount of rolls allowed in one request
const MAX_SIDES = Number.MAX_SAFE_INTEGER // The maximum number of sides before JavaScript goes wonky

app.get("/api/rolls", (req, res) => {
    const sides = req.query.numSides
    const rolls = req.query.numRolls

    if (rolls === undefined){
        return  res.status(400).json({error:"ERROR: numRolls doesn't exist"})
    }
    if (sides === undefined){
        return  res.status(400).json({error:"ERROR: numSides doesn't exist"})
    } 
    
    const numSides = Number(sides)
    const numRolls = Number(rolls)
    
    if (!Number.isInteger(numRolls) || numRolls < MIN_ROLLS || numRolls > MAX_ROLLS){
        return  res.status(400).json({error:`ERROR: numRolls must be a number between ${MIN_ROLLS} and ${MAX_ROLLS} (inclusive)`})
    }
    if (!Number.isInteger(numSides) || numSides < MIN_SIDES || numSides > MAX_SIDES){
        return res.status(400).json({error:`ERROR: numSides must be a number between ${MIN_SIDES} and ${MAX_SIDES} (inclusive)`})
    }


    const answer = []
    for(let i = 0; i < numRolls; i++){
        answer.push(Math.floor(Math.random() * numSides) + 1)
    }

    res.json({
        numSides: numSides,
        numRolls: numRolls,
        result: answer
    })
})

app.get("/api/awake", (req, res) => {
    res.send("I'm awake!")
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


app.listen(port, () => {console.log(`Started server on port ${port}`)})