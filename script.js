const socket = io();

const colorContainer = document.getElementById('color-container');
const removeColorButton = document.getElementById('remove-color');
const colorSelect = document.getElementById('color-select');
const removedCountElement = document.getElementById('removed-count');
const endMessageElement = document.getElementById('end-message');

// Escuchar nuevos colores del servidor
socket.on('newColor', (color) => {
    addColorBox(color);
});

// Escuchar la cola de colores al conectarse
socket.on('colorQueue', (colorQueue) => {
    colorContainer.innerHTML = ''; // Limpiar el contenedor
    colorQueue.forEach(color => addColorBox(color));
});

// Escuchar el contador de eliminaciones al conectarse
socket.on('removedCount', (count) => {
    removedCountElement.textContent = count;
});

// Escuchar el mensaje de finalización del juego
socket.on('endGame', (message) => {
    endMessageElement.textContent = message;
    removeColorButton.disabled = true;
    colorSelect.disabled = true;
});

// Función para agregar un cuadro de color
function addColorBox(color) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;
    colorContainer.appendChild(colorBox);
}

// Eliminar el primer color en la cola seleccionado en el menú
removeColorButton.addEventListener('click', () => {
    const selectedColor = colorSelect.value;
    if (selectedColor) {
        socket.emit('removeColor', selectedColor);
    }
});
