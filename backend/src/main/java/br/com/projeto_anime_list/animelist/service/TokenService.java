package br.com.projeto_anime_list.animelist.service;

import br.com.projeto_anime_list.animelist.model.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;


@Service
public class TokenService {
    private final String segredo = "chave-secreta";//incluida no .env em produção;

    public String gerarToken(User usuario){
        try {
            Algorithm alg = Algorithm.HMAC256(segredo);
            return JWT.create().withIssuer("anime-list-api").withSubject(usuario.getEmail()).withExpiresAt(dataExpiracao()).sign(alg);
        } catch (JWTCreationException e){
            throw new RuntimeException("Erro ao gerar token de JWT", e);
        }
    }

    public String validarToken(String token){
        try {
            Algorithm alg = Algorithm.HMAC256(segredo);
            return JWT.require(alg).withIssuer("anime-list-api").build().verify(token).getSubject();// devolve email se verdadeiro
        } catch (JWTVerificationException e) {
            return "";
        }
    }

    private Instant dataExpiracao(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
