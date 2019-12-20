const urlParams = new URLSearchParams(window.location.search);
const partido = urlParams.get('gp');

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
        pasarShips(app.juego.ships);
        pasarSalvoes(app.juego.salvoes);


    })
//$.post("/api/login", { username: "j.bauer@ctu.gov", password: "123" }).done(function() { console.log("logged in!"); })
//$.post("/api/logout").done(function() { console.log("logged out"); })
function verificarViewer(datos) {
    app.gameInfo.created = app.juego.created;
    for (var i = 0 in datos) {
        //console.log(datos[i] + ":" + partido);
        if (datos[i].id == partido) {
            //console.log(datos[i].id + ":" + partido);
            app.gameInfo.viewerID = datos[i].player.id;
            app.gameInfo.viewer = datos[i].player.userName;
        } else {
            app.gameInfo.notViewer = datos[i].player.userName;
        }
    }

}

function pasarSalvoes(datos) {
    //console.log(datos);

    var elemSalvoes = [];
    for (var i = 0 in datos) {
        //console.log(datos[i]);
        //console.log(app.gameInfo.viewerID);
        if (app.gameInfo.viewerID == datos[i].player) { //datos[i].player) app.gameInfo.viewerID //para separ Salvos del VIEWER
            for (var j = 0 in datos[i].salvoLocation) {
                //console.log(datos[i].salvoLocation[j]);

                elemSalvoes = document.getElementById(datos[i].salvoLocation[j] + 2);
                //console.log(elemSalvoes);

                elemSalvoes.classList.add("misSalvoes");

                elemSalvoes.innerHTML = datos[i].turn;
            }
        } else {
            for (var j = 0 in datos[i].salvoLocation) {
                //console.log(datos[i].salvoLocation[j]);

                elemSalvoes = document.getElementById(datos[i].salvoLocation[j] + 1);
                //console.log(elemSalvoes);

                elemSalvoes.classList.add("golpeados");

                if (elemSalvoes.className == "misBarcos golpeados") {
                    elemSalvoes.innerHTML = datos[i].turn;
                }
            }
        }
    }
}

function pasarShips(datos) {
    var elem = [];
    //console.log(datos);
    for (var i = 0 in datos) {
        for (var j = 0 in datos[i].location) {
            //console.log(datos[i].location[j]);
            /*for (var k = 0 in app.IDS) { // no es necsario porq ya estan! 
                if (app.IDS[k] == datos[i].location[j]) {
                    console.log(datos[i].location[j] + "esta!!");
                }
            }*/
            elem = document.getElementById(datos[i].location[j] + 1);
            //console.log(elem);

            elem.classList.add("misBarcos");

        }
    }

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
            /*for (var j = 0 in datosJS[i].ships) { //para pasar las posiciones y tipos de player1
                app.listaDeJuegos.player1.shipslocations.push(datosJS[i].ships[j].shipslocations);
                app.listaDeJuegos.player1.shipType.push(datosJS[i].ships[j].shipType);
            }*/
        }

        if (datosJS[i].gamePlayers[1] == null) {
            app.listaDeJuegos.player2.push('esperando Jugador 2!');
        } else {
            app.listaDeJuegos.player2.userName.push(datosJS[i].gamePlayers[1].player.userName);
            /*for (var j = 0 in datosJS[i].ships) { //para pasar las posiciones y tipos de player2
                app.listaDeJuegos.player2.shipslocations.push(datosJS[i].ships[j].shipslocations);
                app.listaDeJuegos.player2.shipType.push(datosJS[i].ships[j].shipType);
            }*/
        }

    }

}





var app = new Vue({
    el: "#app",
    data: {
        players: [],
        playersAux: [],
        col: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        row: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        juego: {},
        resumen: [],
        gameInfo: {
            created: "",
            viewer: "",
            notViewer: "",
            viewerID: "",
        },
        gameScore: [],
        methods: {
            getID: function (datos) { //para enviar informacion
                alert(datos);

            }
        }

    },
});