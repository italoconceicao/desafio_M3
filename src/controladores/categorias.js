const pool = require('../conexao');


const listarCategoriasDoUsuario = async (req, res) => {

    try {
        const categorias = await pool.query(`select * from categorias where usuario_id = $1`, [req.usuario.id]);

        return res.status(200).json(categorias.rows);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const detalharCategoriasDoUsuario = async (req, res) => {
    const { id } = req.params

    try {
        const categorias = await pool.query(`select * from categorias`);

        const categoriaEncontrada = categorias.rows.filter((categoria) => {
            return categoria.id == id;
        })

        if (!categoriaEncontrada) { return res.status(404).json({ mensagem: 'Categoria não encontrada.' }); }
        if (categoriaEncontrada[0].usuario_id != req.usuario.id) { return res.status(404).json({ mensagem: 'Categoria não encontrada.' }); }

        return res.status(200).json(categoriaEncontrada[0]);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const cadastrarCategoria = async (req, res) => {
    const { descricao } = req.body;

    if (!descricao) { return res.status(404).json({ mensagem: 'Categoria não informada.' }); }

    try {

        const query = await pool.query(`INSERT INTO categorias (usuario_id, descricao) VALUES ($1, $2) RETURNING *`, [req.usuario.id, descricao]);

        return res.status(201).json(query.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

};

const atualizarCategoria = async (req, res) => {
    const { descricao } = req.body;
    const { id } = req.params

    if (!descricao) { return res.status(404).json({ mensagem: 'Categoria não informada.' }); }

    const quantidadeDeCategorias = await pool.query(`SELECT * FROM categorias`);
    if (id > quantidadeDeCategorias.rowCount || id < 1) { return res.status(404).json({ mensagem: 'Id informado é inexistente ou não pertence a este usuário.' }); }

    const categoriaInformada = await pool.query(`SELECT * FROM categorias WHERE id = $1`, [id]);
    if (categoriaInformada.rows[0].usuario_id != req.usuario.id) { return res.status(404).json({ mensagem: 'Id informado é inexistente ou não pertence a este usuário.' }); }

    try {
        const query = await pool.query(`UPDATE categorias SET descricao = $1 WHERE id = $2`, [descricao, id]);
        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const deletarCategoria = async (req, res) => {






}


module.exports = {
    listarCategoriasDoUsuario,
    detalharCategoriasDoUsuario,
    cadastrarCategoria,
    atualizarCategoria,
    deletarCategoria
}