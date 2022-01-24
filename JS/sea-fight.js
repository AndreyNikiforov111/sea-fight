// здесь наше представление
var view ={
	displayMessage: function (msg) {
		var massageArea = document.querySelector('#massageArea');			//элемент месседж эриа получаем по айди
		massageArea.innerHTML = msg;										//через переменную свойство иинер html записываем сообщение msg
	},

	displayHit: function(guess){
		var cell = document.getElementById(guess);
		cell.setAttribute('class', 'hit');
	},
	displayMiss: function(guess){
		var cell = document.getElementById(guess);
		cell.setAttribute('class', 'miss');

	}
};

// здесь наша модель поведения игры



var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];									//в переменную кладется поочередно корабль
			var index = ship.locations.indexOf(guess);					// поочередно стравнивается каждая локация корабля с нашей попыткой  
																		//если находится хоть одно совпадение indexOf возвращает 0,1,2(индекс совпавшего числа)
			if (ship.hits[index] === "hit") {							//проверка на уже попавший выстрел
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {									//если индекс наша переменная с выстрелом совпала с локацией !
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},
	// Метод создает в модели массив ships
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));					// принимает от collision true/false  
			this.ships[i].locations = locations;					//если true записываем в массив i (№ корабля) наши локации
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	// метод создает один корабль
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2); 						// рандомно выбираем направление корабля
		var row, col;

		if (direction === 1) { // horizontal								
			row = Math.floor(Math.random() * this.boardSize);								//если направление корабля горизонт строка выбирается рандомно по длинне поля
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));		// столбец выбирается короче на оставшиеся две клетки корабля
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}																//сгенерировал число передал его ниже
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));			//добавляем элемент в конец массива (горизонт) при каждой итерации добавл в столбец одну клетку к кораблю
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations; 										// мы создали один корабль и вернули его в массиве nShL;
	},

	// метод получает один корабль и проверяет, что тот не перекрывается с другими кораблями
	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];										//берем первый корабль из массива ships
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {			// мы сравниваем локации массива корабля с первой (и 2 а затем и 3) локацией сгенерированного корабля
					return true;			//это когда совпадение есть
				}
			}
		}
		return false;			//это когда совпадений нет и мы будем использовать false
	}
	
};



																






var controller = {
	guesses: 0,

	Controller:function(guess) {								//после проверки инпутов вызывается функция счетчика выстрелов
		var checkShot = processGuess(guess);						// кладем в переменную наш выстрел	
		if(checkShot){
			this.guesses ++;
			var hit = model.fire(checkShot);						//по функции fire проверяем наш выстрел если попал вернется true
			if(hit && model.shipSunk === model.numShips){		//последний выстрел попал и кол-во потопленных кораблей равно кол-ву кораблей то вы выйграли

				view.displayMassege('Вы потопили все корабли за ' + this.guesses + 'выстрелов');
			} 
		}
		
	}
}

function processGuess(guess) {
	var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];


	if(guess === null || guess.length !== 2){
		alert('Вы ввели неверные координаты');
	} else {
		firstChar = guess.charAt(0); 				// извлекаем из строки guess первый символ
		var row = alphabet.indexOf(firstChar);		// получаем индекс 
		var colum = guess.charAt(1);
		
		if(isNaN(row) || isNaN(colum)){																//isNaN смотрит являеются ли данные цифрами
			alert('Вы ввели неверные координаты');
		}else if (row < 0 || row >= model.boardSize || colum < 0 || colum >= model.boardSize){
			alert('Вы ввели неверные координаты');
		} else {
			return row + colum;
		}
	}
	return null;
}


function init(){
	var fireButton = document.getElementById('fireButton');						
	fireButton.onclick = handleFireButton; 									// мы пишем функцию для поля инпут и вызываем ее после .onclick
																			//поработаем с enter
	var guessInput = document.getElementById('guessInput');
			guessInput.onkeypress = handKeyPress;									// мы пишем функцию для кнопки
	model.generateShipLocations();											// вызываем функцию генерирующую корабль

}
window.onload = init;

function handleFireButton(){										//при нажатии кнопки мы берем
	var guessInput = document.getElementById('guessInput');			//наше поле координат выстрела 
	
	var guess = guessInput.value;									// мы получаем значение данного inputa
	controller.Controller(guess);									// кладем его в controller для дальнейшей проверки и обработки
	guessInput.value = "";											// полсе каждого нажатия кнопки возвращаем пустое поле
}





function handKeyPress (e){											// через е кей код мы проверяем совпадение с интером
	var fireButton = document.getElementById('fireButton');
	console.log(e.keyCode);
	if(e.keyCode == 13){
		fireButton.click();											//имитируем нажатие кнопки фаер
		return false;												//не отравляем наши данные form на сервер
	}
}

function alg(){
	var a = 1, b = 0;
	if(a&&b){console.log(true) }
	else{console.log(false)}

}
alg()


/*
controller.processGuess('A0');
controller.processGuess('A1');
controller.processGuess('A2');
controller.processGuess('A3');
controller.processGuess('A4');
controller.processGuess('A5');
controller.processGuess('A6');


controller.processGuess('B0');
controller.processGuess('B1');
controller.processGuess('B2');
controller.processGuess('B3');
controller.processGuess('B4');
controller.processGuess('B5');
controller.processGuess('B6');

controller.processGuess('C0');
controller.processGuess('C1');
controller.processGuess('C2');
controller.processGuess('C3');
controller.processGuess('C4');
controller.processGuess('C5');
controller.processGuess('C6');

controller.processGuess('D0');
controller.processGuess('D1');
controller.processGuess('D2');
controller.processGuess('D3');
controller.processGuess('D4');
controller.processGuess('D5');
controller.processGuess('D6');

controller.processGuess('E0');
controller.processGuess('E1');
controller.processGuess('E2');
controller.processGuess('E3');
controller.processGuess('E4');
controller.processGuess('E5');
controller.processGuess('E6');

controller.processGuess('F0');
controller.processGuess('F1');
controller.processGuess('F2');
controller.processGuess('F3');
controller.processGuess('F4');
controller.processGuess('F5');
controller.processGuess('F6');

controller.processGuess('G0');
controller.processGuess('G1');
controller.processGuess('G2');
controller.processGuess('G3');
controller.processGuess('G4');
controller.processGuess('G5');
controller.processGuess('G6');
*/








/*view.displayMassege('Some massege..');
view.displyHit("35");
view.displyMiss('23');*/