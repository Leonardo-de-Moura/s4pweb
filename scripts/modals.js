const API_URL = 'http://localhost:3000/posts'

// Elementos principais
const grid = document.querySelector('.artigos-grid')
const modalCriar = document.getElementById("modalCriar")
const modalEditar = document.getElementById("modalEditar")
const modalExcluir = document.getElementById("modalExcluir")
const criarInputs = document.querySelectorAll('#modalCriar input, #modalCriar textarea')
const editarInputs = document.querySelectorAll('#modalEditar input, #modalEditar textarea')

// Variáveis de estado
let idEditando = null
let idExcluindo = null
let todosPosts = []
let postsExibidos = 0
const POSTS_POR_PAGINA = 6
let carregando = false

// FUNÇÕES DE API
async function getPosts() {
    try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        return await response.json()
    } catch (error) {
        console.error("Erro ao buscar posts:", error)
        alert("Não foi possível carregar os posts. Verifique o servidor.")
        return []
    }
}

async function createPost(postData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
        if (!response.ok) throw new Error('Erro ao criar post')
        return await response.json()
    } catch (error) {
        console.error("Erro ao criar post:", error)
        alert("Erro ao criar postagem.")
        throw error
    }
}

async function updatePost(id, postData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
        if (!response.ok) throw new Error('Erro ao atualizar post')
        return await response.json()
    } catch (error) {
        console.error("Erro ao atualizar post:", error)
        alert("Erro ao atualizar postagem.")
        throw error
    }
}

async function deletePost(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE' 
        })
        if (!response.ok) throw new Error('Erro ao deletar post')
        return true
    } catch (error) {
        console.error("Erro ao deletar post:", error)
        alert("Erro ao excluir postagem.")
        throw error
    }
}

// FUNÇÕES DE UTILIDADE
function formatarData(dataString) {
    const data = new Date(dataString || Date.now())
    const dia = data.toLocaleDateString("pt-BR")
    const hora = data.toLocaleTimeString("pt-BR").slice(0, 5)
    return { dia, hora }
}

function fecharModais() {
    modalCriar.style.display = "none"
    modalEditar.style.display = "none"
    modalExcluir.style.display = "none"
    idEditando = null
    idExcluindo = null
}

// FUNÇÕES DE RENDERIZAÇÃO
function criarCardElement(post) {
    const { dia, hora } = formatarData(post.createdAt)
    
    const card = document.createElement("div")
    card.className = "card-artigo"
    card.dataset.id = post.id

    card.innerHTML = `
        <img src="${post.image || 'https://via.placeholder.com/300x200'}" alt="${post.title}">
        <div class="card-conteudo">
            <span class="card-categoria">${post.category || 'Sem categoria'}</span>
            <h3 class="card-titulo">${post.title}</h3>
            <p class="card-autor">Por: ${post.author || 'Autor desconhecido'}</p>
            
            <div class="card-rodape">
                <span>Criado em: ${dia}</span>
                <span>${hora}</span>
            </div>

            <div class="botoes">
                <button class="btn-editar" data-id="${post.id}">Editar</button>
                <button class="btn-excluir" data-id="${post.id}">Excluir</button>
            </div>
        </div>
    `

  
    
    return card
}

function renderizarPosts(posts) {
    if (!grid) return


    if (posts.length === 0 && postsExibidos === 0) {
        grid.innerHTML = '<p class="sem-posts">Nenhuma publicação encontrada.</p>'
        return
    }

    // Limpar grid apenas na primeira página
    if (postsExibidos === 0) {
        grid.innerHTML = ""
    }

    // Adicionar cada post ao grid
    posts.forEach(post => {
        const card = criarCardElement(post)
        grid.appendChild(card)
    })

    // Atualizar estado de paginação
    verificarMaisPosts()
}

function verificarMaisPosts() {
    const btnCarregarMais = document.querySelector('.botao-carregar-mais')
    if (!btnCarregarMais) return
    
    if (postsExibidos < todosPosts.length) {
        btnCarregarMais.style.display = 'block'
    } else {
        btnCarregarMais.style.display = 'none'
    }
}

// FUNÇÕES DE PAGINAÇÃO
async function carregarMaisPosts() {
    if (carregando) return
    
    carregando = true
    
    try {
        // Atualizar texto do botão
        const btnCarregarMais = document.querySelector('.botao-carregar-mais')
        if (btnCarregarMais) {
            btnCarregarMais.textContent = 'Carregando...'
            btnCarregarMais.disabled = true
        }
        
        // Calcular quantos posts carregar
        const postsRestantes = todosPosts.length - postsExibidos
        const quantidade = Math.min(POSTS_POR_PAGINA, postsRestantes)
        
        if (quantidade <= 0) {
            if (btnCarregarMais) btnCarregarMais.style.display = 'none'
            return
        }
        
        // Pegar próximos posts
        const proximosPosts = todosPosts.slice(postsExibidos, postsExibidos + quantidade)
        
        // Renderizar
        renderizarPosts(proximosPosts)
        
        // Atualizar contador
        postsExibidos += quantidade
        
    } catch (error) {
        console.error("Erro ao carregar mais posts:", error)
    } finally {
        carregando = false
        
        // Restaurar botão
        const btnCarregarMais = document.querySelector('.botao-carregar-mais')
        if (btnCarregarMais) {
            btnCarregarMais.textContent = 'Carregar mais'
            btnCarregarMais.disabled = false
        }
    }
}

