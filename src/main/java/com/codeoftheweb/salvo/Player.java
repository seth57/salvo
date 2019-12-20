package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;



@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private String userName;
    private String password;
    //private String rol;


    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER)
    private Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER)
    private Set<Score> scores;


   public Player() {
    }

    public Player(String userName,String password) {
       this.userName = userName;
       this.password=password;
    }

    //Public DTO
    public Map<String, Object> playerDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("userName", this.userName);
        return dto;
    }
    //public Player.getScore(game) {return gamePlayers}



public Score getScore(Game game){
       return scores.stream()
               .filter(puntaje->puntaje.getGame().getId()==game.getId())//retorna el el juego y ID de ESE JUEGO
               .findFirst()
               .orElse(null);

}

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
}
