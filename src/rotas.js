const express = require('express');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('./controladores/usuarios');
const { listarCategoriasDoUsuario, detalharCategoriasDoUsuario, cadastrarCategoria, atualizarCategoria, deletarCategoria } = require('./controladores/categorias')
const { intermediarioUsuarios, intermediarioLogin, verificarUsuarioLogado } = require('./intermediarios/intermediario_rotas');
const rota = express.Router();

rota.post('/usuario', intermediarioUsuarios, cadastrarUsuario);
rota.post('/login', intermediarioLogin, login);

rota.use(verificarUsuarioLogado)

rota.get('/usuario', detalharUsuario);
rota.put('/usuario', atualizarUsuario);
rota.get('/categoria', listarCategoriasDoUsuario);
rota.get('/categoria/:id', detalharCategoriasDoUsuario);
rota.post('/categoria', cadastrarCategoria);
rota.put('/categoria/:id', atualizarCategoria);
rota.delete('/categoria/:id', deletarCategoria);


module.exports = rota;