require("dotenv").config();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

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
  channels: ["theprimeagen"]
});

client.connect();

db.defaults({ welcomes: 0 }).write();

client.on("message", (channel, userstate, message, self) => {
  if (self) return;
  let parsedM = message.split(" ");
  if (
    userstate.username === "streamelements" &&
    message.includes("following")
  ) {
    db.update("welcomes", n => n + 1).write();
    client.say(
      channel,
      `Welcome to Costco ${parsedM[4]} Sunny has small hands`
    );
  }
  if (parsedM[0] === "$tatus") {
    let count = db.get("welcomes").value();
    client.say(channel, `Welcomes given: ${count}`);
  }
});
