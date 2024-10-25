const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.static(__dirname));

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
let colorQueue = [];
const maxColors = 7;
const endGameQueueLength = 5;
let removedColorsCount = 0; // Contador de colores eliminados
let score = 0; // Contador de aciertos

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

const colorGenerationInterval = setInterval(() => {
    if (colorQueue.length < maxColors) {
        const newColor = getRandomColor();
        colorQueue.push(newColor);
        io.emit('newColor', newColor);
        
        if (colorQueue.length === endGameQueueLength) {
            io.emit('endGame', `¡Juego terminado! Has eliminado correctamente ${removedColorsCount} cuadros. Tu puntaje final es: ${score}.`);
            clearInterval(colorGenerationInterval);
        }
    }
}, 5000);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('colorQueue', colorQueue);
    socket.emit('removedCount', removedColorsCount);
    socket.emit('score', score); // Emitir el puntaje inicial

    socket.on('removeColor', (color) => {
        const firstColorInQueue = colorQueue[0];
        if (firstColorInQueue && firstColorInQueue === color) {
            colorQueue.shift();
            removedColorsCount++;
            score++; // Incrementar el contador de aciertos

            io.emit('colorQueue', colorQueue);
            io.emit('removedCount', removedColorsCount);
            io.emit('score', score); // Emitir el nuevo puntaje

            if (colorQueue.length === endGameQueueLength) {
                io.emit('endGame', `¡Juego terminado! Has eliminado correctamente ${removedColorsCount} cuadros. Tu puntaje final es: ${score}.`);
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
