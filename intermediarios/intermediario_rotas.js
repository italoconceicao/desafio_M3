const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const funcaoExtra = require('../utils/funcoesExtras');
const chavePrivada = require('../chavePrivada');


const intermediarioUsuarios = async (req, res, next) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos corretamente' })
    };

    try {

        const usuario = await funcaoExtra.buscarUsuarioPorEmail('usuarios', email);

        if (usuario) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
        };

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

};

const intermediarioLogin = async (req, res, next) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos corretamente' });
    };

    try {

        const usuario = await funcaoExtra.buscarUsuarioPorEmail('usuarios', email);

        if (!usuario) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s)' })
        }

        const senhaBd = usuario.senha;

        const verificaSenha = await bcrypt.compare(senha, senhaBd);

        if (!verificaSenha) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s)' });
        };

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
};

const verificarUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
    };

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, chavePrivada);

        const usuario = await pool.query('select * from usuarios where id = $1', [id])

        if (usuario.rowCount < 1) {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
        };

        req.usuario = {
            id: usuario.rows[0].id,
            nome: usuario.rows[0].nome,
            email: usuario.rows[0].email
        };

        next();

    } catch (error) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
    }



}


module.exports = {
    intermediarioUsuarios,
    intermediarioLogin,
    verificarUsuarioLogado
};