const apiUrl = 'http://localhost:3000/api/items';

// Función para obtener los elementos
async function obtenerItems() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre}: ${item.descripcion}`;

        // Botón de Actualizar
        const actualizarBtn = document.createElement('button');
        actualizarBtn.textContent = 'Actualizar';
        actualizarBtn.onclick = () => actualizarItem(item.id);

        // Botón de Eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarItem(item.id);

        li.appendChild(actualizarBtn);
        li.appendChild(eliminarBtn);

        lista.appendChild(li);
    });
}

// Función para agregar un nuevo elemento
async function agregarItem() {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, descripcion })
    });

    if (response.ok) {
        alert('Elemento agregado');
        obtenerItems(); // Refrescar la lista
    } else {
        alert('Error al agregar el elemento');
    }
}

// Función para actualizar un elemento
async function actualizarItem(id) {
    const nombre = prompt('Nuevo nombre:');
    const descripcion = prompt('Nueva descripción:');

    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, descripcion })
    });

    if (response.ok) {
        alert('Elemento actualizado');
        obtenerItems(); // Refrescar la lista
    } else {
        alert('Error al actualizar el elemento');
    }
}

// Función para eliminar un elemento
async function eliminarItem(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Elemento eliminado');
        obtenerItems(); // Refrescar la lista
    } else {
        alert('Error al eliminar el elemento');
    }
}

// Cargar los elementos al inicio
window.onload = obtenerItems;
