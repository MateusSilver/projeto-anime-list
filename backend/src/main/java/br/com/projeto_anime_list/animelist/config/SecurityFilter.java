package br.com.projeto_anime_list.animelist.config;

import br.com.projeto_anime_list.animelist.model.User;
import br.com.projeto_anime_list.animelist.repository.UserRepository;
import br.com.projeto_anime_list.animelist.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tkService;
    private final UserRepository userRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recuperarToken(req);

        if(token != null){
            var email = tkService.validarToken(token);
            if(!email.isEmpty()){
                User usuario = userRepo.findByEmail(email).orElseThrow();

                // cria passe livre
                var athentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(athentication);
            }
        }
        filterChain.doFilter(req,res);
    }

    private String recuperarToken(HttpServletRequest req) {
        var authHeader = req.getHeader("Authorization");
        if(authHeader == null) return null;
        // filtrar inicio
        return authHeader.replace("Bearer ", "");
    }
}
