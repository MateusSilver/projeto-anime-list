package br.com.projeto_anime_list.animelist.controller;


import br.com.projeto_anime_list.animelist.model.User;
import br.com.projeto_anime_list.animelist.service.AuthService;
import br.com.projeto_anime_list.animelist.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService autenticador;
    private final TokenService tkService;

    // Classes estáticas
    public record LoginRequest(String email, String password){}
    public record RegisterRequest(String email, String password){}
    public record TokenResponse(String token){}


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req){
        try{
            User autenticado = autenticador.autenticar(req.email(), req.password());

            String tokenJwt = tkService.gerarToken(autenticado);
            return ResponseEntity.ok(new TokenResponse(tokenJwt));
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getLocalizedMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegisterRequest req){
        try {
            User novoUsuario = autenticador.registrarUsuario(req.email(), req.password());
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getLocalizedMessage());
        }
    }
}
