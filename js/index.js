'use strict'
//Variables globales
var sudoku = [];//Sudoku resuelto.
var toSolve = [];//Arreglo desplegado a resolver.
var vacios = 3; //Espacios vacios por fila.(Default)
var vidas = 3;//Intentos
var puntuacion = 0;// Puntuacion
var modoMarcador = false; //Modo marcadores

//Referencias a variables que seran accedidas externamente y re utilizadas.
var botonMarcadores = document.getElementById("marcadores");
var pPuntuacion = document.getElementById("puntuacion");
var dialogoGanar = document.getElementById("dialogoGanar");
var dialogoPerder = document.getElementById("dialogoPerder");

crearTablero();

//---------------------Creacion del sudoku------------------//
//Creando tablero
function crearTablero(){
    let board = document.getElementById("sudoku");
    for (let i = 0 ; i < 9 ; i++) {
        let row = document.createElement("div");
        row.className = "r" + i.toString();
        for(let j = 0 ; j < 9 ; j++){
            let cell = document.createElement("input");
            cell.id = i.toString() + j.toString();
            cell.className = "cell";
            cell.addEventListener("keyup",()=>{
                verificar(cell);
            });
            cell.type="text"
            cell.autocomplete="off"
            //Impide que se acceda las columnas hasta el inicio del juego.
            cell.readOnly=true;
            if(j == 3 || j == 6){
                cell.style.marginLeft="10px";
            }
            //Agrega color azul grisaceo a las casillas. Formando tablero tipo ajedrez
            if(i%2 == 0 && j%2 == 0){
                cell.className+=" azul";
            }
            if(i%2 != 0 && j%2 != 0){
                cell.className+=" azul";
            }
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

//Crea el arreglo que contiene la solucion del sudoku.
function createSudoku(){
    var coor = findEmpty();
    if(coor == true){
        return true;
    }else{
        for(let i = 1 ; i < 10 ; i++){
            if(isValid(coor,i)){
                sudoku[coor[0]][coor[1]] = i;
                if(createSudoku()){
                    return true;
                }else{
                    sudoku[coor[0]][coor[1]]='';
                }
            }
        }
    }
}

//Funcion que valida que un numero puede estar en la posicion que esta.
function isValid(coor,val){
    if(sudoku[coor[0]].indexOf(val) != -1){
        return false;
    }
    for(let i = 0; i < 9 ; i++){
        if(sudoku[i][coor[1]] == val && i!= coor[0]){
            return false;
        }
    }
    let x= Math.floor(coor[1] / 3);
    let y = Math.floor(coor[0] / 3);
    for (let i = y*3 ; i < (y * 3) + 3 ; i++){
        for(let j = x * 3; j <(x * 3) + 3 ; j++){
            let ban1=sudoku[i][j] == val;
            let ban2=  (i != coor[0] && j != coor[1]);
            if( ban1 && ban2 ){
                return false;
            }
        }
    }
    return true;
}

//Funcion que define si un espacio en el sudoku al crearlo esta vacio.
function findEmpty(){
    for (let i = 0 ; i < 9 ; i++){
        for(let j = 0 ; j < 9; j++){
            if(sudoku[i][j] == ""){
                return [i,j];
            }
        }
    }
    return true;
}

//Funcion para crear el primer renglon.
function createFirstRow(){
    if(sudoku[0].indexOf("") == -1){
        return false;
    }else{
        let random=Math.floor(Math.random() * (10-1)+1);
        if(sudoku[0].indexOf(random) != -1){

        }else{
            sudoku[0][sudoku[0].indexOf("")] = random;
        }
        createFirstRow();
    }
}


//---------------------Inicializacion del sudoku------------------//

//Funcion que prepara todo para iniciar un sudoku nuevo.
function iniciar(){
    sudoku = [];//Reseteal el arreglo sudoku
    puntuacion = 0;
    resetearCeldas();//Quita la clase "falta" a todas las celdas que la tienen
    llenarSudoku();//Llena el arreglo sudoku
    toSolve = [];//Resetea el arreglo toSolve
    vidas = 3;//Resetea las vidas
    marcador();//Resetea el marcador
    createFirstRow();
    createSudoku();
    llenarPrueba();//Llena el arreglo toSolve y se muestra en las celdas.
}

//Recrea el tamaño del arreglo sudoku.
function llenarSudoku(){
    for (let i = 0 ; i < 9 ; i++) {
        sudoku.push([]);
        for(let j = 0 ; j < 9 ; j++){
            sudoku[i].push("");
        }
    }
}

/*Funcion que rellena el arreglo toSolve y muestra el valor
correspondiente en cada celda.*/
function llenarPrueba(){
    let saltar=[];
    for(let i = 0 ; i < 9 ; i++){
        saltar=elegirVacios();
        let temp=[];
        for(let j = 0 ; j < 9 ; j++){
            let ban1=saltar.indexOf(j)
            let cellId=i.toString()+j.toString();
            let cell=document.getElementById(cellId);
            if(ban1 != -1){
                //visual
                cell.style.color="black";
                cell.value="";
                cell.readOnly=false;
                cell.className+=" falta";
                //Interno
                temp.push("");
            }else{
                //visual
                cell.style.color="grey";
                cell.value=(sudoku[i][j]).toString();
                cell.readOnly=true;
                //interno
                temp.push(sudoku[i][j]);
            }
        } 
        toSolve.push(temp); 
    }
}

//Funcion para elegir qué celdas estaran vacias en una row.
function elegirVacios(){
    let array=[]
    for(let i = 0 ; i < vacios ; i++){
        let random
        do{
            random=Math.floor(Math.random() * 9);
        }
        while(array.indexOf(random) != -1)
        array.push(random);
    }
    return array;
}

//---------------------Resetear sudoku------------------//

//Funcion que quita la clase "falta" a todas las que lo tienen.
function resetearCeldas(){
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.classList.remove("falta");
        cell.placeholder="";
    }
}

//---------------------Control sudoku------------------//

//Funcion para activar modo marcadores. 
//Se quedaran los numeros introducidos como placeHolder de color azul sin haberlos verificado.
function modoMarcadores(){
    modoMarcador = !modoMarcador; //Activa o desactiva el modo marcar.
    console.log(modoMarcador);
    if(modoMarcador){
        botonMarcadores.innerHTML = "Desactivar";
        botonMarcadores.style.background = "#df0c20"
    }else{
        botonMarcadores.innerHTML = "Activar";
        botonMarcadores.style.background = "#40c840"
    }
}

//Verifica los numeros introducidos dentro del sudoku.
function verificar(cell){
    let temp=cell.id;
    let position=temp.split("");
    let row=parseInt(position[0],10);
    let col=parseInt(position[1],10);
    let valor=parseInt(cell.value,10);

    if(!modoMarcador){ //Si el modo marcadores no esta activado. Verificara correctamente.
        for (let i = 0 ; i < 9 ; i++) {
            for(let j = 0 ; j < 9 ; j++){
                if(row == i && col == j){
                    if(sudoku[i][j] == valor){
                        puntuacion++;
                        pPuntuacion.innerHTML = "Puntuacion: "+puntuacion;
                        cell.style.color="#0ae30a";
                        cell.readOnly=true;
                        cell.classList.remove("falta");
                        if(document.getElementsByClassName("falta").length<=0){
                            ganar();
                        }
                    }else{
                        //Si el valor es erroneo se almacena el valor introducido y se queda
                        //como placeHolder de color rojo.
                        cell.classList.remove("marcador");
                        cell.placeholder=cell.value;
                        cell.value="";
                        vidas--;
                        marcador();
                        if(vidas<=0){
                            perder();
                        }
                        return;
                    }
                }
            }
        }
    }else{//Si el modo marcadores esta activado...
        //Se quedaran los numeros introducidos como placeHolder de color azul sin haberlos verificado.
        cell.classList.add("marcador");
        cell.placeholder=cell.value;
        cell.value="";
    }
    
}

//funcion que actualiza el marcador.
function marcador(){
    let intentos=document.getElementById("vidas");
    let actual=document.createElement("p");
    actual.id="vidas";
    actual.innerHTML="Intentos: "+vidas.toString();
    let padre=intentos.parentNode;
    padre.replaceChild(actual,intentos);
}

//Despliega dialogo de haber ganado.
function ganar(){
    let mensaje = document.getElementById("pGanar");
    mensaje.innerHTML = `Felicidades!!  <br><br> 
                        Has ganado!!    <br><br> 
                        Tu puntuacion: ${puntuacion}`;
    dialogoGanar.showModal();
}

//Despliega dialogo de haber perdido y llama llenarFaltantes().
function perder(){
    let mensaje = document.getElementById("pPerder");
    mensaje.innerHTML = `Has perdido :c <br><br> 
                        Tu puntuacion: ${puntuacion}`;
    dialogoPerder.showModal();
    llenarFaltantes(); 
}

//Llena las celdas restantes en color rojo.
function llenarFaltantes(){
    for (let i = 0 ; i < 9 ; i++) {
        for(let j = 0 ; j < 9 ; j++){
            let cellId=i.toString()+j.toString();
            let cell=document.getElementById(cellId);
            if(cell.classList.contains("falta")){
                cell.value=(sudoku[i][j]).toString();
                cell.readOnly=true;
                cell.style.color="red";
            }
        }
    }
}




