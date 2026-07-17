const express = require("express")
const { getAllCustomers, createCustomer, findCustomer } = require("../../controllers/api/customers.controllers.js")
const router = express.Router()

router.get("/", getAllCustomers)
router.post("/", createCustomer)
router.get("/:id", findCustomer)

module.exports = {
    customerRoutes: router
}