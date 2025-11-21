import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos das pastas frontend
const formularioPath = path.join(__dirname, "../frontend/formulario");
const painelPath = path.join(__dirname, "../frontend/painel");

// Servir arquivos estáticos das duas pastas
app.use("/formulario", express.static(formularioPath));
app.use("/painel", express.static(painelPath));

// Rotas HTML
app.get("/formulario", (req, res) => {
    res.sendFile(path.join(formularioPath, "index.html"));
});

app.get("/painel", (req, res) => {
    res.sendFile(path.join(painelPath, "index.html"));
});

// -----------------------------------------------------------
// BANCO DE DADOS
// -----------------------------------------------------------
const dbPath = path.join(__dirname, "database.json");

function loadDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ relatorios: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// -----------------------------------------------------------
// API
// -----------------------------------------------------------

// Salvar relatório
app.post("/api/relatorio", (req, res) => {
    const db = loadDB();
    const dados = req.body;

    dados.id = Date.now(); // timestamp único

    db.relatorios.push(dados);
    saveDB(db);

    res.json({ status: "ok", mensagem: "Relatório salvo com sucesso!" });
});

// Buscar todos os relatórios → sempre ordenado (mais novo primeiro)
app.get("/api/relatorios", (req, res) => {
    const db = loadDB();

    // Ordenar: mais novo primeiro
    const ordenados = [...db.relatorios].sort((a, b) => b.id - a.id);

    res.json(ordenados);
});

// Buscar relatórios de uma célula específica
app.get("/api/celula/:nome", (req, res) => {
    const db = loadDB();
    const nome = req.params.nome;

    const filtrados = db.relatorios.filter(r => r.celula === nome);

    // Também retorna ordenado
    const ordenados = [...filtrados].sort((a, b) => b.id - a.id);

    res.json(ordenados);
});

// -----------------------------------------------------------
// INICIAR SERVIDOR
// -----------------------------------------------------------
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
    console.log("Formulário: http://localhost:3000/formulario");
    console.log("Painel: http://localhost:3000/painel");
});