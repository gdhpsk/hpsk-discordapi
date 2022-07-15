require("dotenv").config({path: "../.env"})

import {DiscordShards, GatewayConnection } from "../"

let data = new GatewayConnection({
    token: process.env.discord_token as string,
    intents: 3276799,
    "presence": {
      "activities": [{
        "name": "gdhpsks server",
        "type": 2
      }],
      status: "online",
    },
    "properties": {
      "os": "iOS",
      "browser": "Discord iOS",
      "device": "IPhone 13"
    }
})
let shards = new DiscordShards(data, 9, "json")

shards.eventEmitter.once("SHARD_CREATE", async payload  => {
    console.log(`[WS => Shard ${payload.id}] fired up!`)
})

shards.createShards()