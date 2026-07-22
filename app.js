const express = require("express")
const path = require("node:path")
const { engine } = require("express-handlebars")
const { routes } = require("./src/routes")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "public")))

app.engine(".hbs", engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts")
}))

app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
    res.render("home")
})

app.use(routes)

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})