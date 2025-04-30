import { WebSocket } from "ws";

var name = "", age = 0, gender = "M", condition = "", count = 0;

function welcome() {
  return "Hello! 👋 I’m HealthBot. I can help you book an appointment with a doctor. How can I assist you today?"
}

function askName() {
  return "Okay, can I get your name please?"
}

function askAge() {
  return `Okay ${name}, and how old are you?`;
}

function askGender() {
  return `${name}, what is your gender? (M/F)`;
}

function askProblem() {
  return `${name}, what health issue are coming to get checked up on?`
}

function confirmAppointment() {
  return `An appointment for ${name}, ${age}${gender} is booked with Dr. Aman Kumar for today @ 11:30 AM regarding: ${condition}`
}

var functionArr = [welcome, askName, askAge, askGender, askProblem, confirmAppointment];
var size = functionArr.length;

// Directly start a WebSocket server on port 4000
const wss = new WebSocket.Server({ port: 4000 });

wss.on("connection", (ws) => {
  ws.send(`${functionArr[count%size]()}`)

  ws.on("message", (message) => {
    console.log(message);
    if(count % size == 1) {
      name = message.toString();
    }
    if(count % size == 2) age = parseInt(message.toString());
    if(count % size == 3) gender = message.toString();
    if(count % size == 4) condition = message.toString();
    count++;
    ws.send(`${functionArr[count%size]()}`);
  });
});

console.log("WebSocket-only server listening on port 4000");
