const fs = require("node:fs/promises")
const path = require("node:path")
const { Customer } = require("../../models/customer.models")

const getAllCustomers = async (req, res) => {
    const textData = await fs.readFile(path.join(__dirname, "../../models/customers.json"), { encoding: "utf-8" })

    res.json(JSON.parse(textData))
}

const createCustomer = async (req, res) => {
    const { rut, name, age, phoneNumber, email, accountType } = req.body

    const newCustomer = new Customer(rut, name, age, phoneNumber, email)
    newCustomer.addAccount(accountType)

    const response = await newCustomer.saveCustomer()

    res.json({
        ok: true,
        message: response
    })
}

const findCustomer = async (req, res) => {
    const { id } = req.params

    const textData = await fs.readFile(path.join(__dirname, "../../models/customers.json"), { encoding: "utf-8" })
    const JSONData = JSON.parse(textData)

    const customer = JSONData.find(customer => customer.id_customer === id)

    if (!customer) {
        return res.status(404).json({
            ok: false,
            message: "El cliente no se encontró"
        })
    }

    res.json({
        ok: true,
        data: customer
    })
}

module.exports = {
    getAllCustomers,
    createCustomer,
    findCustomer
}