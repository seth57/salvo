const urlParams = new URLSearchParams(window.location.search);
const partido = urlParams.get('gp');
document.getElementById("buttonSaveShips").style.display = "none";
var options = {
    //grilla de 10 x 10
    width: 10,
    height: 10,
    //separacion entre elementos (les llaman widgets)
    verticalMargin: 0,
    //altura de las celdas
    cellHeight: 45,
    //desabilitando el resize de los widgets
    disableResize: true,
    //widgets flotantes
    float: true,
    //removeTimeout: 100,
    //permite que el widget ocupe mas de una columna
    disableOneColumnMode: true,
    //false permite mover, true impide
    staticGrid: false,
    //activa animaciones (cuando se suelta el elemento se ve más suave la caida)
    animate: true
}
var url = "/api/game_view/" + partido;
//var urlResumen = "/api/games";
fetch(url)
    .then(function (response) {
        //console.log('Request succeeded: ' + response.statusText);
        return response.json();

    })

    .then(function (datosJS) {
        console.log(datosJS);

        app.juego = datosJS;
        verificarViewer(app.juego.gamePlayers);
        verificarShips(app.juego.ships);
        pasarSalvoes(app.juego.salvoes);


    })

function verificarViewer(datos) {
    app.gameInfo.created = app.juego.created;
    for (var i = 0 in datos) {
        //console.log(datos[i]);
        if (datos[i].id == partido) {

            //console.log(datos[i].id + ":" + partido);
            app.gameInfo.viewerID = datos[i].player.id;
            app.gameInfo.viewer = datos[i].player.userName;
        } else {
            app.gameInfo.notViewer = datos[i].player.userName;
        }
    }

}
contadorTurnos = 0;

function pasarSalvoes(datos) {
    console.log(datos);
    var misSalvosDisparados = [];
    var elemSalvoes = [];
    for (var i = 0 in datos) {

        //console.log(datos[i]);
        //console.log(app.gameInfo.viewerID);
        for (var j = 0 in datos[i].salvoLocation) {
            //console.log(datos[i].salvoLocation[j]);
            if (app.gameInfo.viewerID == datos[i].player) { //datos[i].player) app.gameInfo.viewerID //para separ Salvos del VIEWER
                // console.log(datos[i].salvoLocation[j]);
                misSalvosDisparados = datos[i].salvoLocation[j] + datos[i].salvoLocation[j].substr(1, 1);
                //console.log(misSalvosDisparados);
                misSalvosDisparados = document.getElementById(datos[i].salvoLocation[j] + datos[i].salvoLocation[j].substr(1, 1));
                //console.log(misSalvosDisparados);
                misSalvosDisparados.classList.add("misDisparos");

                if (elemSalvoes.className == "misBarcos salvosEnemigos") {
                    //verificar despues
                    misSalvosDisparados.innerHTML = datos[i].turn;
                }
                //console.log(elemSalvoes);
            } else {
                elemSalvoes = document.getElementById(datos[i].salvoLocation[j]);
                //console.log(elemSalvoes);
                elemSalvoes.classList.add("salvosEnemigos");
                elemSalvoes.innerHTML = datos[i].turn;
                //console.log("tabla de mis disparos");
                //console.log(datos[i].salvoLocation[j] + datos[i].salvoLocation[j].substr(1, 1));
               

            }
            if (datos[i].turn > contadorTurnos) { //para tener el ultimo turno
                contadorTurnos = datos[i].turn
            }
        }
    }
    //console.log(contadorTurnos);
}






function llenarinfoJS(datosJS) {
    for (var i = 0 in datosJS) {
        //llenar lista de Juegos
        app.listaDeJuegos.id.push(datosJS[i].id);
        app.listaDeJuegos.created.push(datosJS[i].created);


        if (datosJS[i].gamePlayers[0] == null) {
            app.listaDeJuegos.player1.push('esperando Jugador 1!');
        } else {

            app.listaDeJuegos.player1.username.push(datosJS[i].gamePlayers[0].player.userName);

        }

        if (datosJS[i].gamePlayers[1] == null) {
            app.listaDeJuegos.player2.push('esperando Jugador 2!');
        } else {
            app.listaDeJuegos.player2.userName.push(datosJS[i].gamePlayers[1].player.userName);

        }

    }

}



