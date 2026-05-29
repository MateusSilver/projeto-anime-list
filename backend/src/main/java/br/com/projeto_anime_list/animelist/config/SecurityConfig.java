package br.com.projeto_anime_list.animelist.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // desabilita a proteção por enquanto
                .csrf(AbstractHttpConfigurer::disable)
                // libera acesso a todos por enquanto
                .authorizeHttpRequests(auth ->auth.anyRequest().permitAll()
                );
        return http.build();
    }
}
