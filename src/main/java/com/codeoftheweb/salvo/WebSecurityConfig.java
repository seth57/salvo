package com.codeoftheweb.salvo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


@EnableWebSecurity
@Configuration
class WebSecurityConfig extends WebSecurityConfigurerAdapter {

        @Bean
        public PasswordEncoder passwordEncoder() {
            return PasswordEncoderFactories.createDelegatingPasswordEncoder();
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            //http.authorizeRequests().anyRequest().permitAll();//.and().httpBasic();
            http.authorizeRequests()
                    //.antMatchers("/web/game.html**").fullyAuthenticated()
                    .antMatchers("/rest/**").hasAuthority("ADMIN")
                    //.antMatchers("/DB**").permitAll()
                    .antMatchers("/api/game_view/","/web/game.html","/api/game/{id}/players", "/api/games/players/{gamePlayerId}/ships").hasAnyAuthority("USER")
                    .antMatchers("/api/**").permitAll()
                    .antMatchers("/web/games.html").permitAll();


            http.formLogin()
                    .usernameParameter("username")
                    .passwordParameter("password")
                    .loginPage("/api/login");

            http.logout().logoutUrl("/api/logout");

            http.csrf().disable();

            // if user is not authenticated, just send an authentication failure response
            http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

            // if login is successful, just clear the flags asking for authentication
            http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

            // if login fails, just send an authentication failure response
            http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

            http.headers().frameOptions().disable();
            // if logout is successful, just send a success response
            http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());

        }

        private void clearAuthenticationAttributes(HttpServletRequest request) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
            }
        }
}
