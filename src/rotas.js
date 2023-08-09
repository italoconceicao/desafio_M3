const express = require('express');
const { cadastrarUsuario, login } = require('./controladores/controladores_rotas');
const { intermediarioUsuarios, intermediarioLogin } = require('./intermediarios/intermediario_rotas');
const rota = express.Router();

rota.post('/usuario', intermediarioUsuarios, cadastrarUsuario);
rota.post('/login', intermediarioLogin, login);

module.exports = rota;