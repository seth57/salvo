package com.codeoftheweb.salvo.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private Double score; //Que tipo de variable???
    private LocalDateTime finisDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    private Player player;


    public Score() {    }

    public Score(Game game, Player player, double score){
        this.game=game;
        this.player=player;
        this.score=score;
        this.finisDate=LocalDateTime.now();

    }


/*
    public Ship(String shipType, List<String> shipLocations ){
        this.shipLocations=shipLocations;
        this.shipType=shipType;
    }
*/

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public LocalDateTime getFinisDate() {
        return finisDate;
    }

    public void setFinisDate(LocalDateTime finisDate) {
        this.finisDate = finisDate;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }
}
