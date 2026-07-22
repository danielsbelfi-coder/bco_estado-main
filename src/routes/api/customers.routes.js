const express = require("express")
const {
    getAllCustomers,
    createCustomer,
    findCustomer,
    addAccountToCustomer,
    deleteAccountFromCustomer,
    deleteCustomer,
    getCustomersWithRutAccount
} = require("../../controllers/api/customers.controllers.js")

const router = express.Router()

router.get("/", getAllCustomers)
router.get("/rut-accounts", getCustomersWithRutAccount)
router.post("/", createCustomer)
router.get("/:id", findCustomer)
router.post("/:id/accounts", addAccountToCustomer)
router.delete("/:id/accounts/:id_account", deleteAccountFromCustomer)
router.delete("/:id", deleteCustomer)

module.exports = {
    customerRoutes: router
}