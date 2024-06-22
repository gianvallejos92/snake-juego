document.addEventListener('DOMContentLoaded', () => {

  let width = 10; //# de cuadrados en el grid

  //Obtener elementos del DOM
  squares = document.querySelectorAll('.grid div');
  scoreDisplay = document.getElementById('scoreDisplay');
  startBtn = document.getElementById('btnStart');
  losegame = document.getElementById('lose-game');

  //Variables Globales
  let currentIndex = 0;
  let appleIndex = 0;
  let currentSnake = [2, 1, 0]; //2: Cabeza - 0: Cola
  let direction = 1;
  let score = 0;
  let speed = 0.9;
  let intervalTime = 0;
  let interval = 0;

  iniciarDivisionesDelGrid(width);

  //Iniciar Juego
  function iniciarJuego () {
    currentSnake.forEach(ind => { squares[ind].classList.remove('snake') });
    squares[appleIndex].classList.remove('apple');

    losegame.classList.add('none');
    losegame.classList.remove('show');

    clearInterval(interval);
    score = 0;
    generarManzanaAleatoria();
    direction = 1;
    scoreDisplay.innerHTML = score;
    intervalTime = 1000;
    currentSnake = [2, 1, 0];
    currentIndex = 0;

    currentSnake.forEach(snake => { squares[snake].classList.add('snake') });
    interval = setInterval(moveOutComes, intervalTime);
  }

  //
  function moveOutComes () {
    if (
      (currentSnake[0] % width === width - 1 && direction === 1) || //Last square at the right & keypress is the right
      (currentSnake[0] % width === 0 && direction === -1) || //Last square at the left & keypress is the left
      (currentSnake[0] + width >= (width * width) && direction === width) || //Bottom line Squares & keypress is the bottom
      (currentSnake[0] - width < 0 && direction === -width) || //First line squares & keypress is the upper
      squares[currentSnake[0] + direction].classList.contains('snake')
    ) {
      console.log('You lose the game');
      losegame.classList.remove('none');
      losegame.classList.add('show');
      return clearInterval(interval); //Lose the game      
    }

    const tail = currentSnake.pop();
    squares[tail].classList.remove('snake');
    currentSnake.unshift(currentSnake[0] + direction);
    
    if (squares[currentSnake[0]].classList.contains('apple')) {
      squares[currentSnake[0]].classList.remove('apple')
      squares[tail].classList.add('snake');
      currentSnake.push(tail);
      generarManzanaAleatoria();
      score+= (width*width);
      scoreDisplay.textContent = score;
      clearInterval(interval);
      intervalTime = intervalTime * speed;
      interval = setInterval(moveOutComes, intervalTime);
    }
    squares[currentSnake[0]].classList.add('snake');
    score += Math.floor(width*(intervalTime/1000));
    scoreDisplay.textContent = score;
  }

  //Generar Random Apple
  function generarManzanaAleatoria () {
    do {
      appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains('snake'));
    squares[appleIndex].classList.add('apple');
  }

  //Asignar funcion a las teclas
  function controlDeTeclas (e) {
    squares[currentIndex].classList.remove('snake');

    if (e.keyCode === 39) {
      direction = 1; //flecha derecha
    } else if (e.keyCode === 38) {
      direction = -width; //flecha arriba
    } else if (e.keyCode === 37) {
      direction = -1; //flecha izquierda
    } else if (e.keyCode === 40) {
      direction = +width; //flecha abajo
    }
  }

  function iniciarDivisionesDelGrid (width) {
    const grid = document.getElementById("grid");
    let divs = '';
    divs += '<span id="lose-game" class="none full-width-height">'
    divs += '  <span class="title full-width-height flex-center">Has perdido el juego</span>';
    divs += '  <span class="modal"></span>';
    divs += '</span>'
    for (let ind = 0; ind < width * width; ind++) {  
        divs += '<div></div>';
    }
    grid.innerHTML = divs;
  }

  document.addEventListener('keyup', controlDeTeclas);
  startBtn.addEventListener('click', iniciarJuego);
})

