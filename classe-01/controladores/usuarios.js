const conexao = require('../conexao');

const listarUsuarios = async (req, res) => {
    try {
        const { rows: usuarios } = await conexao.query('select * from usuarios');

        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await conexao.query('select * from usuarios where id = $1', [id]);

        if (usuario.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        return res.status(200).json(usuario.rows[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarUsuario = async (req, res) => {
    const { nome, idade, email, telefone, cpf } = req.body;

    if (!nome || nome.trim() === '') {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
    }

    if (!email || email.trim() === '') {
        return res.status(400).json({ mensagem: "O campo email é orbigatório." });
    }

    if (!cpf || cpf.trim() === '') {
        return res.status(400).json({ mensagem: "O campo CPF é obrigatório." });
    }

    try {
        const query = ` insert into usuarios 
        (nome, idade, email, telefone, cpf) 
        values
        ($1, $2, $3, $4, $5) `;
        const usuario = await conexao.query(query, [nome, idade, email, telefone, cpf]);

        if (usuario.rowCount === 0) {
            return res.status(400).json("Não foi possível cadastrar o usuário.");
        }

        return res.status(200).json({ mensagem: "Usuário cadastrado com sucesso." });
    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, idade, email, telefone, cpf } = req.body;

    try {
        const usuario = await conexao.query('select * from usuarios where id=$1', [id]);

        if (usuario.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        if (!nome || nome.trim() === '') {
            return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
        }

        if (!email || email.trim() === '') {
            return res.status(400).json({ mensagem: "O campo email é orbigatório." });
        }

        if (!cpf || cpf.trim() === '') {
            return res.status(400).json({ mensagem: "O campo CPF é obrigatório." });
        }

        const query = ` update usuarios set 
        nome = $1,
        idade = $2,
        email = $3,
        telefone = $4,
        cpf = $5
        where id = $6
        `
        const usuarioAtualizado = await conexao.query(query, [nome, idade, email, telefone, cpf, id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível atualizar o usuário." });
        }

        return res.status(200).json({ mensagem: "Usário atualizado com sucesso." });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await conexao.query('select * from usuarios where id = $1', [id]);

        if (usuario.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        const query = 'delete from usuarios where id = $1';
        const usuarioExcluido = await conexao.query(query, [id]);

        if (usuarioExcluido.rowCount === 0) {
            return res.status(404).json({ mensagem: "Não foi possível excluir o usuário." });
        }

        return res.status(200).json('Usuário excluído com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}



module.exports = {
    listarUsuarios,
    obterUsuario,
    cadastrarUsuario,
    atualizarUsuario,
    excluirUsuario
}