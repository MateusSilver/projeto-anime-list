package br.com.projeto_anime_list.animelist.service;

import br.com.projeto_anime_list.animelist.model.User;
import br.com.projeto_anime_list.animelist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repositorioUsuario;
    private final BCryptPasswordEncoder encriptador = new BCryptPasswordEncoder();

    public User registrarUsuario(String email, String senha){
        if(repositorioUsuario.findByEmail(email).isPresent()){
            throw new RuntimeException("Email já em uso");
        }

        User novoUsuario = new User();
        novoUsuario.setPassword(encriptador.encode(senha));
        novoUsuario.setEmail(email);
        return repositorioUsuario.save(novoUsuario);
    }

    public User autenticar(String email, String senha){
        User usuario = repositorioUsuario.findByEmail(email).orElseThrow(()-> new RuntimeException("Email não encontrado"));

        if(!encriptador.matches(senha, usuario.getPassword())){
            throw new RuntimeException("senha incorreta");
        }

        return usuario;
    }
}
