window.protocol = window.location.protocol
window.host = window.location.host
window.dbURL = (host.split(":",1)[0] === "localhost") ? "http://localhost:3001" : "https://sethspire-api.herokuapp.com"

const displayAccountBtn = document.querySelector("#displayAccountBtn")
const deleteAccountBtn = document.querySelector("#deleteAccountBtn")
const logOutBtn = document.querySelector("#logOutBtn")
const modifyAccountModalSaveButton = document.querySelector("#modifyAccountModalSaveButton")

// display account
displayAccountBtn.addEventListener("click", async(e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/users/me"
    //const url = 'https://sethspire-api.herokuapp.com/users/me'
    const url = `${dbURL}/users/me`

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
            const accountDisplayName = document.querySelector("#accountDisplayName")
            const accountDisplayEmail = document.querySelector("#accountDisplayEmail")
            accountDisplayName.textContent = data.name
            accountDisplayEmail.textContent = data.email
        }
    } else {
        console.log("HTTP-Error: " + response.status)
        if (response.status === 401) {
            const newUrl = `${protocol}//${host}/login`
            window.location.replace(newUrl)
        }
    }
})

//delete account
deleteAccountBtn.addEventListener("click", async(e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/users/me"
    //const url = 'https://sethspire-api.herokuapp.com/users/me'
    const url = `${dbURL}/users/me`

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
        if (response.status === 401) {
            const newUrl = `${protocol}//${host}/login`
            window.location.replace(newUrl)
        }
    }
})

//logout
logOutBtn.addEventListener("click", async(e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/users/logout"
    //const url = 'https://sethspire-api.herokuapp.com/users/logout'
    const url = `${dbURL}/users/logout`

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
        if (response.status === 401) {
            const newUrl = `${protocol}//${host}/login`
            window.location.replace(newUrl)
        }
    }
})

// modify account
modifyAccountModalSaveButton.addEventListener("click", async(e) => {
    e.preventDefault()

    if( document.getElementById("avatarInput").files.length != 0 ) {
        //console.log("from form:", document.getElementById("avatarInput").files[0])
        uploadAvatar()
    }

    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/users/me"
    //const url = 'https://sethspire-api.herokuapp.com/users/me'
    const url = `${dbURL}/users/me`

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
        alert('Change successful.')
        const modal = document.querySelector("#modifyAccountModal")
        bootstrap.Modal.getInstance(modal).hide()
        document.querySelector("#modifyAccountForm").reset()
    } else {
        console.log("HTTP-Error: " + response.status)
        alert('Change NOT successful. Check inputs.')
        if (response.status === 401) {
            const newUrl = `${protocol}//${host}/login`
            window.location.replace(newUrl)
        }
    }
})

// upload avatar
async function uploadAvatar() {
    const token = localStorage.getItem("token")

    const url = `${dbURL}/users/me/avatar`
    //console.log(url)
    
    const input = document.querySelector("#avatarInput")

    let formData = new FormData();
    formData.append("avatar", input.files[0]);
    //console.log("formData: ", formData)
    //console.log("input.files[0]", input.files[0])
    const options = {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    let response = await fetch(url, options)

    if (response.status === 200) {
        console.log("upload successful")
        loadAvatar()
    } else {
        console.log("Error uploading avatar: " + response.status)
    }
}

// get avatar
async function loadAvatar() {
    const token = localStorage.getItem("token")

    const url = `${dbURL}/users/me/avatar`

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    let response = await fetch(url, options)

    if (response.status === 200) {
        //remove previous image if any
        const oldImg = document.getElementById("profile-pic")
        if (oldImg != null) {
            oldImg.remove()
        }

        //add new image
        const imageBlob = await response.blob()
        const imageObjectURL = URL.createObjectURL(imageBlob);

        const image = document.createElement('img')
        image.src = imageObjectURL
        image.id = "profile-pic"

        const container = document.getElementById("dropdownMenuButton1")
        container.prepend(image)
    }
    else {
        console.log("HTTP-Error: " + response.status)
    }
}

loadAvatar()