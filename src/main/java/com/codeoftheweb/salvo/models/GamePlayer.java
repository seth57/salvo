package com.codeoftheweb.salvo.models;

import com.codeoftheweb.salvo.State;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.*;

import static java.util.stream.Collectors.toList;

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

    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    private Set<Ship> ships= new HashSet<>();

    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
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


    public Map<String, Object> gameViewDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();

        dto.put("id", this.id);
        dto.put("created",this.game.date);
        dto.put("gamePlayers",this.game.getGamePlayers()
                                    .stream()
                                    .map(GamePlayer::gamePlayerDTO)
                                    .collect(toList()));
        dto.put("ships",this.ships
                                    .stream()
                                    .map(Ship::makeShipDTO)
                                    .collect(toList()));
        dto.put("salvoes", this.game.getGamePlayers()
                                    .stream()
                                    .flatMap( gp -> gp.getSalvoes().stream().map(Salvo::makeSalvoDTO))
                                    .collect(toList()));
        dto.put("misHITS", this.salvoes.stream().map(Salvo::makeSalvoHitsDTO));
        dto.put("Sinks",this.getSinks());
        dto.put("state",this.getState());
        return dto;
    }

    @JsonIgnore
    public Score getScore() {
        return this.player.getScore(this.game);

    }


    public State getState(){
        State respuesta=State.PLAY;
        if(this.getShips().size()==0){
            respuesta=State.WAIT_BOATS;
        }else{
            if(this.getOpponent() == null){
                respuesta=State.WAIT_OPPONENT;
            }else{
                if(this.getSalvoes().size() > this.getOpponent().getSalvoes().size()){
                    respuesta=State.WAIT;
                }else if(this.getSalvoes().size() == this.getOpponent().getSalvoes().size()){//juego terminado
                    if(this.getSalvoes().size()==getOpponent().getSalvoes().size()&&this.getSinks().size()==5&&this.getOpponent().getSinks().size()==5){

                        respuesta=State.TIE; //empate
                    }
                    else if(this.getSalvoes().size()==getOpponent().getSalvoes().size()&&this.getSinks().size()==5){

                        respuesta=State.WIN; //yo gane
                    } else if(this.getSalvoes().size()==getOpponent().getSalvoes().size()&&this.getOpponent().getSinks().size()==5){

                        respuesta=State.LOST; //yo perdi
                    }

                }
            }
        }

        return respuesta;
}


    @JsonIgnore
    public GamePlayer getOpponent(){ //para tener el oponente
        return this.getGame().getGamePlayers().stream()
                .filter(x->x.getId()!=this.id)//retorna el el juego y ID de ESE JUEGO
                .findFirst()
                .orElse(null);

    }
    public List<String> getSinks(){//para filtrar
        if(this.getOpponent() != null){
        List<String> LocacionDeSalvos=this.getSalvoes().stream()//
                .flatMap(x->x.getSalvoLocations().stream())
                .collect(toList());

        return this.getOpponent().getShips().stream()
                .filter(x->LocacionDeSalvos.containsAll(x.getShipLocations()))
                .map(x->x.getShipType())
                .collect(toList());
        }else
        return new ArrayList();
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
