const express = require('express');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('./controladores/usuarios');
const { listarCategoriasDoUsuario, detalharCategoriasDoUsuario, cadastrarCategoria, atualizarCategoria, deletarCategoria } = require('./controladores/categorias')
const { intermediarioUsuarios, intermediarioLogin, verificarUsuarioLogado } = require('./intermediarios/intermediario_rotas');
const { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, deletarTransacao, exibirExtrato, } = require('./controladores/transacoes')
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
rota.delete('/categoria/:id', deletarCategoria); // CHECAR SE EXISTE TRANSAÇÃO ENVOLVENDO ESTA CATEGORIA. <<<<<<<<<<<<<<<<<<<< ( ! ) <<<<<<<<<<<<<<<<<<<<<<<<<<<

rota.get('/transacao', listarTransacoes);
rota.get('/transacao/extrato', exibirExtrato);
rota.get('/transacao/:id', detalharTransacao);
rota.post('/transacao', cadastrarTransacao);
rota.put('/transacao/:id', atualizarTransacao);
rota.delete('/transacao/:id', deletarTransacao);


module.exports = rota;