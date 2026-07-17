// crypto => uuid => Universally Unique Identifier
const { randomUUID } = require("node:crypto");
const fs = require("node:fs/promises")
const path = require("node:path")

const { RutAccount, SaveAccount } = require("./account.models");

class Customer {
    constructor(rut, name, age, phoneNumber, email) {
        this.id_customer = randomUUID() // ejemplo: 123e4567-e89b-12d3-a456-426614174000
        this.rut = rut;
        this.name = name;
        this.age = age;
        this.phoneNumber = phoneNumber
        this.email = email
        this.accounts = []
    }

    addAccount(type) {
        if (type === "cuenta rut") {
            const hasRutAccount = this.accounts.some(account => account.type === type)

            if (hasRutAccount) {
                return "Ya tiene una cuenta rut" // la ejecución de addAccount llega hasta aquí si tiene cta rut
            }

            const cuenta = new RutAccount(type)
            this.accounts.push(cuenta)
            return "La cuenta se creó con éxito" // la ejecución de addAccount llega hasta aquí si no tiene cta rut
        }

        if (type === "cuenta ahorro") {
            const cuenta = new SaveAccount(type)
            this.accounts.push(cuenta)
            return "La cuenta se creó con éxito"
        }

        return "No se pudo crear la cuenta"
    }

    async saveCustomer() {
        const accountQtty = this.accounts.length // número 0 o N según la cantidad de cuentas

        if (accountQtty > 0) {
            const filePath = path.join(__dirname, "./customers.json")

            const customersData = await fs.readFile(filePath, { encoding: "utf-8" })
            const JSONCustomersData = JSON.parse(customersData)

            JSONCustomersData.push(this)

            await fs.writeFile(
                filePath,
                JSON.stringify(JSONCustomersData),
                { encoding: "utf-8" }
            )

            return "El cliente fue registrado con éxito"
        }

        return "El cliente aún no tiene cuentas"
    }
}

module.exports = {
    Customer
}