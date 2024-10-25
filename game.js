const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

// Servir los archivos estáticos desde la raíz
app.use(express.static(__dirname));

// Cola de colores y lógica de colores
const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
let colorQueue = [];
const maxColors = 7; // Límite de colores en la cola
const endGameQueueLength = 5; // Longitud de la cola para finalizar el juego
let removedColorsCount = 0;

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Generar un nuevo color cada 10 segundos
const colorGenerationInterval = setInterval(() => {
    // Solo agregar colores si la cola tiene menos de 7 colores
    if (colorQueue.length < maxColors) {
        const newColor = getRandomColor();
        colorQueue.push(newColor);
        io.emit('newColor', newColor);
        
        // Verificar si la longitud de la cola es igual a 5 para finalizar el juego
        if (colorQueue.length === endGameQueueLength) {
            io.emit('endGame', `¡Juego terminado! Has eliminado correctamente ${removedColorsCount} cuadros.`);
            clearInterval(colorGenerationInterval);
        }
    }
}, 5000);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('colorQueue', colorQueue);
    socket.emit('removedCount', removedColorsCount);

    socket.on('removeColor', (color) => {
        const firstColorInQueue = colorQueue[0];
        if (firstColorInQueue && firstColorInQueue === color) {
            colorQueue.shift(); // Eliminar el primer elemento de la cola
            removedColorsCount++; // Incrementar el contador de eliminaciones correctas

            io.emit('colorQueue', colorQueue); // Emitir la nueva cola
            io.emit('removedCount', removedColorsCount); // Enviar el conteo actualizado

            // Verificar si la longitud de la cola es igual a 5 para finalizar el juego
            if (colorQueue.length === endGameQueueLength) {
                io.emit('endGame', `¡Juego terminado! Has eliminado correctamente ${removedColorsCount} cuadros.`);
                clearInterval(colorGenerationInterval);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
