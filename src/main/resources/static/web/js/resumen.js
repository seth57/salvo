var url = "/api/games";

fetch(url)
    .then(function (response) {
        //console.log('Request succeeded: ' + response.statusText);
        return response.json();
    })
    .then(function (datosJS) {
        verificarSesion(datosJS);
        llenarScores(datosJS.games);
        //app.resumen = datosJS;
        app.juegos = datosJS.games;
        //console.log(app.juegos);
    })
document.getElementById("formLogout").style.display = "none";
document.getElementById("mensajeError").style.display = "none";
document.getElementById("mensajeError2").style.display = "none";
document.getElementById("gameCreated").style.display = "none";

function verificarSesion(datos) {
    //console.log(datos);
    var partido = 0;
    if (datos.player != "null") {
        console.log("Usuario Reconectado!")
        document.getElementById("formLogin").style.display = "none"
        document.getElementById("formLogout").style.display = "block";
        //app.userLogged.push(datos.player.userName);
        saveLogged(datos);
        //guardarurl(datos);


    } else {
        console.log("Sin usuario logeado!")
    }
}

function saveLogged(datos) { //pendiente eliminar funcion **** solo una linea...
    //console.log(datos);
    app.userLogged = datos.player.userName;
    /* for (var i = 0 in datos.games) {
        //console.log(datos.games[i])
        for (var j = 0 in datos.games[i].gamePlayers) {

            //console.log(app.userLogged +": "+datos.games[i].gamePlayers[j].player.userName)
            if (app.userLogged == datos.games[i].gamePlayers[j].player.userName) {
                app.gpPlayersLogged.push(datos.games[i].gamePlayers[j].id);
            }
        }
    } */
    //console.log(app.gpPlayersLogged);
}

function llenarScores(datos) {
    //console.log(datos);

    for (var i = 0 in datos) {
        for (var j = 0 in datos[i].gamePlayers) {
            var win = 0;
            var lost = 0;
            var tied = 0;
            var total = 0;
            //console.log(datos[i].gamePlayers[j].score);
            if (datos[i].gamePlayers[j].score != null) { //si tiene score?

                var index = app.gameScore.findIndex(elem => elem.player === datos[i].gamePlayers[j].player.userName);

                //console.log(index);
                //console.log(datos[i].gamePlayers[j].player.userName + ": " + index + ": " + array[index])

                if (datos[i].gamePlayers[j].score.score == 1) { //si es ganador
                    win = 1;
                } else if (datos[i].gamePlayers[j].score.score == 0.5) { //si hubo empate
                    tied = 1;
                } else { //perdio
                    lost = 1;
                }

                total = win + (tied * 0.5);

                if (index == -1) { //si no esta creado
                    //console.log(index);

                    app.gameScore.push({
                        "player": datos[i].gamePlayers[j].player.userName,
                        "win": win,
                        "tied": tied,
                        "lost": lost,
                        "total": total,

                    });


                } else { // si ya esta creado
                    app.gameScore[index].player = datos[i].gamePlayers[j].player.userName;
                    app.gameScore[index].win += win;
                    app.gameScore[index].tied += tied;
                    app.gameScore[index].lost += lost;
                    app.gameScore[index].total += total;

                }
                // console.log(app.gameScore);
            } else { //sino...tiene score
                //console.log("juego no terminado");

            }
        }
    }

    //app.players = new Set(app.playersAux); //para eliminar los Repetidos

}



//$.post("/api/login", { username: "j.bauer@ctu.gov", password: "123" }).done(function() { console.log("logged in!"); })
//$.post("/api/logout").done(function() { console.log("logged out"); })

var app = new Vue({
    el: "#app",
    data: {
        userLogged: "",
        //gpPlayersLogged: [],
        gameurl: [],
        juegos: [],
        gameScore: [],
    },
    methods:{
        joinGame :function (gameid){
            urlgames = "/api/game/"+gameid+"/players"
            
            //console.log(urlgames);
              $.post(urlgames)
                .done(function (json) {
                   // console.log(json.gpid);
                    if (json.gpid != "Unauthorized") {
                        //document.getElementById("gameCreated").style.display = "block";
                        window.location.href = "/web/game.html?gp="+json.gpid;
        
                    }
                }).fail(function (error) {
                    console.log("join Fail!" + error.responseJSON.error);
                }) 
        },
        createGame :function () {
            urlgames = "/api/games"
            $.post(urlgames)
                .done(function (json) {
                    //console.log(json.gpid);
                    if (json.gpid != "Unauthorized") {
                        //document.getElementById("gameCreated").style.display = "block";
                        window.location.href="/web/game.html?gp="+json.gpid;
        
                    }
                }).fail(function (status, error) {
                    console.log("login Fail!" + status + error);
                })
        },
        login :function () {
            $.post("/api/login", {
                username: document.getElementById("username").value,
                password: document.getElementById("password").value
            }).done(function () {
                console.log("logged in!");
                document.getElementById("formLogin").style.display = "none"
                document.getElementById("formLogout").style.display = "block";
                document.getElementById("mensajeError2").style.display = "none";
                fetch(url)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (userJS) {
                        //console.log(userJS.player.userName);
                        //app.userLogged.push(userJS.player.userName);
                        saveLogged(userJS);
        
                        document.getElementById("mensajeError").style.display = "none";
                        //guardarurl(userJS);
                    })
        
            }).fail(function (status, error) {
                console.log("login Fail!" + status + error);
                document.getElementById("mensajeError2").style.display = "block";
        
            })
        },
        register :function () {
            urlRegister = "/api/players"
            $.post(urlRegister, {
                username: document.getElementById("username").value,
                password: document.getElementById("password").value
            }).done(function (json) {
                //console.log(json);
                if (json.error != "Nombre en Uso") {
                    document.getElementById("formLogin").style.display = "none"
                    document.getElementById("formLogout").style.display = "block";
                    document.getElementById("mensajeError").style.display = "none";
                } else {
                    document.getElementById("mensajeError").style.display = "block";
                }
                if (json.creado) {
                    //console.log(json.creado);
                    console.log("logged in!");
                    app.userLogged.push(json.creado);
        
                }
            }).fail(function (status, error) {
                console.log("login Fail!" + status + error);
            })
        },
        logout :function () {
            $.post("/api/logout")
                .done(function () {
                    console.log("logged out");
                    document.getElementById("formLogin").style.display = "block"
                    document.getElementById("formLogout").style.display = "none";
                    app.userLogged = [];
                    app.gpPlayersLogged = [];
                })
        
            //.done(console.log("done"))
            //.fail(console.log("fail"));
        
        }
    }
});