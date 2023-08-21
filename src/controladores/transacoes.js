const pool = require('../conexao');

const listarTransacoes = async (req, res) => {
    const { filtro } = req.query

    try {

        if (filtro) {
            const transacoesEncontradas = await pool.query(`
         SELECT transacoes.id, tipo, transacoes.descricao, valor, data, transacoes.usuario_id, categoria_id, categorias.descricao as categoria_nome 
         FROM transacoes JOIN categorias ON transacoes.categoria_id = categorias.id WHERE transacoes.descricao ilike $1;`, [filtro]);

            return res.status(200).json(transacoesEncontradas.rows)
        }

        const transacoes = await pool.query(`SELECT * FROM transacoes WHERE usuario_id = $1`, [req.usuario.id])
        return res.status(200).json(transacoes.rows)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }


}

const detalharTransacao = async (req, res) => {
    const { id } = req.params;

    try {

        const transacoes = await pool.query(`SELECT * FROM transacoes`);
        if (transacoes.rows.length < id) { return res.status(404).json({ mensagem: "Transação não encontrada" }) };
        let transacaoEncontrada = transacoes.rows.find((transacao) => {
            return transacao.id == id;
        });

        const query = await pool.query(`SELECT * FROM categorias WHERE id = $1`, [transacaoEncontrada.categoria_id])

        if (transacaoEncontrada.usuario_id != req.usuario.id) { return res.status(404).json({ mensagem: "Transação não encontrada" }) };

        transacaoEncontrada = {
            id: transacaoEncontrada.id,
            tipo: transacaoEncontrada.tipo,
            descricao: transacaoEncontrada.descricao,
            valor: transacaoEncontrada.valor,
            data: transacaoEncontrada.data,
            usuario_id: transacaoEncontrada.usuario_id,
            categoria_id: transacaoEncontrada.categoria_id,
            categoria_nome: query.rows[0].descricao
        }

        return res.status(200).json(transacaoEncontrada);

    } catch (error) {
        { return res.status(500).json({ mensagem: "Erro interno do servidor" }) };
    }
}

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body

    const categorias = await pool.query(`SELECT * FROM categorias`);
    const categoriaEncontrada = categorias.rows.find((categoria) => {
        return categoria.id == categoria_id;
    });
    if (req.usuario.id == categoriaEncontrada.usuario_id) {
        try {

            const query = await pool.query(`INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo)
            VALUES ($1, $2, $3, $4, $5, $6)`, [descricao, valor, data, categoria_id, req.usuario.id, tipo]);

            const retornoDaQuery = await pool.query(`SELECT * FROM transacoes ORDER BY id DESC LIMIT 1`);
            return res.status(201).json(retornoDaQuery.rows[0])

        } catch (error) {
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    } else {
        return res.status(201).json({ mensagem: "Os dados devem ser informados corretamente." })
    }

}

const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body

    const transacoes = await pool.query(`SELECT * FROM transacoes`);
    if (transacoes.rows.length < id) { return res.status(404).json({ mensagem: "Transação não encontrada" }) };
    const transacaoEncontrada = transacoes.rows.find((transacao) => {
        return transacao.id == id;
    });

    if (transacaoEncontrada.usuario_id != req.usuario.id) { return res.status(404).json({ mensagem: "Transação não encontrada" }) };

    try {

        const query = await pool.query(`UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6`,
            [descricao, valor, data, categoria_id, tipo, id]);

        return res.status(204).send();

    } catch (error) {
        console.log(error)
        { return res.status(500).json({ mensagem: "Erro interno do servidor" }) };
    }


}

const deletarTransacao = async (req, res) => {
    const { id } = req.params;

    const transacoes = await pool.query(`SELECT * FROM transacoes`);
    if (transacoes.rows.length < id) { return res.status(404).json({ mensagem: "Transação não encontrada" }) };
    const transacaoEncontrada = transacoes.rows.find((transacao) => {
        return transacao.id == id;
    });
    if (transacaoEncontrada.usuario_id != req.usuario.id) { return res.status(404).json({ mensagem: "Transação não encontrada" }) };

    try {

        const query = await pool.query(`DELETE FROM transacoes WHERE id = $1`, [id])

        return res.status(204).send();

    } catch (error) {
        console.log(error)
        { return res.status(500).json({ mensagem: "Erro interno do servidor" }) };
    }


}

const exibirExtrato = async (req, res) => {

    const transacoes = await pool.query(`SELECT * FROM transacoes WHERE usuario_id = $1`, [req.usuario.id]);

    const entradas = transacoes.rows.filter((transacao) => {
        return transacao.tipo == "entrada"
    });
    const saidas = transacoes.rows.filter((transacao) => {
        return transacao.tipo == "saida"
    });

    let valorEntradas = 0;
    let valorSaidas = 0;

    for (entrada of entradas) {
        valorEntradas += entrada.valor;
    }
    for (saida of saidas) {
        valorSaidas += saida.valor;
    }

    console.log(valorEntradas);
    console.log(valorSaidas);

    return res.status(200).json({
        valorEntradas,
        valorSaidas
    })

}

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    exibirExtrato,
}