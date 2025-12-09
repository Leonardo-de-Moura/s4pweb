// api.js

// A BASE_URL AGORA APONTA APENAS PARA O SERVIDOR: http://localhost:3000
const BASE_URL = "http://localhost:3000"; 

// GET – Buscar todos
export async function getAll() {
    // Busca em: http://localhost:3000/posts
    const response = await fetch(`${BASE_URL}/posts`); 
    return response.json();
}

// GET – Buscar um por ID
export async function getById(id) {
    // Busca em: http://localhost:3000/posts/ID
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    return response.json();
}

// POST – Criar novo
export async function create(data) {
    // Cria em: http://localhost:3000/posts
    const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
}

// PUT – Atualizar
export async function update(id, data) {
    // Atualiza em: http://localhost:3000/posts/ID
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
}

// DELETE – Apagar
export async function remove(id) {
    // Deleta em: http://localhost:3000/posts/ID
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "DELETE"
    });
    return response.json();
}