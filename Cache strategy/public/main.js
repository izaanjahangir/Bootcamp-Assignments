const container = document.querySelector('#container');
const customModal = document.querySelector('#custom-modal');
let isCache = false;
let updatedData;
let prevData;

function getData(){
    // Getting from cache for instant DOM manipulation
    caches.match("https://izaan-test-2.herokuapp.com/todos")
        .then(response =>{
            if(!response){
                console.log('Cannot find in cache');
                fetchNetwork();
            }else{
                isCache = true;
                console.log('Getting from cache',response);
                return response.json()
                    .then(data =>{
                        prevData = data;
                        renderDOM(data);
                        fetchNetwork();
                    })
            }
        })
        .catch(error => console.log('Unexpected error while loading cache',error))
    
}

function fetchNetwork(){
    // Fetching from network for updated data
    fetch("http://izaan-test-2.herokuapp.com/todos")
    .then(response => response.json())
    .then(data => {
        console.log('Updated data',data);
        if(JSON.stringify(prevData) !== JSON.stringify(data)){
            console.log('Not same');
            if(isCache){
                showModal();
            }else{
                renderDOM(data);
            }
            updatedData = data;
        }else{
            console.log('same')
        }
    })
    .catch(error => console.log('Cannot fetch from network',error))
}

function renderDOM(data){
    container.innerHTML = '';
    data.forEach(todos =>{
        container.innerHTML += `
            <li class="list-group-item">${todos.title}</li>
        `
    })
}

function showModal(){
    customModal.style.display = 'block';
    setTimeout(()=>{
        customModal.style.transform = 'translate(-50%,0px)';
    },100);
}
function hideModal(decision){
    if(decision){
        console.log('Update DOM');
        renderDOM(updatedData);
    }else{
        console.log("Don't");
    }
    customModal.style.transform = 'translate(-50%,150px)';
    setTimeout(()=>{
        customModal.style.display = 'none';
    },500);
}
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then(()=>{
            console.log('Service Worker Registered...')
        })
}