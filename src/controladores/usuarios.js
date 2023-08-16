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

        const token = jwt.sign({ id: usuarioPayload.id }, senhaToken, { expiresIn: '4h' });

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
};

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) { return res.status(404).json({ mensagem: 'O nome deve ser informado.' }); }
    if (!email) { return res.status(404).json({ mensagem: 'O email deve ser informado.' }); }
    if (!senha) { return res.status(404).json({ mensagem: 'A senha deve ser informada.' }); }

    let usuariosEncontrados = await pool.query(`SELECT * FROM usuarios`);
    usuariosEncontrados = usuariosEncontrados.rows;
    const usuarioEncontrado = usuariosEncontrados.find((usuarios) => {
        return usuarios.email == req.body.email;
    })

    if (usuarioEncontrado) { return res.status(401).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." }) };

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    try {
        const usuarioAtualizado = await pool.query(`
        UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE email = $4`, [nome, email, senhaCriptografada, req.usuario.email]);

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }


};



module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario,
}