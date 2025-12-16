
let siteBody = document.getElementsByTagName("html")[0]
let gridLayout = document.getElementById("grid-layout")
let darkmode = localStorage.getItem("darkmode")

if(darkmode === "1") {
    siteBody.classList.add("darkmode")
} else {
    siteBody.classList.remove("darkmode")
}

function generateID() {
    return uuidv4()
}

function setMode() {
    if(darkmode) {
        siteBody.classList.add("darkmode")
    } else {
        siteBody.classList.remove("darkmode")
    }
}

async function load() {
    let result = await fetch("data.json")
    let data = await result.json() // .json() prevedie JSON response na object
    data.forEach((object)=>{
        object.id = generateID()
    })
    return data
}

async function saveToLocalStorage() {
    let data
    if(localStorage.getItem("data")) {
        data = JSON.parse(localStorage.getItem("data"));
        console.log("data from storage")
    } else {
        console.log("object from json")
        data = await load()
    }
    localStorage.setItem("data", JSON.stringify(data))
}

async function initialize() {
    await saveToLocalStorage(); // saveToLocal storage je async funkcia, a vracia promise, keby sme ju použili bez await, loadToDOM sa vykoná ešte pred tým ako sa údaje uložia do LocalStorage
    let filter = localStorage.getItem("results-filter")
    if(filter) {
        if(filter === "all") {
            allFilterBtn.classList.add("btn-active")
            loadToDOM()
        } else if (filter === "active") {
            activeFilterBtn.classList.add("btn-active")
            loadToDOM(false)
        } else if (filter === "inactive") {
            inactiveFilterBtn.classList.add("btn-active")
            loadToDOM(true)
        }
    } else {
        loadToDOM()
    }
                  
}

initialize();

function loadFromLocalStorage() {
    data = localStorage.getItem("data")
    data = JSON.parse(data)
    return data
}

console.log(loadFromLocalStorage())

function loadToDOM(condition = null) {
    let data = JSON.parse(localStorage.getItem("data") || [] )
    console.log(typeof data)
    console.log(data)
    data.forEach((object) => {
        if (object.isActive !== condition) { 
            gridLayout.innerHTML += `<div class="one-extension" data-id="${object.id}">
                    <div class="extension-info">
                        <object data="${object.logo}" type="image/svg+xml" class="extension-logo"></object>
                        <div class="text">
                            <h3 class="extension-title">${object.name}</h3>
                            <p class="extension-description">${object.description}</p>
                        </div>
                    </div>
                    <div class="extension-toolbar">
                        <button class="btn remove-btn">Remove</button>
                        <label class="extension-switch">
                            <input class="active-deactive-switch" type="checkbox" ${object.isActive ? "checked" : ""}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>`
        }
    })
}


// ACTIVE BUTTON

let allFilterBtn = document.getElementById("allFilterBtn")
allFilterBtn.addEventListener("click", (event)=>{
    allFilterBtn.classList.add("btn-active")
    activeFilterBtn.classList.remove("btn-active")
    inactiveFilterBtn.classList.remove("btn-active")
    localStorage.setItem("results-filter", "all")
    gridLayout.innerHTML = ""
    loadToDOM()
})

let activeFilterBtn = document.getElementById("activeFilterBtn")
activeFilterBtn.addEventListener("click", (event)=>{
    allFilterBtn.classList.remove("btn-active")
    activeFilterBtn.classList.add("btn-active")
    inactiveFilterBtn.classList.remove("btn-active")
    localStorage.setItem("results-filter", "active")
    gridLayout.innerHTML = ""
    loadToDOM(false)
})
let inactiveFilterBtn = document.getElementById("inactiveFilterBtn")
inactiveFilterBtn.addEventListener("click", (event)=>{
    allFilterBtn.classList.remove("btn-active")
    activeFilterBtn.classList.remove("btn-active")
    inactiveFilterBtn.classList.add("btn-active")
    localStorage.setItem("results-filter", "inactive")
    gridLayout.innerHTML = ""
    loadToDOM(true)
})

// GRID LAYOUT EVENTS

gridLayout.addEventListener("click", (event)=>{
    let data = localStorage.getItem("data")
    data = JSON.parse(data)
    if(event.target.classList.contains("remove-btn")){
        console.log("click DELETE")
        let parentElement = event.target.closest(".one-extension")
        let parentElementID = parentElement.dataset.id
        data = data.filter(object => object.id !== parentElementID)
        localStorage.setItem("data", JSON.stringify(data))
        console.log(data)
        parentElement.remove()
        
        console.log(data)
        gridLayout.innerHTML = ""
        initialize()
    }
    if (event.target.classList.contains("active-deactive-switch")){
        let parentElement = event.target.closest(".active-deactive-switch")
        let parentElementID = event.target.closest(".one-extension").dataset.id
        console.log(parentElementID)
        let targetIndex = data.findIndex(object => object.id === parentElementID)
        console.log(targetIndex)
        data[targetIndex].isActive = !data[targetIndex].isActive 
        console.log(typeof data[targetIndex].isActive, data[targetIndex].isActive)
        localStorage.setItem("data", JSON.stringify(data))
        
    }
})


// Mode toggle

let modeToggleBtn = document.getElementById("header-mode-toggle")
modeToggleBtn.addEventListener("click", (event) => {
    darkmode = localStorage.getItem("darkmode")
    console.log(darkmode, typeof darkmode)
    siteBody.classList.add("no-transition")
    if(darkmode === "1") {
        siteBody.classList.remove("darkmode")
        localStorage.setItem("darkmode", "0")
    } else {
        siteBody.classList.add("darkmode")
        localStorage.setItem("darkmode", "1")
    }

    setTimeout(() => {
        siteBody.classList.remove("no-transition")
    }, 0)
})