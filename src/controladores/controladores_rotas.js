const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaToken = require('../chavePrivada');
const funcoesExtras = require('../utils/funcoesExtras');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    try {
        const usuario = await pool.query(`
        INSERT INTO usuarios(nome,email,senha)
        VALUES($1,$2,$3) RETURNING id,nome,email
        `, [nome, email, senhaCriptografada]);

        res.status(201).json(usuario.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    };
};

const login = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await funcoesExtras.buscarUsuarioPorEmail('usuarios', email);

        const { senha: _, ...usuarioPayload } = usuario;

        const token = jwt.sign({ id: usuarioPayload.id }, senhaToken, { expiresIn: '1h' });

        const usuarioRetorno = {
            usuario: usuarioPayload,
            token
        };

        return res.status(200).json(usuarioRetorno);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const detalharUsuario = async (req, res) => {
    return res.json(req.usuario);
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario
}