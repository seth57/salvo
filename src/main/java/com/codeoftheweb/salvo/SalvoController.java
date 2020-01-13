package com.codeoftheweb.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

    @Autowired
    private ShipRepository shipRepository;

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /*@RequestMapping("/games")
    private List<Object> getAllgames() {
        return gameRepository
                .findAll()
                .stream()
                .map(Game::gameDTOconGamePlayers)
                .collect(Collectors.toList());
    }*/

    ///original
    /*
    @RequestMapping("/game_view/{id}")
    private List<Object> getGamePlayerById(@PathVariable Long id){//@PathVariable Long id) {//Map<String, Object>
        //return gamePlayerRepository.findById(id).get().gameViewDTO()
        return gamePlayerRepository.findById(id).stream().map(GamePlayer::gameViewDTO).collect(Collectors.toList());
    }
*/

    @RequestMapping("/game_view/{id}")
    private ResponseEntity<Map<String, Object>> getGamePlayerById(@PathVariable Long id, Authentication authentication) {//@PathVariable Long id) {//Map<String, Object>
        Player player = playerRepository.findByUserName(authentication.getName()); //obtener el usuario autenticado
        Optional<GamePlayer> gamePlayerOptional = gamePlayerRepository.findById(id); //opcional porq no se sabe si esta en un juego

        if (!gamePlayerOptional.isPresent()) {
            return new ResponseEntity<>(makeMap("error", "Not Exist"), HttpStatus.NOT_FOUND); //gameplayer
        }
        if (gamePlayerOptional.get().player.getId() != player.getId()) {
            return new ResponseEntity<>(makeMap("error", "Not your Game"), HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(gamePlayerRepository.findById(id).get().gameViewDTO(), HttpStatus.ACCEPTED);
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    //un DTO que englobe el id + playeruserName +[game]
    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }

    @RequestMapping("/games")
    private Map<String, Object> player(Authentication authentication) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();

        if (!isGuest(authentication)) {
            Player player = playerRepository.findByUserName(authentication.getName());
            dto.put("player", player.playerDTO());
        } else {
            dto.put("player", "null");
        }
        dto.put("games", gameRepository
                .findAll()
                .stream()
                .map(Game::gameDTOconGamePlayers)
                .collect(Collectors.toList()));
        return dto;
    }


    @PostMapping("/players") //para metodos POST
    private Map<String, Object> createUser(@RequestParam String username, @RequestParam String password) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        if (username.isEmpty() || password.isEmpty()) {
            dto.put("error", "Username o Password vacios!");
        }

        Player player = playerRepository.findByUserName(username);
        if (player != null) {
            dto.put("error", "Nombre en Uso");
        } else {
            //Player player1 = new Player("j.bauer@ctu.gov",passwordEncoder.encode("24"));
            playerRepository.save(new Player(username, passwordEncoder.encode(password)));
            dto.put("creado", username);
        }
        return dto;
    }

    @PostMapping("/games") //para metodos POST para Crear GAME
    private ResponseEntity<Map<String, Object>> createGame(Authentication authentication) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Player player = playerRepository.findByUserName(authentication.getName());

        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap("gpid", "Unauthorized"), HttpStatus.UNAUTHORIZED);
        }

        Game game = gameRepository.save(new Game(LocalDateTime.now()));//crear Game
        GamePlayer gamePlayer = gamePlayerRepository.save(new GamePlayer(game, player));//crear GamePlayer
        return new ResponseEntity<>(makeMap("gpid", gamePlayer.getId()), HttpStatus.ACCEPTED);


    }


    @PostMapping("/game/{id}/players") //para metodos POST para Join Game
    private ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long id, Authentication authentication) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Player player = playerRepository.findByUserName(authentication.getName()); //obtener el usuario autenticado
        Optional<Game> gameOptional = gameRepository.findById(id); //opcional porq no se sabe si esta en un juego

        if (isGuest(authentication)) {//gets the current user if there is none
            return new ResponseEntity<>(makeMap("error", "Unauthorized"), HttpStatus.UNAUTHORIZED);
        }

        if (!gameOptional.isPresent()) {//gets the game with that ID if there is none
            return new ResponseEntity<>(makeMap("error", "No such game"), HttpStatus.FORBIDDEN);
        }

        if (gameOptional.get().getPlayer().stream().findFirst().get().getId() == player.getId()) {//tener Id por medio del getplayer del game
            return new ResponseEntity<>(makeMap("error", "ya esta en el juego"), HttpStatus.CONFLICT);
        }

        if (gameOptional.get().getGamePlayers().size() >= 2) {//si tiene 2 jugadores
            return new ResponseEntity<>(makeMap("error", "Game is full"), HttpStatus.FORBIDDEN);
        }
        //sino se cumple
        Optional<Game> game = gameRepository.findById(id);//buscar el Game del id del juego
        GamePlayer gamePlayer = gamePlayerRepository.save(new GamePlayer(gameOptional.get(), player));//unir y guardar el player al game(ID)
        return new ResponseEntity<>(makeMap("gpid", gamePlayer.getId()), HttpStatus.ACCEPTED);

    }

    @PostMapping("/games/players/{gamePlayerId}/ships") //para metodos POST para Place Ships
    private ResponseEntity<Map<String, Object>> placeShips(@PathVariable Long gamePlayerId, Authentication authentication, @RequestBody List<Ship> ships) {
        //Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Player player = playerRepository.findByUserName(authentication.getName()); //obtener el usuario autenticado
        //Optional<Game> gameOptional = gameRepository.findById(id); //opcional porq no se sabe si esta en un juego
        Optional<GamePlayer> gamePlayerOptional = gamePlayerRepository.findById(gamePlayerId);
        if (!gamePlayerOptional.isPresent()) {
            return new ResponseEntity<>(makeMap("error", "Not Exist"), HttpStatus.NOT_FOUND); //gameplayer
        }
        if (gamePlayerOptional.get().player.getId() != player.getId()) {
            return new ResponseEntity<>(makeMap("error", "Not your Game"), HttpStatus.UNAUTHORIZED);
        }

        if (isGuest(authentication)) {//gets the current user if there is none
            return new ResponseEntity<>(makeMap("error", "Unauthorized"), HttpStatus.UNAUTHORIZED);
        }

        if (gamePlayerOptional.get().getShips().size() > 1) {//si tiene mas del algun espacio ocupado.. ya envio almenos un ship
            return new ResponseEntity<>(makeMap("error", "Ships allready Placed"), HttpStatus.FORBIDDEN);
        }
        for (Ship ship : ships) {
            gamePlayerOptional.get().addShip(ship);
            //shipRepository.save(ship);
        }

        gamePlayerRepository.save(gamePlayerOptional.get());

        //ship = shipRepository.save(new Ship(ship));
        return new ResponseEntity<>(makeMap("ok", "ship Created"), HttpStatus.CREATED);
    }

    @PostMapping("/games/players/{gamePlayerId}/salvos") //para metodos POST para Salvos
    private ResponseEntity<Map<String, Object>> placesalvos(@PathVariable Long gamePlayerId, Authentication authentication, @RequestBody Salvo salvos) {
        //Map<String, Object> dto = new LinkedHashMap<String, Object>();
        Player player = playerRepository.findByUserName(authentication.getName()); //obtener el usuario autenticado
        //Optional<Game> gameOptional = gameRepository.findById(id); //opcional porq no se sabe si esta en un juego
        Optional<GamePlayer> gamePlayerOptional = gamePlayerRepository.findById(gamePlayerId);
        if (!gamePlayerOptional.isPresent()) {
            return new ResponseEntity<>(makeMap("error", "Not Exist"), HttpStatus.NOT_FOUND); //gameplayer
        }
        if (gamePlayerOptional.get().player.getId() != player.getId()) {
            return new ResponseEntity<>(makeMap("error", "Not your Game"), HttpStatus.UNAUTHORIZED);
        }

        if (isGuest(authentication)) {//gets the current user if there is none
            return new ResponseEntity<>(makeMap("error", "Unauthorized"), HttpStatus.UNAUTHORIZED);
        }

        if (gamePlayerOptional.get().getOpponent() != null) {
            if (gamePlayerOptional.get().getSalvoes().size() >= gamePlayerOptional.get().getOpponent().getSalvoes().size() + 1) {
                return new ResponseEntity<>(makeMap("turn", "No Puede Disparar"), HttpStatus.FORBIDDEN);

            }
        } else {
            return new ResponseEntity<>(makeMap("error", "Sin Oponentes!"), HttpStatus.FORBIDDEN);
        }

        gamePlayerOptional.get().addSalvo(salvos);
        gamePlayerRepository.save(gamePlayerOptional.get());
        //SalvoRepository.save(salvos);


        //ship = shipRepository.save(new Ship(ship));
        return new ResponseEntity<>(makeMap("ok", "Salvo Salvado"), HttpStatus.CREATED);
    }
}
