const express = require("express")
const { routes } = require("./src/routes")
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json()) // habilita res.body cuando se manda un req con application/json
app.use(express.urlencoded({extended: true})) // habilita res.body cuando req es form-urlencoded

app.use(routes)

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})