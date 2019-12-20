package com.codeoftheweb.salvo;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Entity
public class Ship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    public String shipType;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gamePlayer_id")
    private GamePlayer gamePlayer;

    @ElementCollection
    @Column(name="shipLocation")
    private List<String> shipLocations = new ArrayList<String>();


    public Ship() {   }
    public Ship(String shipType,List<String> shipLocations ){
        this.shipLocations=shipLocations;
        this.shipType=shipType;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    public List<String> getShipLocations() {
        return shipLocations;
    }

    public String getShipType() {
        return shipType;
    }

    public void setShipType(String shipType) {
        this.shipType = shipType;
    }


   public Map<String, Object> makeShipDTO() {
       Map<String, Object> dto = new LinkedHashMap<String, Object>();
       dto.put("type", this.shipType);
       dto.put("location",this.shipLocations);
       return dto;
   }


}
