const { Pool } = require('pg');

const conexao = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    database: 'dindin'
});

module.exports = conexao;

