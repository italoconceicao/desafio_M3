const express = require('express');
const { cadastrarUsuario, login, detalharUsuario } = require('./controladores/controladores_rotas');
const { intermediarioUsuarios, intermediarioLogin, verificarUsuarioLogado } = require('./intermediarios/intermediario_rotas');
const rota = express.Router();

rota.post('/usuario', intermediarioUsuarios, cadastrarUsuario);
rota.post('/login', intermediarioLogin, login);

rota.use(verificarUsuarioLogado)

rota.get('/usuario', detalharUsuario);

module.exports = rota;