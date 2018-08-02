import * as mongoose from 'mongoose';
import Config from '../config';

class MongoClient {
    constructor( private config: Config ) {
        const mongoConfig = config.mongo();
        this.uri = mongoConfig.uri;
        this.options = mongoConfig.options;
    }
    private uri;
    private options;

    public async connect() {
        mongoose.set('debug', true);
        mongoose.connect(this.uri, this.options).then(() => {
            console.log('Connection to mongoDb has been established successfully.');
        }).catch(err => {
            console.error('Unable to connect to the mongoDb:', err);
        });
    }
}

export default new MongoClient( new Config() );
