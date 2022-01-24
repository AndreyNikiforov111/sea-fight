// здесь наше представление
var view = {
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
    numShips: 4,
    shipLength: 3,
    shipsSunk: 0,
    shipArea: 12,

    ships: [
        {locations: [0, 0, 0], hits: ["", "", ""], area: []}, //ареа область вокруг корабля
        {locations: [0, 0, 0], hits: ["", "", ""], area: []},
        {locations: [0, 0, 0], hits: ["", "", ""], area: []},
        {locations: [0, 0, 0], hits: ["", "", ""], area: []}
    ],

    fire: function (guess) {
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

                if (this.isSunk(ship)) {        //вызывет метод на потопленность коробля
                    view.displayMessage("You sank my battleship!");
                    for (j=0; j < ship.area.length; j++){
                        var missed = ship.area[j] // отправл на проверку наличие на поле локаций вокруг корабля
                        if (missed >= 0 && missed <= 66 && missed!= 07 && missed!= 08 && missed!= 09 && missed!= 17 && missed!= 18 && missed!=  19 && missed!= 27 && missed!= 28 && missed!= 29 && missed!= 37 && missed!= 38 && missed!= 39 && missed!= 47 && missed!= 48 && missed!= 49 && missed!= 57 && missed!= 58 && missed!= 59){
                            //если все лок. коробля потоплены мы присваиваем лок. вокруг коробля дисп. мисс
                            view.displayMiss(missed)
                        console.log(missed)
                        }
                    }
                        this.shipsSunk++;

                }
                return true;
            }
        }
        view.displayMiss(guess);        //если промазал
        view.displayMessage("You missed.");
        return false;
    },

       isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {       //поочередно проверяет локации кор. на потопленность
                return false;
            }
        }
        return true;
    },

    // Метод создает в модели массив ships
    generateShipLocations: function () {

        var locations;
        var area;
        var values;
        for (var i = 0; i < this.numShips; i++) {
            do { // генерирует первый корабль, и будет генерировать пока (this.collision(locations, area) не выдаст false
                values = this.generateShip();
                locations = values.first;   // массив нового коробля
                area = values.second;       // массив области вокруг него
            } while (this.collision(locations, area))		// передает проверяемые пер локации и области и принимает от collision true/false
           //выполнет только после fslse
            this.ships[i].locations = locations; //если true записываем в массив i (№ корабля) наши локации
            this.ships[i].area = area; //записывает выбранную область кор. в массив
        }
        //console.log("Ships array: ");
        console.log(this.ships);
    },
    // метод создает один корабль

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2); 						// рандомно выбираем направление корабля
        if (direction === 1) { // horizontal
            row = Math.floor(Math.random() * this.boardSize);								//если направление корабля горизонт строка выбирается рандомно по длинне поля
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));		// столбец выбирается короче на оставшиеся две клетки корабля
        } else { // vertical
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }																//сгенерировал число передал его ниже
        var newShipLocations = [];      // массив корабля
        var shipLocationArea = [];      // массив области вокруг коробля
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {   //horizont
                newShipLocations.push(row + "" + (col + i));			//добавляем элемент в конец массива (горизонт) при каждой итерации добавл в столбец одну клетку к кораблю
                shipLocationArea.push((row + 1 + "" + (col + i)), ((row - 1) + "" + (col + i)), ((row + i - 1) + "" + (col - 1)), ((row  - i + 1) + "" + (col + this.shipLength)));
                // добавляет за одну итерацию три точки воуруг корабля
            } else {// vertical
                newShipLocations.push((row + i) + "" + col);
                shipLocationArea.push(((row + i) + "" + (col + 1)), ((row + i) + "" + (col - 1)), ((row - 1) + "" + (col + i - 1)), ((row + this.shipLength) + "" + (col + i - 1 )));
            }
        }


        return {
            first: newShipLocations,
            second: shipLocationArea,
        }; 										// мы создали один корабль и вернули его в массиве nShL;

    },
    // метод получает один корабль и проверяет, что тот не перекрывается с другими кораблями
    collision: function (locations, area) {             //
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];										//берем первый корабль из массива ships
            for (var j = 0; j < this.shipArea; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0  || area.indexOf(ship.locations[j]) >= 0 || locations.indexOf(ship.area[j]) >= 0) {			// мы сравниваем локации массива корабля с первой (и 2 а затем и 3) локацией сгенерированного корабля
  // три проверки на совадение лок других кораблей, совпадение пространства вокруг нового кор. и созданные лок корабля, локации созданного корабля с областью вокруг уже созданных кораблей
                    // console.log(ship.locations.indexOf(locations[j]))
                   // console.log(area.indexOf(ship.locations[j]))

                    return true; //это когда совпадение есть
                }
            }
        }
      //console.log('secsess area ' + area.indexOf(ship.locations[j]))
      // console.log('secsess ' + ship.locations.indexOf(locations[j]))
        return false;	//это когда совпадений нет и мы будем использовать false
    },
    }
  //  collisionArea: function (area) {
    //    for (var i = 0; i < this.numShips; i++) {
      //      var ship = this.ships[i];
        //    for (d = 0; d < 2; d++) {
           //     if (area.indexOf(ship.locations[d]) >= 0) {			// мы сравниваем локации массива корабля с первой (и 2 а затем и 3) локацией сгенерированного корабля
             //       return 1;			                            //это когда совпадение есть
               // }
            //}
       // }
       // return 0;
//    },
   // chouse: if:(this.collision(locations) && this.collisionArea(locations)){
   //     return true;
  //  }  else: return false;

var controller = {
    guesses: 0,

    Controller:function(guess) {	// после проверки инпутов вызывается функция счетчика выстрелов
        var checkShot = processGuess(guess);     // кладем в переменную наш выстрел
        console.log(checkShot);
        if(checkShot){
            this.guesses ++;
            var hit = model.fire(checkShot);					//по функции fire проверяем наш выстрел если попал вернется true
            if(hit && model.shipSunk === model.numShips){		//последний выстрел попал и кол-во потопленных кораблей равно кол-ву кораблей то вы выйграли

                view.displayMassege('Вы потопили все корабли за ' + this.guesses + 'выстрелов');
            }
        }

    }
}

function processGuess(guess) {
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    var alphabetLol = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];      // исп маленькте буквы

    if(guess === null || guess.length !== 2){
        alert('Вы ввели неверные координаты');
    } else {
        firstChar = guess.charAt(0); 				// извлекаем из строки guess первый символ
        let row = alphabet.indexOf(firstChar);		// получаем индекс
        let row2 = alphabetLol.indexOf(firstChar);
       console.log(row)
        var colum = guess.charAt(1);
         if(isNaN(row) || isNaN(colum) || isNaN(row2)){		//если это не число														//isNaN смотрит являеются ли данные цифрами
            alert('Вы ввели неверные координаты');
        }else if (row2 < 0  && row < 0) {                   //если не наши в первом и второв списке букв
             alert('Вы ввели неверные координаты');
         }else if (row >= model.boardSize|| row2 >= model.boardSize || colum < 0 || colum >= model.boardSize){
             alert('Вы ввели неверные координаты'); // не должно быть болшее число чем клеток на поле
        } else if(row >= 0){    // если нашелся в первом алфавите вернет
            return row + colum;
                    } else{     // если нашелся во втором
             return row2 + colum
              }
    }
        return null
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
    //console.log(e.keyCode);
    if(e.keyCode == 13){
        fireButton.click();											//имитируем нажатие кнопки фаер
        return false;												//не отравляем наши данные form на сервер
    }
}




