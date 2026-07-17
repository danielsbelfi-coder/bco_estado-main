const express = require("express")
const router = express.Router()
const { customerRoutes } = require("./api/customers.routes.js")

router.use("/customers", customerRoutes)

module.exports = {
    routes: router
}

/*
    GET dominio.com/api/v1/customers
    POST dominio.com/api/v1/customers
    GET dominio.com/api/v1/customers/:id => .../customers/abc
    DELETE dominio.com/api/v1/customers/:id
    PUT dominio.com/api/v1/customers/:id
*/