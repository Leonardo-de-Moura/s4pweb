import { getAll, remove } from "./api.js";

const grid = document.querySelector(".artigos-grid");

async function renderizarCards() {
	const data = await getAll();
	console.log(data);

	// opção 1: acumular a string
	let cardsHTML = "";

	data.forEach((item) => {
		console.log(item)
		cardsHTML += `<div class="card-artigo">
            <img src="${item.image}" alt="Código em tela de computador">
            <div class="card-conteudo">
                <span>${item.category}</span>
                <p>${item.title}</p>
                <div class="card-rodape">
                    criado :
					<span>${item.createdAt}</span>
					editado:
                    <span>${item.updatedAt}</span>
                    <div class="botoes">
                        <button class="btn-excluir">Excluir</button>
                        <button class="btn-editar">Editar</button>
                    </div>
                </div>
            </div>
        </div>`;
	});

	grid.innerHTML = cardsHTML; // insere todos de uma vez

	
	
}

renderizarCards();


