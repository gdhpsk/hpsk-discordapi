"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordShards = void 0;
const index_1 = require("../index");
const APITypes_1 = require("../REST/classes/APITypes");
class DiscordShards extends index_1.DiscordWebSocket {
    rest;
    gatewayBot;
    gatewayVersion;
    gatewayEncoding;
    arrayOfSockets = [];
    constructor(obj) {
        super({ version: obj.version, encoding: obj.encoding, data: obj.data, caches: obj.caches ?? [] });
        this.gatewayVersion = obj.version ?? APITypes_1.defaults.gateway;
        this.gatewayEncoding = obj.encoding ?? APITypes_1.defaults.encoding;
        this.rest = new index_1.REST({}).setToken(obj.data.d.token);
    }
    async createShards() {
        this.arrayOfSockets = [];
        this.gatewayBot = await this.rest.get(index_1.Routes.gatewayBot());
        for (let i = 0; i < this.gatewayBot.shards; i++) {
            let rate_limit_key = i % this.gatewayBot.session_start_limit.max_concurrency;
            this.data.d.shard = [i, this.gatewayBot.shards];
            let discord_socket = new index_1.DiscordWebSocket({ version: this.gatewayVersion, encoding: this.gatewayEncoding, data: this.data });
            discord_socket.connect();
            this.arrayOfSockets.push(discord_socket);
            if (rate_limit_key == 0 && i != this.gatewayBot.shards - 1) {
                let queueShard = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve("");
                    }, 5000);
                });
                await queueShard;
            }
        }
    }
}
exports.DiscordShards = DiscordShards;
