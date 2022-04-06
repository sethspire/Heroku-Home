window.protocol = window.location.protocol
window.host = window.location.host
window.dbURL = (host.split(":",1)[0] === "localhost") ? "http://localhost:3001" : "https://sethspire-api.herokuapp.com"

const taskDisplayArea = document.querySelector("#tasksDisplayArea")
const createTaskBtn = document.querySelector('#createTaskModalButton')
const showNextTaskBtn = document.querySelector("#showNextTask")
const saveTaskBtn = document.querySelector("#saveTaskModalButton")

showNextTaskBtn.addEventListener("click", displayTasks)

let displayedTasks = []
let selectedTask = null
let limit = 5
let skip = 0

// create task
createTaskBtn.addEventListener('click', async(e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    const title = document.querySelector("#titleInput").value
    const description = document.querySelector("#descInput").value
    const completed = document.querySelector("#completedInput").checked
    let sendData = { title, description, completed }

    //const url = 'http://localhost:3001/users'
    //const url = 'https://sethspire-api.herokuapp.com/users'
    const url = `${dbURL}/tasks`

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData)
    }

    let response = await fetch(url, options)
    let data = await response.json()

    if (response.status === 201) {
        alert("task created")
        //const createTaskModal = document.querySelector("#createTaskModal")
        //bootstrap.Modal.getInstance(createTaskModal).hide()
        document.querySelector("#createTaskForm").reset()
    } else if (response.status === 400) {
        alert(data.message)
    } else if (response.status === 401) {
        const newUrl = `${protocol}//${host}/login`
        window.location.replace(newUrl)
    }
})

// display task
async function displayTasks() {
    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/tasks"
    //const url = 'https://sethspire-api.herokuapp.com/tasks'
    let url = `${dbURL}/tasks`

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    let params = `limit=${limit}&skip=${skip}`

    const selectBtn = document.getElementById("displayOption")
    const toDisplay = selectBtn.options[selectBtn.selectedIndex].value;
    if (toDisplay !== "all") {
        params += (toDisplay === "finished") ? "&completed=true" : "&completed=false"
    }

    let response = await fetch(url+'?'+params, options)
    
    if (response.ok) {
        if (response.status === 200) {
            const data = await response.json()
            displayedTasks = data
            if (data.length) {
                taskDisplayArea.innerHTML = ' '
                for (let i = 0; i < data.length; i++) {
                    taskDisplayArea.innerHTML += 
                        `<div class="card" data-_id="${data[i]._id}">
                            <div class="card-header">
                                <h5 class="card-title task-title" style="display: inline-block">${data[i].title}</h5>
                                <div style="float: right">
                                    <button type="button" class="btn btn-success task-mod-btn edit-task-btn" data-bs-toggle="modal" data-bs-target="#modifyTaskModal">&#9998;&#xFE0E;</button>
                                    <button type="button" class="btn btn-danger task-mod-btn delete-task-btn"> &#128465;&#xFE0E; </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <p class="card-text task-desc"><strong>Description:</strong> ${data[i].description}</p>
                                <p class="card-text task-completed"><strong>Completed:</strong> ${data[i].completed}</p>
                            </div>
                        </div>
                        <br>`
                }

                const modTaskBtns = taskDisplayArea.getElementsByClassName("edit-task-btn")
                for(i = 0; i < modTaskBtns.length; i++) {
                    modTaskBtns[i].addEventListener("click", showModTaskModal)
                }
                const delTaskBtns = taskDisplayArea.getElementsByClassName("delete-task-btn")
                for(i = 0; i < modTaskBtns.length; i++) {
                    delTaskBtns[i].addEventListener("click", deleteTask)
                }

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
}

// delete task
async function deleteTask(e) {
    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/tasks"
    //const url = 'https://sethspire-api.herokuapp.com/tasks'
    const url = `${dbURL}/tasks`
    
    const taskCard = e.target.parentNode.parentNode.parentNode
    const _id = taskCard.dataset._id
    let sendData = {_id}

    const options = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData)
    }
    
    let response = await fetch(url, options)

    if (response.ok) {
        if (response.status === 200) {
            skip -= 1
            taskCard.remove()
            alert("did delete task")
        }
    } else {
        console.log("HTTP-Error: " + response.status)
        if (response.status === 401) {
            const newUrl = `${protocol}//${host}/login`
            window.location.replace(newUrl)
        }
    }
}

// display modify task modal
async function showModTaskModal(e) {
    const taskCard = e.target.parentNode.parentNode.parentNode
    const _id = taskCard.dataset._id
    selectedTask = displayedTasks.find(item => item._id === _id)

    document.getElementById("titleEdit").value = selectedTask.title
    document.getElementById("descEdit").value = selectedTask.description
    document.getElementById("completedEdit").checked = selectedTask.completed
}

// modify task
saveTaskBtn.addEventListener("click", async(e) => {
    const token = localStorage.getItem("token")

    //const url = "http://localhost:3001/tasks"
    //const url = 'https://sethspire-api.herokuapp.com/tasks'
    const url = `${dbURL}/tasks`
    
    let title = document.getElementById("titleEdit").value
    let description = document.getElementById("descEdit").value
    let completed = document.getElementById("completedEdit").checked
    completed = (completed === true) ? "true" : "false"
    const _id = selectedTask._id

    const oldTitle = selectedTask.title
    const oldDesc = selectedTask.description
    let oldComp = selectedTask.completed
    oldComp = (oldComp === true) ? "true" : "false"
    
    title = (title === oldTitle) ? null : title
    description = (description === oldDesc) ? null : description
    completed = (completed === oldComp) ? null : completed
    const sendData = {_id, ...title && {title}, ...description && {description}, ...completed && {completed} }
    
    if (Object.keys(sendData).length > 1) {
        document.getElementById("saveModalErrorInfo").textContent=" "
        
        const options = {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sendData)
        }
        
        let response = await fetch(url, options)

        if (response.ok) {
            if (response.status === 200) {
                const modal = document.querySelector("#modifyTaskModal")
                bootstrap.Modal.getInstance(modal).hide()
                skip -= limit
                displayTasks()
            }
        } else {
            console.log("HTTP-Error: " + response.status)
            if (response.status === 401) {
                const newUrl = `${protocol}//${host}/login`
                window.location.replace(newUrl)
            }
        }
        
    } else {
        document.getElementById("saveModalErrorInfo").textContent="no info has been changed"
    }
})