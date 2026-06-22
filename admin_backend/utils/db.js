const pg = require('pg');
const config = require('config')

const pgPool = new pg.Pool({
    host: config.get('App.DB.Host'),
    port: config.get('App.DB.Port'),
    user: config.get('App.DB.User'),
    password: config.get('App.DB.Password'),
    database: config.get('App.DB.Database'),
})

module.exports = {
    pgClient : async function(query, value){
        const client = await pgPool.connect();
        try {
            return await client.query(query, value);
        } catch (error) {
            return error;
        } finally{
            client.release();
        }
    },
    pgPool: pgPool
}