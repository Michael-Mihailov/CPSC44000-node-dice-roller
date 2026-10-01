const SERVER_URL = "https://web-dice-roller-client-gmdtg7hzf5a5f9e7.centralus-01.azurewebsites.net/";

let initialDiceNums = [1, 2, 3, 2, 1];
let diceElements = null;


function start() {
    probeServer(); // wake up the server if it is asleep
    initializeDiceElements();
    rollDice(); // The initial roll
}

function initializeDiceElements() {
    document.getElementById("game").innerHTML = `
        ${initialDiceNums.map((num) => 
            `<div class="die card shadow-sm rounded-6 border-1"><div class="die-content card-body"><h2>${num}</h2></div></div>`
        ).join("")}
    `;
    diceElements = document.querySelectorAll(".die-content");
}

async function probeServer(){
    await fetch(SERVER_URL + "/api/awake");
}

async function rollDice() {
    const request = await fetch(SERVER_URL + "/api/rolls?numSides=6&numRolls=" + diceElements.length);
    const data = await request.json();
    const nums = data.result;

    for (let i = 0; i < diceElements.length; i++) {
        setDie(i, nums[i]);
    }
}
function setDie(index, value) {
    if (index < 0 || index >= diceElements.length) return;

    const die = diceElements[index];
    die.innerHTML = `<h2>${value}</h2>`;
}

async function failCORS() {
    try {
        const response = await fetch(SERVER_URL + "/");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("CORS error:", error);
    }
}