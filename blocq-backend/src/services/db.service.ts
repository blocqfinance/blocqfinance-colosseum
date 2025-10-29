import mongoose from 'mongoose';

const connect = (uri: string, db_name: string) => {
    console.log('Connecting to database...');
    mongoose.connection.on('connected', () =>
        console.log('Connected to database'),
    );
    mongoose.connection.on('disconnecting', () =>
        console.log('Disconnecting from database'),
    );
    mongoose.connection.on('disconnected', () =>
        console.log('Disconnected from database'),
    );
    mongoose.connection.on('error', (err) =>
        console.log('Error connecting to database', err),
    );
    mongoose.connect(uri, {
        tls: true,
        dbName: db_name,
    });
};

export default connect;
