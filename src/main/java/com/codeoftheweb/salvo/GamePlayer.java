package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;


import javax.persistence.*;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
public class GamePlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    public Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "joinDate")
    private Game game;

    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER)
    private Set<Ship> ships= new HashSet<>();

    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER)
    private Set<Salvo> salvoes= new HashSet<>();

    public GamePlayer() {
    }

    public GamePlayer(Game game, Player player) {
        this.game = game;
        this.player = player;
    }

    public Map<String, Object> gamePlayerDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("player", this.player.playerDTO());
        dto.put("score", this.getScore());
        return dto;
    }


    Map<String, Object> gameViewDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();

        dto.put("id", this.id);
        dto.put("created",this.game.date);
        dto.put("gamePlayers",this.game.getGamePlayers()
                                    .stream()
                                    .map(GamePlayer::gamePlayerDTO)
                                    .collect(Collectors.toList()));
        dto.put("ships",this.ships
                                    .stream()
                                    .map(Ship::makeShipDTO)
                                    .collect(Collectors.toList()));
        dto.put("salvoes", this.game.getGamePlayers()
                                    .stream()
                                    .flatMap( gp -> gp.getSalvoes().stream().map(Salvo::makeSalvoDTO))
                                    .collect(Collectors.toList()));

        return dto;
    }

    @JsonIgnore
    public Score getScore() {
        return this.player.getScore(this.game);

    }


    public void addShip(Ship ship) {
        ship.setGamePlayer(this);
        ships.add(ship);
    }

    public void addSalvo(Salvo salvo) {
        salvo.setGamePlayer(this);
        salvoes.add(salvo);
    }

    public long getId() {
        return id;
    }

    @JsonIgnore
    public Set<Ship> getShips() {
        return ships;
    }

    @JsonIgnore
    public Set<Salvo> getSalvoes() {
        return salvoes;
    }

    @JsonIgnore
    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    @JsonIgnore
    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }


}
