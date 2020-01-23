package com.codeoftheweb.salvo.repositories;

import com.codeoftheweb.salvo.models.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface PlayerRepository  extends JpaRepository<Player, Long> {
    //List<Player> findByUserName(String userName);
    Player findByUserName(@Param("name") String userName);
}



