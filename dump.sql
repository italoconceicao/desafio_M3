CREATE DATABASE dindin;

CREATE TABLE
    usuarios(
        id SERIAL PRIMARY KEY,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT
    );

CREATE TABLE
    categorias(
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        descricao text
    );

CREATE TABLE
    transacoes(
        id SERIAL PRIMARY KEY,
        descricao TEXT,
        valor INTEGER,
        data DATE,
        categoria_id INTEGER REFERENCES categorias(id),
        usuario_id INTEGER REFERENCES usuarios(id),
        tipo TEXT
    );