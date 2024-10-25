const socket = io();
const colorContainer = document.getElementById('color-container');
const mensaje = document.getElementById('mensaje');

// Variables para el color seleccionado
let selectedColor = null;

// Escuchar nuevos colores del servidor
socket.on('newColor', (color) => {
    addColorBox(color);
});

// Escuchar la cola de colores al conectarse
socket.on('colorQueue', (colorQueue) => {
    colorContainer.innerHTML = '';
    colorQueue.forEach(color => addColorBox(color));
});

// Función para agregar un cuadro de color
function addColorBox(color) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;
    colorContainer.appendChild(colorBox);
}

// Seleccionar el color al hacer clic en un cuadro del menú
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', (event) => {
        selectedColor = event.target.getAttribute('data-color');
        
        // Emitir el color seleccionado al servidor para eliminar el cuadro correspondiente
        if (selectedColor) {
            socket.emit('removeColor', selectedColor);
        }
    });
});

// Escuchar el mensaje de fin del juego
socket.on('endGame', (message) => {
    mensaje.textContent = message;
    setTimeout(() => location.reload(), 5000); // Recargar la página después de 5 segundos
});
