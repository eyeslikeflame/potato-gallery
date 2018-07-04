import * as mongoose from 'mongoose';

class MongoClient {
    private uri = 'mongodb://localhost:27017/gallery';
    private options = {
        autoIndex: false, // Don't build indexes
        reconnectTries: 10, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0,
        useNewUrlParser: true
    };

    public async connect() {
        mongoose.set('debug', true);
        mongoose.connect(this.uri, this.options).then(() => {
            console.log('Connection to mongoDb has been established successfully.');
        }).catch(err => {
            console.error('Unable to connect to the mongoDb:', err);
        });
    }
}

export default new MongoClient();
