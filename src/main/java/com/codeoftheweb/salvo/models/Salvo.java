package com.codeoftheweb.salvo.models;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Entity
public class Salvo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private int turn;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gamePlayer_id")
    private GamePlayer gamePlayer;

    @ElementCollection
    @Column(name="salvoLocation")
    private List<String> salvoLocations = new ArrayList<String>();


    public Salvo() {   }
    public Salvo(GamePlayer gamePlayer,int turn,List<String> salvoLocations ){
        this.gamePlayer=gamePlayer;
        this.salvoLocations=salvoLocations;
        this.turn=turn;
    }

    public Map<String, Object> makeSalvoDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn", this.turn);
        //dto.put("player",this.gamePlayer.player.userName);
        dto.put("player",this.gamePlayer.getPlayer().getId());
        dto.put("salvoLocation",this.salvoLocations);
        return dto;
    }


    public Map<String, Object> makeSalvoHitsDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn", this.turn);
        dto.put("misHits",getHits());
        return dto;
    }


    public  Stream<String> getHits(){//para filtrar
        return this.gamePlayer.getOpponent().getShips().stream()
            .flatMap(y->y.getShipLocations().stream())//para llamar a otro metodo que no esta en mi clase yso los punteros y->y
            .filter(location->this.salvoLocations.contains(location));
    }



    public void setTurn(int turn) {
        this.turn = turn;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    public List<String> getSalvoLocations() {
        return salvoLocations;
    }

    public void setSalvoLocations(List<String> salvoLocations) {
        this.salvoLocations = salvoLocations;
    }
}
