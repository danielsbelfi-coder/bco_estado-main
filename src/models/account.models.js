const { randomUUID } = require("node:crypto")

class Account {
    constructor(type, balance = 0) {
        this.id_account = randomUUID()
        this.balance = balance;
        this.type = type
    }
}

class RutAccount extends Account {
    constructor(type, balance = 0) {
        super(type, balance = 0)
        this.cuote = 300;
        this.isBlocked = false
    }
}

class SaveAccount extends Account {
    constructor(type, balance = 0) {
        super(type, balance = 0)
        this.interest = 1.2;
    }
}

module.exports = {
    RutAccount,
    SaveAccount
}