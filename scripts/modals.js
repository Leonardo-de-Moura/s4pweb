

import { getAll, remove } from "./api.js";

const API_URL = 'http://localhost:3000/posts'

const btnNovoPost = document.querySelector('.botao-busca');

// Secontêineres dos modais
const modalCriar = document.getElementById("modalCriar");
const modalEditar = document.getElementById("modalEditar");
const modalExcluir = document.getElementById("modalExcluir");

// Elementos essenciais para o CRUD e Renderização
const grid = document.querySelector('.artigos-grid');
const criarInputs = document.querySelectorAll('#modalCriar input, #modalCriar textarea');
const editarInputs = document.querySelectorAll('#modalEditar input, #modalEditar textarea');

let idEditando = null;
let idExcluindo = null;


const btnExcluirConfirmar = document.querySelector("#modalExcluir .btn-excluir");
const btnCancelarExcluir = document.querySelector("#modalExcluir .btn-cancelar");




async function getPosts() {
	try {
		const response = await fetch(API_URL);
		if (!response.ok) {
			throw new Error(`Erro HTTP: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Erro ao buscar posts:", error);
		alert("Não foi possível carregar os posts. Verifique o servidor (json-server).");
		return [];
	}
}


// CRIA um novo post na API.

async function createPost(postData) {
	await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(postData),
	});
}


//ATUALIZA um post existente na API.

async function updatePost(id, postData) {
	await fetch(`${API_URL}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(postData),
	});
}


async function deletePost(id) {
	await fetch(`${API_URL}/${id}`, {
		method: 'DELETE',
	});
}



// FUNÇÕES DE RENDERIZAÇÃO E MANIPULAÇÃO DO MODAL


async function renderPosts() {

	const posts = await getPosts();

	if (grid) grid.innerHTML = "";

	posts.forEach(post => {
		const card = document.createElement("div");
		card.className = "card-artigo";


		const data = new Date(post.createdAt || Date.now());
		const dia = data.toLocaleDateString("pt-BR");
		const hora = data.toLocaleTimeString("pt-BR").slice(0, 5);

		card.innerHTML = `
            <img src="${post.image}" alt="">
            <div class="card-conteudo">
                <span class="card-categoria">${post.category}</span>
                <p class="card-titulo">${post.title}</p>
                <div class="card-rodape">
                    <span>${dia}</span>
                    <span>${hora}</span>
                </div>

                <div class="botoes">
                    <button class="btn-editar" onclick="abrirEditar(${post.id})">Editar</button>
                    <button class="btn-excluir" onclick="abrirExcluir(${post.id})">Excluir</button>
                </div>
            </div>
        `;

		if (grid) grid.appendChild(card);
	});
}


function fecharModais() {
	if (modalCriar) modalCriar.style.display = "none";
	if (modalEditar) modalEditar.style.display = "none";
	if (modalExcluir) modalExcluir.style.display = "none";
}

function abrirModalCriar() {
	if (modalCriar) {
		criarInputs.forEach(input => input.value = "");
		modalCriar.style.display = "block";
	}
}

async function abrirEditar(id) {

	const response = await fetch(`${API_URL}/${id}`);
	const post = await response.json();

	idEditando = id;

	if (!post || editarInputs.length === 0) return;


	editarInputs[0].value = post.author || '';
	editarInputs[1].value = post.title || '';
	editarInputs[2].value = post.category || '';
	editarInputs[3].value = post.image || '';
	editarInputs[4].value = Array.isArray(post.content) ? post.content.join('\n') : post.content || '';

	modalEditar.style.display = "block";
}

function abrirExcluir(id) {
	idExcluindo = id;
	if (modalExcluir) modalExcluir.style.display = "block";
}


window.abrirEditar = abrirEditar;
window.abrirExcluir = abrirExcluir;

// INICIALIZAÇÃO E EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {

	// ABRIR MODAL
	if (btnNovoPost) {
		btnNovoPost.addEventListener("click", abrirModalCriar);
	}

	// SALVAR
	const btnSalvarCriar = modalCriar ? modalCriar.querySelector("button") : null;
	if (btnSalvarCriar) {
		btnSalvarCriar.addEventListener("click", async () => {

			const [author, title, category, image, content] = [...criarInputs].map(i => i.value.trim());

			if (!title || !author) return alert("Preencha o nome do autor e o título!");


			const newPost = {
				author,
				title,
				category,
				image,
				content: content.split('\n'),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};


			await createPost(newPost);

			fecharModais();
			await renderPosts();
		});
	}


	const btnSalvarEditar = modalEditar ? modalEditar.querySelector("button") : null;
	if (btnSalvarEditar) {
		btnSalvarEditar.addEventListener("click", async () => {

			const [author, title, category, image, content] = [...editarInputs].map(i => i.value.trim());

			const updatedPost = {
				author,
				title,
				category,
				image,
				content: content.split('\n'),
				updatedAt: new Date().toISOString(),
			};


			await updatePost(idEditando, updatedPost);

			fecharModais();
			await renderPosts();
		});
	}

	// EVENTO CONFIRMAR EXCLUSÃO
	if (btnExcluirConfirmar) {
		btnExcluirConfirmar.addEventListener("click", async () => {


			await deletePost(idExcluindo);

			fecharModais();
			await renderPosts();
		});
	}


	if (btnCancelarExcluir) {
		btnCancelarExcluir.addEventListener("click", fecharModais);
	}


	window.addEventListener("click", (event) => {
		if (event.target && event.target.classList.contains("modal")) {
			fecharModais();
		}
	});


	renderPosts();
});