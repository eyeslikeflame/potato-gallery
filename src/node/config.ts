export default class Config {
    public mongo() {
        return {
            uri: 'mongodb://localhost:27017/gallery',
            options: {
                autoIndex: false, // Don't build indexes
                reconnectTries: 10, // Never stop trying to reconnect
                reconnectInterval: 500, // Reconnect every 500ms
                poolSize: 10, // Maintain up to 10 socket connections
                // If not connected, return errors immediately rather than waiting for reconnect
                bufferMaxEntries: 0,
                useNewUrlParser: true
            }
        }
    }
}
