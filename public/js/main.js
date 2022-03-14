const protocol = window.location.protocol
const host = window.location.host

const displayAccountBtn = document.querySelector("#displayAccountBtn")
const deleteAccountBtn = document.querySelector("#deleteAccountBtn")
const logOutBtn = document.querySelector("#logOutBtn")
const modifyAccountModalSaveButton = document.querySelector("#modifyAccountModalSaveButton")

// display account
displayAccountBtn.addEventListener("click", async(e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/users/me"
    const url = 'https://sethspire-api.herokuapp.com/users/me'

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    let response = await fetch(url, options)

    if (response.ok) {
        if (response.status === 200) {
            const data = await response.json()

            const contentArea = document.querySelector("#accountDisplayArea")
            contentArea.innerHTML = `Name: ${data.name} <br>Email: ${data.email}`
        }
    } else {
        console.log("HTTP-Error: " + response.status)
    }
})

//delete account
deleteAccountBtn.addEventListener("click", async(e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/users/me"
    const url = 'https://sethspire-api.herokuapp.com/users/me'

    const options = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    let response = await fetch(url, options)

    if (response.ok) {
        if (response.status === 200) {
            const newUrl = `${protocol}//${host}`
            window.location.replace(newUrl)
        }
    } else {
        console.log("HTTP-Error: " + response.status)
    }
})

//logout
logOutBtn.addEventListener("click", async(e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/users/logout"
    const url = 'https://sethspire-api.herokuapp.com/users/logout'

    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    let response = await fetch(url, options)

    if (response.ok) {
        if (response.status === 200) {
            const newUrl = `${protocol}//${host}`
            window.location.replace(newUrl)
        }
    } else {
        console.log("HTTP-Error: " + response.status)
    }
})

// modify account
modifyAccountModalSaveButton.addEventListener("click", async(e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/users/me"
    const url = 'https://sethspire-api.herokuapp.com/users/me'

    const nameInput = document.querySelector("#nameInput")
    const passwordInput = document.querySelector("#passwordInput")
    const name = nameInput.value
    const password = passwordInput.value
    const requestData = {...name && { name }, ...password && { password } }
    //console.log(requestData)

    const options = {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    }

    let response = await fetch(url, options)

    const contentArea = document.querySelector("#accountDisplayArea")
    if (response.status === 200) {
        contentArea.innerHTML = `Change successful.`
    } else {
        console.log("HTTP-Error: " + response.status)
        contentArea.innerHTML = `Change NOT successful. Check inputs.`
    }

    const modal = document.querySelector("#modifyAccountModal")
    bootstrap.Modal.getInstance(modal).hide()

    const form = document.querySelector("#modifyAccountForm").reset()
})