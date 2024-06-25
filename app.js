document.addEventListener('DOMContentLoaded', () => {

  let width = 10; //# de cuadrados en el grid
  
  iniciarDivisionesDelGrid(width);

  //Obtener elementos del DOM
  const squares = document.querySelectorAll('.grid div');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const startBtn = document.getElementById('btnStart');
  const losegame = document.getElementById('lose-game');

  //Eventos
  document.addEventListener('keyup', controlDeTeclas);
  startBtn.addEventListener('click', startGame);

  //KeyCode Variables
  const RIGHT_KEYCODE = 39;
  const UP_KEYCODE = 38;
  const LEFT_KEYCODE = 37;
  const DOWN_KEYCODE = 40;
  
  //Variables Globales
  let currentIndex = 0;
  let appleIndex = 0;
  let currentSnake = [2, 1, 0]; //2: Cabeza - 0: Cola
  let direction = 1;
  let score = 0;
  let speed = 0.9;
  let intervalTime = 0;
  let interval = 0;

  /**
   * Inicia el juego al presionar el botón "Start"
   */
  function startGame () {
    cleanSnakeAndApple();
    handleGameOverModal(false);
    initGlobalVars();
    generateRandomApple();
    paintSnakeSquare();
    restartIntervals();
  }

  /**
   * Limpia toda la serpiente y la manzana
   *  */
  function cleanSnakeAndApple() {
    currentSnake.forEach(ind => { handleSquareClass(ind, 'snake', false); });
    handleSquareClass(appleIndex, 'apple', false);
  }

 /**
  * Muestra u oculta el modal de Game Over 
  * @param {boolean} state - true: Mostrar modal, false: Eliminar modal
  */
  function handleGameOverModal (state) {
    let addClass = 'none';
    let removeClass = 'show';
    if (state) {
      addClass = 'show';
      removeClass = 'none';
    }
    losegame.classList.add(addClass);
    losegame.classList.remove(removeClass);
  }

  /**
   * Inicia las variables global en su estado primario
   */
  function initGlobalVars () {
    setScoreValue(0);
    direction = 1;
    intervalTime = 1000;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
  }

  /**
   * Asigna un valor al score y este se muestra en pantalla
   * @param {Integer} value - Valor del puntaje actual
   */
  function setScoreValue(value) {
    score = (value === 0) ? value : score + value;
    scoreDisplay.innerHTML = score;
  }

  /**
   * Genera una manzana en una posición aleatoria que no coincida con la snake
   */
  function generateRandomApple () {
    do {
      appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains('snake'));
    handleSquareClass(appleIndex, 'apple', true);
  }

  /**
   * Para cada posición del Snake, lo pinta en la pantalla
   */
  function paintSnakeSquare () {
    currentSnake.forEach(snake => { handleSquareClass(snake, 'snake', true); });
  }

  /**
   * Agrega o remueve una class en el div de cierta posición del square
   * @param {Integer} index - índice del square a manipular
   * @param {String} className - clase que se agregará o removerá
   * @param {Boolean} state - True: Agrega una clase, False: Remueve la clase
   */
  function handleSquareClass(index, className, state) {
    if (state) {
      squares[index].classList.add(className);
    } else {
      squares[index].classList.remove(className);
    }
  }

  /**
   * Limpia todo intervalo
   * Multiplica el tiempo de intervalo actual
   * Y ejecuta el movimiento de la serpiente con la nueva velocidad
   */
  function restartIntervals() {
    clearInterval(interval);
    intervalTime *= speed;
    interval = setInterval(evaluateCurrentMovement, intervalTime);
  }

  /**
   * Evalua el nuevo movimiento de la serpiente
   * @returns Limpia el intervalo
   */
  function evaluateCurrentMovement () {
    if (isSnakeHeadInWrongPosition()) {
      handleGameOverModal(true);
      return clearInterval(interval);
    }

    const tail = moveSnakeAhead();    
    evaluateIfSnakeFindsApple(tail);
    handleSquareClass(currentSnake[0], 'snake', true); //Pinta la cabeza del snake en la manzana
    setScoreValue(Math.floor(width*(intervalTime/1000)));
  }

  /**
   * Evalua si la siguiente posición de la cabeza de la serpiente va fuera del recuadro 
   * por la derecha, izquierda, arriba o abajo, además de, verificar que no se choque consigo mismo
   * @returns true: Si la serpiente ha ido a una posición incorrecta, false: si la serpiente ha ido a una posición correcta.
   */
  function isSnakeHeadInWrongPosition() {
    return (
      (currentSnake[0] % width === width - 1 && direction === 1) || //Last square at the right & keypress is the right
      (currentSnake[0] % width === 0 && direction === -1) || //Last square at the left & keypress is the left
      (currentSnake[0] + width >= (width * width) && direction === width) || //Bottom line Squares & keypress is the bottom
      (currentSnake[0] - width < 0 && direction === -width) || //First line squares & keypress is the upper
      squares[currentSnake[0] + direction].classList.contains('snake')
    );
  }

  /**
   * Remueve la cola de la serpiente, lo despinta del recuadro y agrega la nueva posición según la dirección en la cabeza.
   * @returns posición del último elemento removido
   */
  function moveSnakeAhead () {
    const tail = currentSnake.pop();
    handleSquareClass(tail, 'snake', false);
    currentSnake.unshift(currentSnake[0] + direction);
    return tail;
  }

  /**
   * Verifica si la serpiente encontró una manzana
   * @param {Integer} tail - índice de la última posición de la cola de la serpiente
   */
  function evaluateIfSnakeFindsApple (tail) {
    if (squares[currentSnake[0]].classList.contains('apple')) { //Si la cabeza del snake encuentra una manzana
      paintWhenFindAppleSnake(tail);
      generateRandomApple();
      setScoreValue(width*width); //Actualiza el Score
      restartIntervals(); //Resetea los intervalos
    }
  }

  /**
   * Pinta la posición en donde la serpiente encontró la manzana
   * @param {Integer} tail - índice de la última posición de la cola de la serpiente
   */
  function paintWhenFindAppleSnake (tail) {
    handleSquareClass(currentSnake[0], 'apple', false); //Remueve la manzana del recuadro
    handleSquareClass(tail, 'snake', true); //Pinta la cabeza del snake en la manzana
    currentSnake.push(tail); //Agrega cola a la snake
  }

  /**
   * Despinta el cuadrado en donde está la serpiente al presionar la tecla y actualiza la dirección según la tecla programada
   * @param {Event} e - Evento al presionar las teclas del teclado
   */
  function controlDeTeclas (e) {
    if (currentIndex != 0) { //Excepcionando el primer cuadrado
      handleSquareClass(currentIndex, 'snake', false); //Despinta el Snake de la casilla actual
    }
    chooseDirectionByKeyCode(e.keyCode);    
  }

  /**
   * Verifica si la tecla presionada ha sido la derecha, izquierda, arriba o abajo,
   * de acuerdo a la tecla, se le agrega la posición a donde debería ir la serpiente
   * @param {Integer} keycode - Código de la tecla presionada
   */
  function chooseDirectionByKeyCode (keycode) {
    switch (keycode) {
      case RIGHT_KEYCODE:
        direction = 1;
        break;
      case UP_KEYCODE:
        direction = -width;
        break;
      case LEFT_KEYCODE:
        direction = -1;
        break;
      case DOWN_KEYCODE:
        direction = +width;
        break;
    }
  }

  /**
   * Agrega el modal del juego perdido y agrega los width*width cuadrados en el square
   * @param {Integer} width - Tamaño de filas y columnas del square
   */
  function iniciarDivisionesDelGrid (width) {
    const grid = document.getElementById("grid");
    let divs = '';
    divs += createGameOverModal('Has perdido el juego');
    divs += fillSquaresWithDiv(width * width);
    grid.innerHTML = divs;
  }

  /**
   * Genera el HTML del modal de Game Over
   * @param {String} msg - Mensaje del modal de Juego Perdido
   * @returns 
   */
  function createGameOverModal (msg) {
    let divs = '';
    divs += '<span id="lose-game" class="none full-width-height">'
    divs += '  <span class="title full-width-height flex-center">' + msg + '</span>';
    divs += '  <span class="modal"></span>';
    divs += '</span>'
    return divs;
  }

  /**
   * Agrega width*width cuadrados de divs
   * @param {Integer} size - width*width o tamaño de todo el square
   * @returns 
   */
  function fillSquaresWithDiv (size) {
    let divs = '';
    for (let ind = 0; ind < size; ind++) {  
      divs += '<div></div>';
    }
    return divs;
  }

})

