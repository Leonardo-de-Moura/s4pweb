const BASE_URL = "http://localhost:3000/posts"; // exemplo de rota
// troque "posts" pela sua coleção do db.json

// GET – Buscar todos
export async function getAll() {
    const response = await fetch(BASE_URL);
    return response.json();
}

// GET – Buscar um por ID
export async function getById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
}

// POST – Criar novo
export async function create(data) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
}

// PUT – Atualizar
export async function update(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
}

// DELETE – Apagar
export async function remove(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });
    return response.json();
}
