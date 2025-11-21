// URL pública do Render
const API_URL = "https://igreja-relatorios.onrender.com";

// Enviar relatório para o backend
document.getElementById("formRelatorio").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(e.target).entries());

    const membros = [];
    for (let i = 1; i <= 15; i++) {
        const nome = dados["m" + i];
        if (nome && nome.trim() !== "") membros.push(nome);
        delete dados["m" + i];
    }

    dados.membros = membros;

    try {
        const req = await fetch(`${API_URL}/api/relatorio`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const res = await req.json();

        alert(res.mensagem);
        e.target.reset();

    } catch (erro) {
        alert("Erro ao enviar relatório: " + erro.message);
    }
});
