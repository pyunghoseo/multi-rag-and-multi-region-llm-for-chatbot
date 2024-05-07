const myForm = document.querySelector('#my-form');
const userInput = document.querySelector('#userId');
const convtypeInput = document.querySelector('#convtype');
myForm.addEventListener('submit', onSubmit);


// load userId 
let userId = localStorage.getItem('userId'); // set userID if exists 
if(userId != '') {
    userInput.value = userId;
}

let conversationType = localStorage.getItem('conv_type'); // set conversationType if exists 
if(conversationType != '') {
    convtypeInput.value = conversationType;
}
else {
    convtypeInput.value = "normal"  // general conversation
}

console.log(userInput.value);
console.log(convtypeInput.value);

// provisioning
getProvisioningInfo(userId);

function onSubmit(e) {
    e.preventDefault();
    console.log(userInput.value);
    console.log(convtypeInput.value);

    localStorage.setItem('userId',userInput.value);
    console.log('Save Profile> userId:', userInput.value)    

    localStorage.setItem('conv_type',convtypeInput.value);
    console.log('Save Profile> conv_type:', convtypeInput.value)

    window.location.href = "chat.html";
}



function getProvisioningInfo(userId) {
    const uri = "provisioning";
    const xhr = new XMLHttpRequest();

    xhr.open("POST", uri, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            let provisioning_info = JSON.parse(response['info']);
            console.log("provisioning info: " + JSON.stringify(provisioning_info));
                        
            let wss_url = provisioning_info.wss_url;
            console.log("wss_url: ", wss_url);

            localStorage.setItem('wss_url',wss_url);
        }
    };

    var requestObj = {
        "userId": userId
    }
    console.log("request: " + JSON.stringify(requestObj));

    var blob = new Blob([JSON.stringify(requestObj)], {type: 'application/json'});

    xhr.send(blob);   
}

let options = document.getElementById("options");
let optionList = ["San Francisco", "Los Angeles", "New York", "Las Vegas", "Miami", "Houston", "Seattle"];

let button = document.getElementById("button");

let isOpen = false;

button.addEventListener("click", getMessage);
options.addEventListener("click", addToUIOptions);

function getMessage() {
    let message = document.createElement("div");
    message.className = "message";

    if (options.firstElementChild.classList.contains("hide-option")) {
        message.classList.add("danger");
        message.textContent = "Oh no! It is cannot be blank";

        document.body.appendChild(message);

        deleteMessage(message);
    }
    else {
        message.classList.add("success");
        message.textContent = "Thanks for completing :)";

        document.body.appendChild(message);

        deleteMessage(message);
    }

}

function deleteMessage(el) {
    setTimeout(() => {
        document.body.removeChild(el);
    }, 6000);
}

function addToUIOptions(e) {
    if (e.target.classList.contains("hide-option")) {
        controlOptions(e);
    }
    else {
        const pickedOption = e.target;

        if (options.firstElementChild.classList.contains("hide-option")) {
            options.removeChild(options.firstElementChild);
        }
        options.insertAdjacentElement("afterbegin", pickedOption);

        deleteOptions();
        controlOptions(e);
    }
}