async function carregarTodosPosts() {
    try {
        // Resetar paginação
        postsExibidos = 0
        
        // Buscar todos os posts
        todosPosts = await getPosts()
        
        // Ordenar por data (mais recentes primeiro)
        todosPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        
        // Limpar grid
        if (grid) grid.innerHTML = ""
        
        // Carregar primeira página
        await carregarMaisPosts()
        
    } catch (error) {
        console.error("Erro ao carregar posts:", error)
    }
}

// FUNÇÕES DOS MODAIS
function abrirModalCriar() {
    criarInputs.forEach(input => input.value = "")
    modalCriar.style.display = "block"
}

async function abrirEditar(id) {
    try {
        idEditando = id
        
        const response = await fetch(`${API_URL}/${id}`)
        if (!response.ok) throw new Error('Post não encontrado')
        
        const post = await response.json()
        if (!post) return

        // Preencher campos
        editarInputs[0].value = post.author || ''
        editarInputs[1].value = post.title || ''
        editarInputs[2].value = post.category || ''
        editarInputs[3].value = post.image || ''
        editarInputs[4].value = Array.isArray(post.content) ? 
            post.content.join('\n') : post.content || ''

        modalEditar.style.display = "block"
    } catch (error) {
        console.error("Erro ao abrir edição:", error)
        alert("Erro ao carregar postagem para edição.")
    }
}

function abrirExcluir(id) {
    idExcluindo = id
    modalExcluir.style.display = "block"
}

// CONFIGURAÇÃO DE EVENTOS
function configurarEventListeners() {
    // Botão de novo post
    const btnNovoPost = document.querySelector('.botao-busca')
    if (btnNovoPost) {
        btnNovoPost.addEventListener("click", abrirModalCriar)
    }

    // Botão carregar mais
    const btnCarregarMais = document.querySelector('.botao-carregar-mais')
    if (btnCarregarMais) {
        btnCarregarMais.addEventListener('click', carregarMaisPosts)
    }

    // Modal Criar - Salvar
    const btnSalvarCriar = modalCriar?.querySelector("button")
    if (btnSalvarCriar) {
        btnSalvarCriar.addEventListener("click", async () => {
            const [author, title, category, image, content] = 
                [...criarInputs].map(i => i.value.trim())

            if (!title || !author) {
                alert("Preencha o nome do autor e o título!")
                return
            }

            try {
                const newPost = {
                    author,
                    title,
                    category: category || 'Geral',
                    image: image || 'https://via.placeholder.com/300x200',
                    content: content.split('\n'),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }

                await createPost(newPost)
                fecharModais()
                await carregarTodosPosts()
            } catch (error) {
                console.error("Erro ao criar post:", error)
            }
        })
    }

    // Modal Editar - Salvar
    const btnSalvarEditar = modalEditar?.querySelector("button")
    if (btnSalvarEditar) {
        btnSalvarEditar.addEventListener("click", async () => {
            const [author, title, category, image, content] = 
                [...editarInputs].map(i => i.value.trim())

            if (!title || !author) {
                alert("Preencha o nome do autor e o título!")
                return
            }

            try {
                const updatedPost = {
                    author,
                    title,
                    category: category || 'Geral',
                    image: image || 'https://via.placeholder.com/300x200',
                    content: content.split('\n'),
                    updatedAt: new Date().toISOString()
                }

                await updatePost(idEditando, updatedPost)
                fecharModais()
                await carregarTodosPosts()
            } catch (error) {
                console.error("Erro ao atualizar post:", error)
            }
        })
    }

    // Modal Excluir - Confirmar e Cancelar
    const btnExcluirConfirmar = document.querySelector("#modalExcluir .btn-excluir")
    const btnCancelarExcluir = document.querySelector("#modalExcluir .btn-cancelar")

    if (btnExcluirConfirmar) {
        btnExcluirConfirmar.addEventListener("click", async () => {
            if (!idExcluindo) return
            
            try {
                await deletePost(idExcluindo)
                fecharModais()
                await carregarTodosPosts()
            } catch (error) {
                console.error("Erro ao excluir post:", error)
            }
        })
    }

    if (btnCancelarExcluir) {
        btnCancelarExcluir.addEventListener("click", fecharModais)
    }

    // Fechar modais ao clicar fora
    window.addEventListener("click", (event) => {
        if (event.target.classList.contains("modal")) {
            fecharModais()
        }
    })

    // Fechar modais com ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') fecharModais()
    })

    
    document.addEventListener('click', (event) => {
        // Botão Editar
        if (event.target.classList.contains('btn-editar')) {
            const id = event.target.dataset.id
            if (id) abrirEditar(id)
        }
        
        // Botão Excluir
        if (event.target.classList.contains('btn-excluir')) {
            const id = event.target.dataset.id
            if (id) abrirExcluir(id)
        }
    })
}


// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    configurarEventListeners()
    carregarTodosPosts()
})

// Expor funções para HTML
window.abrirEditar = abrirEditar
window.abrirExcluir = abrirExcluir