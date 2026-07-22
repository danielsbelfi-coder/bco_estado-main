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
    const accountType = req.body.accountType?.trim().toLowerCase()

    if (!accountType) {
        return res.status(400).json({
            ok: false,
            message: "Debes indicar el tipo de cuenta"
        })
    }

    const validAccountTypes = ["cuenta rut", "cuenta ahorro"]

    if (!validAccountTypes.includes(accountType)) {
        return res.status(400).json({
            ok: false,
            message: "El tipo de cuenta no es válido"
        })
    }

    const filePath = path.join(__dirname, "../../models/customers.json")
    const textData = await fs.readFile(filePath, { encoding: "utf-8" })
    const customers = JSON.parse(textData)

    const customer = customers.find(customer => customer.id_customer === id)

    if (!customer) {
        return res.status(404).json({
            ok: false,
            message: "El cliente no se encontró"
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

const deleteAccountFromCustomer = async (req, res) => {
    const { id, id_account } = req.params

    const filePath = path.join(__dirname, "../../models/customers.json")
    const textData = await fs.readFile(filePath, { encoding: "utf-8" })
    const customers = JSON.parse(textData)

    const customer = customers.find(customer => customer.id_customer === id)

    if (!customer) {
        return res.status(404).json({
            ok: false,
            message: "El cliente no se encontró"
        })
    }

    const accountIndex = customer.accounts.findIndex(
        account => account.id_account === id_account
    )

    if (accountIndex === -1) {
        return res.status(404).json({
            ok: false,
            message: "La cuenta no se encontró"
        })
    }

    if (customer.accounts.length === 1) {
        return res.status(400).json({
            ok: false,
            message: "No se puede eliminar la única cuenta del cliente"
        })
    }

    const deletedAccount = customer.accounts[accountIndex]
    customer.accounts.splice(accountIndex, 1)[accountIndex]
    customer.accounts.splice(accountIndex, 1)

    await fs.writeFile(
        filePath,
        JSON.stringify(customers, null, 4),
        { encoding: "utf-8" }
    )

    res.json({
        ok: true,
        message: "Cuenta eliminada con éxito",
        data: deletedAccount
    })
}

const deleteCustomer = async (req, res) => {
    const { id } = req.params

    const filePath = path.join(__dirname, "../../models/customers.json")
    const textData = await fs.readFile(filePath, { encoding: "utf-8" })
    const customers = JSON.parse(textData)

    const customerIndex = customers.findIndex(
        customer => customer.id_customer === id
    )

    if (customerIndex === -1) {
        return res.status(404).json({
            ok: false,
            message: "El cliente no se encontró"
        })
    }

    const deletedCustomer = customers[customerIndex]
    customers.splice(customerIndex, 1)

    await fs.writeFile(
        filePath,
        JSON.stringify(customers, null, 4),
        { encoding: "utf-8" }
    )

    res.json({
        ok: true,
        message: "Cliente eliminado con éxito",
        data: deletedCustomer
    })
}

const getCustomersWithRutAccount = async (req, res) => {
    const filePath = path.join(__dirname, "../../models/customers.json")
    const textData = await fs.readFile(filePath, { encoding: "utf-8" })
    const customers = JSON.parse(textData)

    const customersWithRutAccount = customers.filter(customer =>
        customer.accounts.some(account => account.type === "cuenta rut")
    )

    res.json({
        ok: true,
        data: customersWithRutAccount
    })
}

module.exports = {
    getAllCustomers,
    createCustomer,
    findCustomer,
    addAccountToCustomer,
    deleteAccountFromCustomer,
    deleteCustomer,
    getCustomersWithRutAccount
}