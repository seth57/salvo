package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

@SpringBootApplication
public class SalvoApplication extends SpringBootServletInitializer {


    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(SalvoApplication.class, args);

    }



    @Bean
    public CommandLineRunner llenarTablasDB(
            PlayerRepository        pjRep,
            GameRepository          gameRep,
            GamePlayerRepository    gpRep,
            ShipRepository          shipRep,
            SalvoRepository         salvoRep,
            ScoreRepository         scrRep
            ) {
        return (args) -> {
            // save a couple of customers


            Player player1 = new Player("j.bauer@ctu.gov",passwordEncoder.encode("123"));
            Player player2 = new Player("c.obrian@ctu.gov",passwordEncoder.encode("123"));
            Player player3 = new Player("kim_bauer@gmail.com",passwordEncoder.encode("123"));
            Player player4 = new Player("t.almeida@ctu.gov",passwordEncoder.encode("123")); //el otro metodo seria decode..
            //Guarda en Respositorios
            pjRep.save(player1);
            pjRep.save(player2);
            pjRep.save(player3);
            pjRep.save(player4);

            Game game1 = new Game(LocalDateTime.now());
            Game game2 = new Game(LocalDateTime.now());
            Game game3 = new Game(LocalDateTime.now());
            Game game4 = new Game(LocalDateTime.now());
            Game game5 = new Game(LocalDateTime.now());
            Game game6 = new Game(LocalDateTime.now());
            Game game7 = new Game(LocalDateTime.now());
            Game game8 = new Game(LocalDateTime.now());

            gameRep.save(game1);
            gameRep.save(game2);
            gameRep.save(game3);
            gameRep.save(game4);
            gameRep.save(game5);
            gameRep.save(game6);
            gameRep.save(game7);
            gameRep.save(game8);

            GamePlayer gpPlayer1 = new GamePlayer(game1,player1);
            gpRep.save(gpPlayer1);
            GamePlayer gpPlayer2 = new GamePlayer(game1,player2);
            gpRep.save(gpPlayer2);

            GamePlayer gpPlayer3 = new GamePlayer(game2,player1);
            gpRep.save(gpPlayer3);
            GamePlayer gpPlayer4 = new GamePlayer(game2,player2);
            gpRep.save(gpPlayer4);

            GamePlayer gpPlayer5 = new GamePlayer(game3,player2);
            gpRep.save(gpPlayer5);
            GamePlayer gpPlayer6 = new GamePlayer(game3,player4);
            gpRep.save(gpPlayer6);

            GamePlayer gpPlayer7 = new GamePlayer(game4,player2);
            gpRep.save(gpPlayer7);
            GamePlayer gpPlayer8 = new GamePlayer(game4,player1);
            gpRep.save(gpPlayer8);

            GamePlayer gpPlayer9 = new GamePlayer(game5,player4);
            gpRep.save(gpPlayer9);
            GamePlayer gpPlayer10 = new GamePlayer(game5,player1);
            gpRep.save(gpPlayer10);

            GamePlayer gpPlayer11 = new GamePlayer(game6,player3);
            gpRep.save(gpPlayer11);

            GamePlayer gpPlayer12 = new GamePlayer(game7,player4);
            gpRep.save(gpPlayer12);

            GamePlayer gpPlayer13 = new GamePlayer(game8,player3);
            gpRep.save(gpPlayer13);
            GamePlayer gpPlayer14 = new GamePlayer(game8,player4);
            gpRep.save(gpPlayer14);

            ////SALVOS
            Salvo salvo4=new Salvo(gpPlayer2,1, Arrays.asList("B4", "B5", "B6"));
            salvoRep.save(salvo4);
            Salvo salvo5=new Salvo(gpPlayer2,2, Arrays.asList("E1", "H3", "A2"));
            salvoRep.save(salvo5);



            ////////////////////////PARA JUEGO 1 /////////////////////////////////////////
           /* Ship ship1=new Ship("Destroyer", Arrays.asList("H2","H3","H4"));
            Ship ship2=new Ship("Submarine", Arrays.asList("E1","F1","G1"));
            Ship ship3=new Ship("Patrol Boat", Arrays.asList("B4","B5"));
            gpPlayer1.addShip(ship1);
            gpPlayer1.addShip(ship2);
            gpPlayer1.addShip(ship3);
            shipRep.save(ship1);
            shipRep.save(ship2);
            shipRep.save(ship3);*/
            Salvo salvo1=new Salvo(gpPlayer1,1, Arrays.asList("B5","D1"));
            Salvo salvo2=new Salvo(gpPlayer1,2,Arrays.asList("G2","E7"));
            Salvo salvo3=new Salvo(gpPlayer1,3, Collections.singletonList("H6"));
            gpPlayer1.addSalvo(salvo1);
            gpPlayer1.addSalvo(salvo2);
            gpPlayer1.addSalvo(salvo3);
            salvoRep.save(salvo1);
            salvoRep.save(salvo2);
            salvoRep.save(salvo3);

            ///////////////////////PARA SCORE ////////////////////////
            Score score1=new Score(game1,player1,1);
            Score score2=new Score(game1,player2,0);
            Score score3=new Score(game2,player1,0.5);
            Score score4=new Score(game2,player2,0.5);
            Score score5=new Score(game3,player2,1);
            Score score6=new Score(game3,player4,0);
            Score score7=new Score(game4,player2,0.5);
            Score score8=new Score(game4,player1,0.5);

            scrRep.save(score1);
            scrRep.save(score2);
            scrRep.save(score3);
            scrRep.save(score4);
            scrRep.save(score5);
            scrRep.save(score6);
            scrRep.save(score7);
            scrRep.save(score8);

/*


            Ship ship4=new Ship("Destroyer", Arrays.asList("B5", "C5", "D5"));
            Ship ship5=new Ship("Patrol Boat", Arrays.asList("F1","F2"));
            gpPlayer2.addShip(ship4);
            gpPlayer2.addShip(ship5);
            shipRep.save(ship4);
            shipRep.save(ship5);
*/
/*

            // INSTANCIA 1 DE BARCOS PARA LA PARTIDA DE JUEGO  1
            Ship ship0 = new Ship("Destroyer", Arrays.asList("H2", "H3", "H4"));
            Ship ship1 = new Ship("Submarine", Arrays.asList("E1", "F1", "G1"));
            Ship ship2 = new Ship("Patrol Boat", Arrays.asList("B4", "B5"));
            gamePlayer1.addShip(ship0);
            gamePlayer1.addShip(ship1);
            gamePlayer1.addShip(ship2);
            Salvo salvo1 = new Salvo(1, Arrays.asList("B5", "C5", "F1"));
            Salvo salvo2 = new Salvo(2, Arrays.asList("F2", "D5"));
            gamePlayer1.addSalvo(salvo1);
            gamePlayer1.addSalvo(salvo2);
            gameplayerRepository.save(gamePlayer1);*/



        };

    }

}