function errores(jqXHR) { //para el manejo de errores en GAME
    switch (jqXHR.status) {
        case 400:
            console.log(jqXHR.responseText);
            break;
        case 401:
            console.log(jqXHR.responseText);
            break;
        case 403:
            console.log(jqXHR.responseText);
            break;
    }
}

function crearShips() {
    //$(function () {
    /*$('#carrier2').attr('data-gs-y')
"9"
$('#carrier2').attr('data-gs-x')
"7"
$('#carrier2').attr('data-gs-width')*/

    //se inicializa el grid con las opciones
    $('.grid-stack').gridstack(options);

    grid = $('#grid').data('gridstack');

    //agregando un elmento(widget) desde el javascript
    grid.addWidget($('<div id="carrier"><div class="grid-stack-item-content carrierHorizontal"></div><div/>'),
        0, 0, 5, 1); //x, y, width, height
    app.toPost.push({
        "shipType": "carrier",
        "shipLocations": ["A0", "A1", "A2", "A3", "A4"]
    })

    grid.addWidget($('<div id="BattleShip"><div class="grid-stack-item-content BattleShipHorizontal"></div><div/>'),
        1, 1, 4, 1); //x, y, width, height
    app.toPost.push({
        "shipType": "BattleShip",
        "shipLocations": ["B1", "B2", "B3", "B4"]
    })
    grid.addWidget($('<div id="Submarine"><div class="grid-stack-item-content SubmarineHorizontal"></div><div/>'),
        2, 2, 3, 1); //x, y, width, height
    app.toPost.push({
        "shipType": "Submarine",
        "shipLocations": ["C2", "C3", "C4"]
    })
    grid.addWidget($('<div id="destroyer"><div class="grid-stack-item-content destroyerHorizontal"></div><div/>'),
        3, 3, 3, 1); //x, y, width, height
    app.toPost.push({
        "shipType": "destroyer",
        "shipLocations": ["D3", "D4", "D5"]
    })
    grid.addWidget($('<div id="patrolBoat"><div class="grid-stack-item-content patrolBoatHorizontal"></div><div/>'),
        4, 4, 2, 1);
    app.toPost.push({
        "shipType": "patrolBoat",
        "shipLocations": ["E4", "E5"]
    })
    //verificando si un area se encuentra libre
    //no está libre, false
    console.log(grid.isAreaEmpty(1, 8, 3, 1));
    //está libre, true
    console.log(grid.isAreaEmpty(1, 7, 3, 1));

    $("#carrier").click(function () {
        var ship = document.getElementById("carrier");
        var X = ship.getAttribute("data-gs-x");
        var Y = ship.getAttribute("data-gs-y");
        if ($(this).children().hasClass("carrierHorizontal") && Y <= 5) {
            grid.resize($(this), 1, 5);
            $(this).children().removeClass("carrierHorizontal");
            $(this).children().addClass("carrierVertical");
        } else
        if ($(this).children().hasClass("carrierVertical") && X <= 5) {
            grid.resize($(this), 5, 1); //el, width, height
            $(this).children().addClass("carrierHorizontal");
            $(this).children().removeClass("carrierVertical");
        } //else{console.log("no hay espacio! Y: "+carrierX);}

    });
    $("#BattleShip").click(function () {
        var ship = document.getElementById("BattleShip");
        var X = ship.getAttribute("data-gs-x");
        var Y = ship.getAttribute("data-gs-y");
        if ($(this).children().hasClass("BattleShipHorizontal") && Y <= 6) {
            grid.resize($(this), 1, 4);
            $(this).children().removeClass("BattleShipHorizontal");
            $(this).children().addClass("BattleShipVertical");
        } else
        if ($(this).children().hasClass("BattleShipVertical") && X <= 6) {
            grid.resize($(this), 4, 1); //el, width, height
            $(this).children().addClass("BattleShipHorizontal");
            $(this).children().removeClass("BattleShipVertical");
        }
    });
    $("#Submarine").click(function () {
        var ship = document.getElementById("Submarine");
        var X = ship.getAttribute("data-gs-x");
        var Y = ship.getAttribute("data-gs-y");
        if ($(this).children().hasClass("SubmarineHorizontal") && Y <= 7) {
            grid.resize($(this), 1, 3);
            $(this).children().removeClass("SubmarineHorizontal");
            $(this).children().addClass("SubmarineVertical");
        } else
        if ($(this).children().hasClass("SubmarineVertical") && X <= 7) {
            grid.resize($(this), 3, 1); //el, width, height
            $(this).children().addClass("SubmarineHorizontal");
            $(this).children().removeClass("SubmarineVertical");
        }
    });
    $("#destroyer").click(function () {
        var ship = document.getElementById("destroyer");
        var X = ship.getAttribute("data-gs-x");
        var Y = ship.getAttribute("data-gs-y");
        if ($(this).children().hasClass("destroyerHorizontal") && Y <= 7) {
            grid.resize($(this), 1, 3);
            $(this).children().removeClass("destroyerHorizontal");
            $(this).children().addClass("destroyerVertical");
        } else
        if ($(this).children().hasClass("destroyerVertical") && X <= 7) {
            grid.resize($(this), 3, 1); //el, width, height
            $(this).children().addClass("destroyerHorizontal");
            $(this).children().removeClass("destroyerVertical");
        }
    });
    $("#patrolBoat").click(function () {
        var ship = document.getElementById("patrolBoat");
        var X = ship.getAttribute("data-gs-x");
        var Y = ship.getAttribute("data-gs-y");
        if ($(this).children().hasClass("patrolBoatHorizontal") && Y <= 8) {
            grid.resize($(this), 1, 2);
            $(this).children().removeClass("patrolBoatHorizontal");
            $(this).children().addClass("patrolBoatVertical");
        } else
        if ($(this).children().hasClass("patrolBoatVertical") && X <= 8) {
            grid.resize($(this), 2, 1);
            $(this).children().addClass("patrolBoatHorizontal");
            $(this).children().removeClass("patrolBoatVertical");
        }
    });

    //todas las funciones se encuentran en la documentación
    //https://github.com/gridstack/gridstack.js/tree/develop/doc


    //});
}

