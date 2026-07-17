const fs = require("node:fs/promises")
const path = require("node:path")
const { Customer } = require("../../models/customer.models")
const {
    RutAccount,
    SaveAccount
} = require("../../models/account.models")

const getAllCustomers = async (req, res) => {
    const textData = await fs.readFile(path.join(__dirname, "../../models/customers.json"), { encoding: "utf-8" })

    res.json(JSON.parse(textData))
}

const createCustomer = async (req, res) => {
    const { rut, name, age, phoneNumber, email, accountType } = req.body

    if (!rut || !name || !age || !phoneNumber || !email || !accountType) {
        return res.status(400).json({
            ok: false,
            message: "Faltan datos para crear el cliente"
        })
    }

    const filePath = path.join(__dirname, "../../models/customers.json")
    const customersData = await fs.readFile(filePath, { encoding: "utf-8" })
    const customers = JSON.parse(customersData)

    const customerExists = customers.find(customer => customer.rut === rut)

    if (customerExists) {
        return res.status(400).json({
            ok: false,
            message: "Ya existe un cliente con ese rut"
        })
    }

    const newCustomer = new Customer(rut, name, age, phoneNumber, email)
    const accountResponse = newCustomer.addAccount(accountType)

    if (newCustomer.accounts.length === 0) {
        return res.status(400).json({
            ok: false,
            message: accountResponse
        })
    }

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

const addAccountToCustomer = async (req, res) => {
    const { id } = req.params
    const { accountType } = req.body

    if (!accountType) {
        return res.status(400).json({
            ok: false,
            message: "Debes indicar el tipo de cuenta"
        })
    }

    const filePath = path.join(__dirname, "../../models/customers.json")
    const textData = await fs.readFile(filePath, { encoding: "utf-8" })
    const customers = JSON.parse(textData)

    const customer = customers.find(customer => customer.id_customer === id)

    if (!customer) {
        return res.status(404).json({
            ok: false,
            message: "EL cliente no se encontro"
        })
    }
    if (accountType === "cuenta rut") {
        const hasRutAccount = customer.accounts.some(account => account.type === "cuenta rut")

        if (hasRutAccount) {
            return res.status(400).json({
                ok: false,
                message: "El cliente ya tiene una cuenta rut"
            })
        }

        const newAccount = new RutAccount("cuenta rut")
        customer.accounts.push(newAccount)
    }
    if (accountType === "cuenta ahorro") {
        const newAccount = new SaveAccount("cuenta ahorro")
        customer.accounts.push(newAccount)

    }
    
    await fs.writeFile(
        filePath,
        JSON.stringify(customers, null, 4),
        { encoding: "utf-8" }
    )
    
    let message = "Cuenta agregada con éxito"

    if (accountType === "cuenta rut") {
        message = "cuenta Rut agregada con éxito"
    }

    if (accountType === "cuenta ahorro") {
        message = "Cuenta de ahorro agregada con éxito"
    }

    res.json({
        ok: true,
        message,
        data: customer
})
}

module.exports = {
    getAllCustomers,
    createCustomer,
    findCustomer,
    addAccountToCustomer
}