package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    public LocalDateTime date;

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER)
    private Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER)
    private Set<Score> scores;//= new HashSet<>();


    public Game() {

    }

    public Game(LocalDateTime date) {
        this.date = date;
    }
//SET GLOBAL time_zone = '-3:00'

    //Public DTO para class Game
   /* public Map<String, Object> gameOrgDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", getId());
        dto.put("created", getDate());
        return dto;
    }*/


    ///Privado DTO Game + desde Player
    Map<String, Object> gameDTOconGamePlayers() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("created", this.date);
        dto.put("gamePlayers", this.gamePlayers.stream().map(GamePlayer::gamePlayerDTO).collect(Collectors.toList()));
        return dto;
    }
/*
    Map<String, Object> gameDTOparaGamePlayer() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("created", this.date);
       return dto;
    }*/

    @JsonIgnore
    public List<Player> getPlayer(){
        return gamePlayers.stream()
             .map(GamePlayer::getPlayer)
                .collect(Collectors.toList());

    }

    public LocalDateTime getDate() {
        return date;
    }

    private void setDate(LocalDateTime date) {
        this.date = date;
    }

    public long getId() {
        return id;
    }

    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }
}