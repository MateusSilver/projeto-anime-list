package br.com.projeto_anime_list.animelist.service;

import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.model.User;
import br.com.projeto_anime_list.animelist.repository.AnimeRepository;
import br.com.projeto_anime_list.animelist.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import java.util.stream.Collectors;

import static java.lang.Double.parseDouble;

@Service
@RequiredArgsConstructor
public class AnimeImportService {
    private final UserRepository userRepository;
    private final AnimeRepository animeRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public void importFromXml(){
        try {
            // look user
            User owner = userRepository.findByEmail("mateusdasilveirabatista@gmail.com").orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail("mateusdasilveirabatista@gmail.com");
                newUser.setName("MateSilver");
                newUser.setPassword(passwordEncoder.encode("535195mateus"));
                return userRepository.save(newUser);
            });

            // lê xml
            InputStream xmlFile = new ClassPathResource("animelist.xml").getInputStream();
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder  = factory.newDocumentBuilder();
            Document doc = builder.parse(xmlFile);
            doc.getDocumentElement().normalize();

            // get tags
            NodeList nList = doc.getElementsByTagName("anime");
            System.out.println("encontrados: "+nList.getLength() + " anime no xml");

            int countImportados = 0;
            int countNovos = 0;

            List<Anime> animesParaSalvar = new ArrayList<>();

            // parse
            for (int i = 0; i < nList.getLength(); i++){
                Node item = nList.item(i);
                if (item.getNodeType() == Node.ELEMENT_NODE){
                    Element e = (Element) item;
                    Long currentMalId = parseLong(getTagValue("series_animedb_id", e));

                    // A MÁGICA ACONTECE AQUI: Busca no banco ou cria um novo!
                    Anime anime = animeRepository.findByMalIdAndUser(currentMalId, owner)
                            .orElseGet(Anime::new);

                    if(anime.getId() != null){
                        countImportados++;
                    } else {
                        countNovos++;
                        anime.setUser(owner);
                    }
                    // associa
                    anime.setUser(owner);

                    // insere dados
                    anime.setMalId(currentMalId);
                    anime.setTitle(getTagValue("series_title", e));
                    anime.setType(getTagValue("series_type", e));
                    anime.setEpisodes(parseInteger(getTagValue("series_episodes", e)));
                    anime.setWatchedEpisodes(parseInteger(getTagValue("my_watched_episodes", e)));
                    anime.setScore(parseDoubleCustom(getTagValue("my_score", e)));
                    anime.setStatus(getTagValue("my_status", e));
                    anime.setComments(getTagValue("my_comments", e));


                    anime.setTags(parseTagsList(getTagValue("my_tags", e)));

                    // Salva no banco de dados Neon
                    animesParaSalvar.add(anime);
                    countImportados++;
                }
            }
            animeRepository.saveAll(animesParaSalvar);

            System.out.println("sincro concluida!");
            System.out.println("animes atualizados: " + countImportados);
            System.out.println("animes novos: " + countNovos);

        } catch (Exception e){
            System.out.println("Erro ao importar: "+ e.getLocalizedMessage());
            e.printStackTrace();
        }
    }

    private List<String> parseTagsList(String tagsRaw){
        if (tagsRaw == null || tagsRaw.isEmpty()) return new ArrayList<>();
        return Arrays.stream(tagsRaw.split(",")).map(String::trim).filter(tag->!tag.isEmpty()).collect(Collectors.toList());
    }

    private String getTagValue(String tag, Element el) {
        // verifica tags
        NodeList nodelist = el.getElementsByTagName(tag);
        if(nodelist != null && nodelist.getLength() > 0) {
            return nodelist.item(0).getTextContent().trim();
        }
        return "";
    }

    private Integer parseInteger(String val) {
        try{
            return Integer.parseInt(val);
        } catch (NumberFormatException e){
            System.out.println("erro de formatacao de numero inteiro: "+ e.getLocalizedMessage());
        }
        return 0;
    }

    private Long parseLong(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e){
            System.out.println("erro de formatacao de numero longo: "+ e.getLocalizedMessage());
        }
        return 0L;
    }

    private Double parseDoubleCustom(String val) {
        if (val == null || val.isEmpty()) return 0.0;
        try {
            return Double.parseDouble(val);
        } catch (NumberFormatException e){
            return 0.0;
        }
    }
}
