const synth = window.speechSynthesis;

function voiceControl(string) {
    let u = new SpeechSynthesisUtterance(string);
    u.text = string;
    u.lang = "en-aus";
    u.volume = 1;
    u.rate = 1;
    u.pitch = 1;
    synth.speak(u);
}

function sendMessage() {
    const inputField = document.getElementById("input");
    let input = inputField.value.trim();
    input !== "" && output(input);
    inputField.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("input");
    inputField.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            let input = inputField.value.trim();
            input !== "" && output(input);
            inputField.value = "";
        }
    });
});

function output(input) {
    // Print input for debugging
    console.log("Input Sent to Flask:", input);

    // Send the input to Flask for prediction
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: input,
        }),
    })
    .then(response => response.json())
    .then(data => {
        let diseaseName = data.predicted_disease_name;
        let description = data.description;// Corrected property name
        
        addChat(input, diseaseName,description);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function addChat(input, diseaseName,description) {
    const mainDiv = document.getElementById("message-section");
    let userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.classList.add("message");
    userDiv.innerHTML = `<span id="user-response">${input}</span>`;
    mainDiv.appendChild(userDiv);

    let botDiv = document.createElement("div");
    botDiv.id = "bot";
    botDiv.classList.add("message");
    botDiv.innerHTML = `<span id="bot-response">Disease might be ${diseaseName}</span><br><span id="bot-description">${description}</span>`;
    mainDiv.appendChild(botDiv);

    var scroll = document.getElementById("message-section");
    scroll.scrollTop = scroll.scrollHeight;

    // Voice synthesis for both disease name and description
    voiceControl(["Disease might be"+diseaseName,description]);
}