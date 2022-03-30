const protocol = window.location.protocol
const host = window.location.host
const dbURL = (host.split(":",1)[0] === "localhost") ? "http://localhost:3001" : "https://sethspire-api.herokuapp.com"

const taskDisplayArea = document.querySelector("#tasksDisplayArea")
const showNextTaskBtn = document.querySelector("#showNextTask")

let limit = 1
let skip = 0

// display account
showNextTaskBtn.addEventListener("click", async(e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/tasks"
    //const url = 'https://sethspire-api.herokuapp.com/tasks'
    const url = `${dbURL}/tasks`

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    const params = `limit=${limit}&skip=${skip}`

    let response = await fetch(url+'?'+params, options)
    
    if (response.ok) {
        if (response.status === 200) {
            const data = await response.json()
            
            if (data.length) {
                taskDisplayArea.innerHTML = 
                    `<div class="card">
                        <div class="card-header">
                            <h5 class="card-title">${data[0].title}</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text"><strong>Description:</strong> ${data[0].description}</p>
                            <p class="card-text"><strong>Completed:</strong> ${data[0].completed}</p>
                        </div>
                    </div>`
                
                skip += limit
            } else {
                taskDisplayArea.innerHTML = "<p>no more tasks. will start over</p>"
                skip = 0
            }
        }
    } else {
        console.log("HTTP-Error: " + response.status)
        if (response.status === 401) {
            const newUrl = `${protocol}//${host}/login`
            window.location.replace(newUrl)
        }
    }
})