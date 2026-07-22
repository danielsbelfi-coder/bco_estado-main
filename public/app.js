const results = document.getElementById("results")
const btnLoadCustomers = document.getElementById("btn-load-customers")
const btnLoadRutCustomers = document.getElementById("btn-load-rut-customers")
const createCustomerForm = document.getElementById("create-customer-form")
const ageInput = document.querySelector('input[name="age"]')

if (ageInput) {
    ageInput.min = "0"
}

const renderCustomers = (customers) => {
    if (!customers.length) {
        results.innerHTML = "<p>No hay clientes para mostrar.</p>"
        return
    }

    results.innerHTML = customers.map(customer => `
        <article class="card">
            <h2>${customer.name}</h2>
            <p><strong>RUT:</strong> ${customer.rut}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Teléfono:</strong> ${customer.phoneNumber}</p>
            <p><strong>Cuentas:</strong> ${customer.accounts.length}</p>

            <ul>
                ${customer.accounts.map(account => `
                    <li>
                        ${account.type} - saldo: ${account.balance}
                        <button 
                            class="delete-account-btn"
                            data-customer-id="${customer.id_customer}"
                            data-account-id="${account.id_account}">
                            Eliminar cuenta
                        </button>
                    </li>
                `).join("")}
            </ul>

            <button class="delete-customer-btn" data-id="${customer.id_customer}">
                Eliminar cliente
            </button>

            <div class="account-actions">
                <select class="account-type-select" data-id="${customer.id_customer}">
                    <option value="cuenta rut">Cuenta rut</option>
                    <option value="cuenta ahorro">Cuenta ahorro</option>
                </select>

                <button class="add-account-btn" data-id="${customer.id_customer}">
                    Agregar cuenta
                </button>
            </div>
        </article>
    `).join("")

    addDeleteCustomerEvents()
    addAccountEvents()
    addDeleteAccountEvents()
}

const addDeleteCustomerEvents = () => {
    const deleteButtons = document.querySelectorAll(".delete-customer-btn")

    deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const id = button.dataset.id
            const confirmDelete = confirm("¿Seguro que deseas eliminar este cliente?")

            if (!confirmDelete) return

            const response = await fetch(`/customers/${id}`, {
                method: "DELETE"
            })

            const data = await response.json()
            alert(data.message)

            if (data.ok) {
                const customersResponse = await fetch("/customers")
                const customers = await customersResponse.json()
                renderCustomers(customers)
            }
        })
    })
}

const addAccountEvents = () => {
    const addAccountButtons = document.querySelectorAll(".add-account-btn")

    addAccountButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const customerId = button.dataset.id
            const select = document.querySelector(
                `.account-type-select[data-id="${customerId}"]`
            )

            const accountType = select.value

            const response = await fetch(`/customers/${customerId}/accounts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ accountType })
            })

            const data = await response.json()

            alert(data.message)

            if (data.ok) {
                const customersResponse = await fetch("/customers")
                const customers = await customersResponse.json()
                renderCustomers(customers)
            }
        })
    })
}

const addDeleteAccountEvents = () => {
    const deleteAccountButtons = document.querySelectorAll(".delete-account-btn")

    deleteAccountButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const customerId = button.dataset.customerId
            const accountId = button.dataset.accountId

            const confirmDelete = confirm("¿Seguro que deseas eliminar esta cuenta?")

            if (!confirmDelete) return

            const response = await fetch(`/customers/${customerId}/accounts/${accountId}`, {
                method: "DELETE"
            })

            const data = await response.json()

            alert(data.message)

            if (data.ok) {
                const customersResponse = await fetch("/customers")
                const customers = await customersResponse.json()
                renderCustomers(customers)
            }
        })
    })
}

btnLoadCustomers.addEventListener("click", async () => {
    const response = await fetch("/customers")
    const customers = await response.json()
    renderCustomers(customers)
})

btnLoadRutCustomers.addEventListener("click", async () => {
    const response = await fetch("/customers/rut-accounts")
    const data = await response.json()
    renderCustomers(data.data)
})

createCustomerForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const formData = new FormData(createCustomerForm)
    const body = Object.fromEntries(formData.entries())

    if (Number(body.age) < 0) {
        alert("La edad no puede ser negativa")
        return
    }

    const response = await fetch("/customers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    const data = await response.json()

    alert(data.message)

    if (data.ok) {
        createCustomerForm.reset()

        if (ageInput) {
            ageInput.value = ""
        }

        const customersResponse = await fetch("/customers")
        const customers = await customersResponse.json()
        renderCustomers(customers)
    }
})