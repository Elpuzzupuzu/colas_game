const socket = io();
const colorContainer = document.getElementById('color-container');
const mensaje = document.getElementById('mensaje');
const scoreDisplay = document.getElementById('score'); // Elemento para mostrar el puntaje

let selectedColor = null;

socket.on('newColor', (color) => {
    addColorBox(color);
});

socket.on('colorQueue', (colorQueue) => {
    colorContainer.innerHTML = '';
    colorQueue.forEach(color => addColorBox(color));
});

socket.on('score', (score) => {
    scoreDisplay.textContent = `Aciertos: ${score}`; // Actualizar el contador de aciertos
});

// Función para agregar un cuadro de color
function addColorBox(color) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;
    colorContainer.appendChild(colorBox);
}

document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', (event) => {
        selectedColor = event.target.getAttribute('data-color');
        
        if (selectedColor) {
            socket.emit('removeColor', selectedColor);
        }
    });
});

socket.on('endGame', (message) => {
    mensaje.textContent = message;
    setTimeout(() => location.reload(), 5000); // Recargar la página después de 5 segundos
});
