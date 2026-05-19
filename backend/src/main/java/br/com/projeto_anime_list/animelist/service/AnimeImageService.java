package br.com.projeto_anime_list.animelist.service;

import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.repository.AnimeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnimeImageService {
    private final AnimeRepository animeRepository;

    private final RestClient rc = RestClient.create();
    private final ObjectMapper mapper = new ObjectMapper();

    public void atualizarCapas(){
        List<Anime> animesSemCapa = animeRepository.findByImageUrlIsNull();
        if(animesSemCapa.isEmpty()){
            System.out.println("Todos já possuem capa");
            return;
        }

        System.out.println("enriquecendo capas: " + animesSemCapa.size() + "restantes");

        int atualizados = 0;
        for(Anime anime : animesSemCapa){
            try{
                String url = "https://api.jikan.moe/v4/anime/"+anime.getMalId();

                //guarda resultado
                String responseText = rc.get().uri(url).retrieve().body(String.class);

                if(responseText  != null){
                    // transforma texto
                    JsonNode res = mapper.readTree(responseText);

                    if(res.has("data")){
                        JsonNode imagesNode = res.path("data").path("images").path("jpg");
                        String urlCapa = imagesNode.path("image_url").asText();

                        if(urlCapa != null && !urlCapa.isEmpty()) {
                            anime.setImageUrl(urlCapa);
                            animeRepository.save(anime);
                            atualizados++;
                            System.out.println("["+atualizados+"] animes atualizados");
                        }
                    }
                    Thread.sleep(2000);
                }

            } catch (Exception e){
                System.out.println("Erro ao buscar capas: "+e.getLocalizedMessage());
                try {
                    Thread.sleep(2000);
                } catch(InterruptedException ie){
                    Thread.currentThread().interrupt();
                }
            }
        }
        System.out.println("finalizado!");
    }
}
