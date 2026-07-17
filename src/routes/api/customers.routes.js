const express = require("express")
const { getAllCustomers, createCustomer, findCustomer, addAccountToCustomer } = require("../../controllers/api/customers.controllers.js")
const router = express.Router()

router.get("/", getAllCustomers)
router.post("/", createCustomer)
router.get("/:id", findCustomer)
router.post("/:id/accounts", addAccountToCustomer)

module.exports = {
    customerRoutes: router
}