const pool = require('../conexao');

const buscarUsuarioPorEmail = async (bancoDaddos, email) => {
    try {
        const usuario = await pool.query(`SELECT * FROM ${bancoDaddos} WHERE email = $1`, [email]);

        if (usuario.rows.length === 0) {
            return false
        };

        return usuario.rows[0]

    } catch (error) {
        return error.message
    }
};

module.exports = { buscarUsuarioPorEmail }//