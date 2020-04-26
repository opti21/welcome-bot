require("dotenv").config();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const config = ("./config")

// const ws = new WebSocket("wss://pubsub-edge.twitch.tv");
// 
// const ping = {
//   type: "PING"
// };
// 
// ws.on("open", function open() {
//   ws.send(JSON.stringify(ping));
// });
// 
// function sendwsPing() {
//   ws.send(JSON.stringify(ping));
// }
// 
// setInterval(sendPing, 5000);
// 
// function sendPing() {
//   setTimeout(sendwsPing, randomInteger(1000, 6000));
// }
// 
// function randomInteger(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
// 
// ws.on("message", function incoming(data) {
//   console.log(data);
// });

const tmi = require("tmi.js");
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.TWITCH_USER,
    password: process.env.TWITCH_PASS
  },
  channels: [`${config.channel}`]
});

client.connect();

db.defaults({ welcomes: 0 }).write();

client.on("message", (channel, userstate, message, self) => {
  if (self) return;
  let parsedM = message.split(" ");
  if (
    userstate.username === "streamelements" &&
    message.includes("Thank you for following")
  ) {
    db.update("welcomes", n => n + 1).write();
    client.say(
      channel,
      `You don't want this ${parsedM[4]}`
    );
  }
  if (parsedM[0] === "$tatus") {
    let count = db.get("welcomes").value();
    client.say(channel, `Welcomes given: ${count}`);
  }
});
