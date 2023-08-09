const pool = require('../conexao');
const bcrypt = require('bcrypt');
const funcaoExtra = require('../utils/funcoesExtras');


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


module.exports = {
    intermediarioUsuarios,
    intermediarioLogin
};