function verificarShips(datos) {

    var elem = [];
    //console.log(datos);
    if (datos.length == 0) { //no tiene barcos
        //console.log("sin barcos!");
        document.getElementById("buttonSaveShips").style.display = "block";
        crearShips();
    } else {
        options.staticGrid = true;
        $('.grid-stack').gridstack(options);
        grid = $('#grid').data('gridstack');
        //console.log("con barcos!");

        for (var i = 0 in datos) {
            //console.log(datos[i].location);


            if (datos[i].type == "carrier") {
                var newArray = [];
                newArray = datos[i].location.join('');
                //console.log(newArray);
                if (newArray.substr(0, 1) == newArray.substr(2, 1)) { //horizontal
                    //console.log("carrier horinzontal: "+ desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    //agregando un elmento(widget)
                    grid.addWidget($('<div id="carrier"><div class="grid-stack-item-content carrierHorizontal"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 5, 1); //x, y, width, height

                } else { //vertical
                    //console.log("carrier vertical: "+desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    grid.addWidget($('<div id="carrier"><div class="grid-stack-item-content carrierVertical"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 1, 5); //x, y, width, height
                }
            }
            if (datos[i].type == "BattleShip") {
                var newArray = [];
                newArray = datos[i].location.join('');
                //console.log(newArray);
                if (newArray.substr(0, 1) == newArray.substr(2, 1)) { //horizontal
                    //console.log("BattleShip horinzontal: "+ desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    //agregando un elmento(widget)
                    grid.addWidget($('<div id="BattleShip"><div class="grid-stack-item-content BattleShipHorizontal"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 4, 1); //x, y, width, height

                } else { //vertical
                    // console.log("BattleShip vertical: "+desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    grid.addWidget($('<div id="BattleShip"><div class="grid-stack-item-content BattleShipVertical"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 1, 4); //x, y, width, height
                }
            }
            if (datos[i].type == "Submarine") {
                var newArray = [];
                newArray = datos[i].location.join('');
                //console.log(newArray);
                if (newArray.substr(0, 1) == newArray.substr(2, 1)) { //horizontal
                    //console.log("Submarine horinzontal: "+ desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    //agregando un elmento(widget)
                    grid.addWidget($('<div id="Submarine"><div class="grid-stack-item-content SubmarineHorizontal"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 3, 1); //x, y, width, height

                } else { //vertical
                    //console.log("Submarine vertical: "+desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    grid.addWidget($('<div id="Submarine"><div class="grid-stack-item-content SubmarineVertical"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 1, 3); //x, y, width, height
                }
            }
            if (datos[i].type == "destroyer") {
                var newArray = [];
                newArray = datos[i].location.join('');
                //console.log(newArray);
                if (newArray.substr(0, 1) == newArray.substr(2, 1)) { //horizontal
                    //console.log("destroyer horinzontal: "+ desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    //agregando un elmento(widget)
                    grid.addWidget($('<div id="destroyer"><div class="grid-stack-item-content destroyerHorizontal"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 3, 1); //x, y, width, height

                } else { //vertical
                    // console.log("destroyer vertical: "+desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    grid.addWidget($('<div id="destroyer"><div class="grid-stack-item-content destroyerVertical"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 1, 3); //x, y, width, height
                }
            }
            if (datos[i].type == "patrolBoat") {
                var newArray = [];
                newArray = datos[i].location.join('');
                //console.log(newArray);
                if (newArray.substr(0, 1) == newArray.substr(2, 1)) { //horizontal
                    //console.log("patrolBoat horinzontal: "+ desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    //agregando un elmento(widget)
                    grid.addWidget($('<div id="patrolBoat"><div class="grid-stack-item-content patrolBoatHorizontal"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 2, 1); //x, y, width, height

                } else { //vertical
                    //console.log("patrolBoat vertical: "+desconversion(newArray.substr(0, 1))+" "+newArray.substr(1, 1));
                    grid.addWidget($('<div id="patrolBoat"><div class="grid-stack-item-content patrolBoatVertical"></div><div/>'),
                        newArray.substr(1, 1), desconversion(newArray.substr(0, 1)), 1, 2); //x, y, width, height
                }
            }

            for (var j = 0 in datos[i].location) { //solo dibuja la grilla

                elem = document.getElementById(datos[i].location[j]);

                elem.classList.add("misBarcos");
                //console.log(elem);
            }
        }

    }
}

function goBack() {
    window.history.back();
}

function savePosition() {
    var j = 0;
    app.postionToJAVA = [];

    var nodosDeShips = grid.grid.nodes;
    app.toPost = [];
    for (var i = 0 in nodosDeShips) {
        //console.log(nodosDeShips[i]);
        var tipoDeShip = nodosDeShips[i].el[0].id;
        //console.log(tipoDeShip);

        if (tipoDeShip == "carrier") {
            app.carrierPosition = [];
            var carrier = document.getElementById("carrier");
            var carrierX = carrier.getAttribute("data-gs-x");
            var carrierY = carrier.getAttribute("data-gs-y");
            var ancho = carrier.getAttribute("data-gs-width");
            var hastaX = parseInt(carrierX, 10) + 5;
            var hastaY = parseInt(carrierY, 10) + 5;
            //console.log("Fila:X->letra:" + conversion(carrierX) + "  Columna:Y->Numb:" + carrierY);
            if (ancho != 1) { //esta horizontal?
                for (var j = parseInt(carrierX, 10); j < hastaX; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(carrierX)+j);
                    app.carrierPosition.push(conversion(carrierY) + j);
                }
            } else { //sino vertical
                for (var j = parseInt(carrierY, 10); j < hastaY; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(j.toString(10))+carrierX);

                    app.carrierPosition.push(conversion(j.toString(10)) + carrierX);
                }
            }

            app.toPost.push({
                "shipType": "carrier",
                "shipLocations": app.carrierPosition
            })

        }
        if (tipoDeShip == "BattleShip") {
            app.BattleShipPosition = [];
            var BattleShip = document.getElementById("BattleShip");
            var BattleShipX = BattleShip.getAttribute("data-gs-x");
            var BattleShipY = BattleShip.getAttribute("data-gs-y");
            var ancho = BattleShip.getAttribute("data-gs-width");
            var hastaX = parseInt(BattleShipX, 10) + 4;
            var hastaY = parseInt(BattleShipY, 10) + 4;
            //console.log("Fila:X->letra:" + conversion(BattleShipX) + "  Columna:Y->Numb:" + BattleShipY);
            if (ancho != 1) { //esta horizontal?
                for (var j = parseInt(BattleShipX, 10); j < hastaX; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(BattleShipX)+j);
                    app.BattleShipPosition.push(conversion(BattleShipY) + j);
                }
            } else { //sino vertical
                for (var j = parseInt(BattleShipY, 10); j < hastaY; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(j.toString(10))+BattleShipX);

                    app.BattleShipPosition.push(conversion(j.toString(10)) + BattleShipX);
                }
            }

            app.toPost.push({
                "shipType": "BattleShip",
                "shipLocations": app.BattleShipPosition
            })

        }
        if (tipoDeShip == "Submarine") {
            app.SubmarinePosition = [];
            var Submarine = document.getElementById("Submarine");
            var SubmarineX = Submarine.getAttribute("data-gs-x");
            var SubmarineY = Submarine.getAttribute("data-gs-y");
            var ancho = Submarine.getAttribute("data-gs-width");
            var hastaX = parseInt(SubmarineX, 10) + 3;
            var hastaY = parseInt(SubmarineY, 10) + 3;
            //console.log("Fila:X->letra:" + conversion(SubmarineX) + "  Columna:Y->Numb:" + SubmarineY);
            if (ancho != 1) { //esta horizontal?
                for (var j = parseInt(SubmarineX, 10); j < hastaX; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(SubmarineX)+j);
                    app.SubmarinePosition.push(conversion(SubmarineY) + j);
                }
            } else { //sino vertical
                for (var j = parseInt(SubmarineY, 10); j < hastaY; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(j.toString(10))+SubmarineX);

                    app.SubmarinePosition.push(conversion(j.toString(10)) + SubmarineX);
                }
            }

            app.toPost.push({
                "shipType": "Submarine",
                "shipLocations": app.SubmarinePosition
            })

        }
        if (tipoDeShip == "destroyer") {
            app.destroyerPosition = [];
            var destroyer = document.getElementById("destroyer");
            var destroyerX = destroyer.getAttribute("data-gs-x");
            var destroyerY = destroyer.getAttribute("data-gs-y");
            var ancho = destroyer.getAttribute("data-gs-width");
            var hastaX = parseInt(destroyerX, 10) + 3;
            var hastaY = parseInt(destroyerY, 10) + 3;
            //console.log("Fila:X->letra:" + conversion(destroyerX) + "  Columna:Y->Numb:" + destroyerY);
            if (ancho != 1) { //esta horizontal?
                for (var j = parseInt(destroyerX, 10); j < hastaX; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(destroyerX)+j);
                    app.destroyerPosition.push(conversion(destroyerY) + j);
                }
            } else { //sino vertical
                for (var j = parseInt(destroyerY, 10); j < hastaY; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(j.toString(10))+destroyerX);

                    app.destroyerPosition.push(conversion(j.toString(10)) + destroyerX);
                }
            }

            app.toPost.push({
                "shipType": "destroyer",
                "shipLocations": app.destroyerPosition
            })

        }
        if (tipoDeShip == "patrolBoat") {
            app.patrolBoatPosition = [];
            var patrolBoat = document.getElementById("patrolBoat");
            var patrolBoatX = patrolBoat.getAttribute("data-gs-x");
            var patrolBoatY = patrolBoat.getAttribute("data-gs-y");
            var ancho = patrolBoat.getAttribute("data-gs-width");
            var hastaX = parseInt(patrolBoatX, 10) + 2;
            var hastaY = parseInt(patrolBoatY, 10) + 2;
            //console.log("Fila:X->letra:" + conversion(patrolBoatX) + "  Columna:Y->Numb:" + patrolBoatY);
            if (ancho != 1) { //esta horizontal?
                for (var j = parseInt(patrolBoatX, 10); j < hastaX; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(patrolBoatX)+j);
                    app.patrolBoatPosition.push(conversion(patrolBoatY) + j);
                }
            } else { //sino vertical
                for (var j = parseInt(patrolBoatY, 10); j < hastaY; j++) { //condatenar posiciones y guardarla en la variable x antes de enviarla por post
                    //console.log(conversion(j.toString(10))+patrolBoatX);

                    app.patrolBoatPosition.push(conversion(j.toString(10)) + patrolBoatX);
                }
            }

            app.toPost.push({
                "shipType": "patrolBoat",
                "shipLocations": app.patrolBoatPosition
            })

        }
    }
    /* 
     console.log(app.carrierPosition);
     console.log(app.BattleShipPosition);
     console.log(app.SubmarinePosition);
     console.log(app.destroyerPosition);
     console.log(app.patrolBoatPosition);  */

    //console.log(app.toPost);
}

function desconversion(valor) {
    switch (valor) {
        case "A":
            valor = "0";
            break;
        case "B":
            valor = "1";
            break;
        case "C":
            valor = "2";
            break;
        case "D":
            valor = "3";
            break;
        case "E":
            valor = "4";
            break;
        case "F":
            valor = "5";
            break;
        case "G":
            valor = "6";
            break;
        case "H":
            valor = "7";
            break;
        case "I":
            valor = "8";
            break;
        case "J":
            valor = "9";
            break;
        default:
            valor = "SV-";
            break;
    }
    return valor;
}

function conversion(valor) {
    switch (valor) {
        case "0":
            valor = "A";
            break;
        case "1":
            valor = "B";
            break;
        case "2":
            valor = "C";
            break;
        case "3":
            valor = "D";
            break;
        case "4":
            valor = "E";
            break;
        case "5":
            valor = "F";
            break;
        case "6":
            valor = "G";
            break;
        case "7":
            valor = "H";
            break;
        case "8":
            valor = "I";
            break;
        case "9":
            valor = "J";
            break;
        default:
            valor = "SV-";
            break;
    }
    return valor;
}

function saveShips() {
    savePosition();
    //console.log(app.toPost);
    $.post({

            url: '/api/games/players/' + partido + '/ships',
            data: JSON.stringify(app.toPost),
            success: function () {
                window.location.reload();
                //console.log("mensaje");
            },
            dataType: "text",
            contentType: "application/json"
        })
        .done(function (response, status, jqXHR) {
            console.log(response);

        })
        .fail(function (jqXHR) {
            errores(jqXHR);

            //console.log(jqXHR.responseText);
        })
}

function saveSalvos() {

    $.post({

            url: '/api/games/players/' + partido + '/salvos',
            data: JSON.stringify({
                "turn": contadorTurnos + 1,
                "salvoLocations": app.salvosToSend
            }),
            success: function () {

                window.location.reload();
                //console.log("mensaje");
            },
            dataType: "text",
            contentType: "application/json"
        })
        .done(function (response, status, jqXHR) {
            console.log(response);

        })
        .fail(function (jqXHR) {
            errores(jqXHR);

            //console.log(jqXHR.responseText);
        })
}

var contDisparos = 1;
var app = new Vue({
    el: "#app",
    data: {

        salvosToSend: [],

        carrierPosition: [],
        BattleShipPosition: [],
        SubmarinePosition: [],
        destroyerPosition: [],
        patrolBoatPosition: [],
        toPost: [],
        players: [],
        playersAux: [],
        row: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        col: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        juego: {},
        resumen: [],
        gameInfo: {
            created: "",
            viewer: "",
            notViewer: "",
            viewerID: "",
        },
        gameScore: [],
    },
    methods: {
        seleccion: function (id) {
            //console.log(id); 
            if (contDisparos <= 5) {
                xx = document.getElementById(id);
                if (xx.classList != "misDisparos") {

                    xx.classList.add("misDisparos");
                    //console.log(id.charAt(id.length-1));
                    if (parseInt(id.charAt(id.length - 1), 10) != 0) {

                        //console.log((id.substr(0,1))+(parseInt(id.charAt(id.length-1),10)-1));
                        app.salvosToSend.push((id.substr(0, 1)) + (parseInt(id.charAt(id.length - 1), 10) - 1));
                    } else {
                        //console.log((id.substr(0,1)+9));
                        app.salvosToSend.push((id.substr(0, 1) + 9));
                    }
                    contDisparos = contDisparos + 1;
                    console.log(app.salvosToSend);
                } else {
                    console.log("Sitio ya usado!");
                }
            } else {
                console.log("No mas disparos");
                   }
        }
    }
});