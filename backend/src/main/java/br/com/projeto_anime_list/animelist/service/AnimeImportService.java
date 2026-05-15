package br.com.projeto_anime_list.animelist.service;

import br.com.projeto_anime_list.animelist.model.Anime;
import br.com.projeto_anime_list.animelist.model.User;
import br.com.projeto_anime_list.animelist.repository.AnimeRepository;
import br.com.projeto_anime_list.animelist.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnimeImportService {
    private final UserRepository userRepository;
    private final AnimeRepository animeRepository;

    @Transactional
    public void importFromXml(){
        try {
            // look user
            User owner = userRepository.findByEmail("mattrex33@gmail.com").orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail("mattrex33@gmail.com");
                newUser.setName("MateSilver");
                newUser.setPassword("senhaSegura123");
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

            // parse
            for (int i = 0; i < nList.getLength(); i++){
                Node item = nList.item(i);
                if (item.getNodeType() == Node.ELEMENT_NODE){
                    Element e = (Element) item;
                    Anime anime = new Anime();

                    // associa
                    anime.setUser(owner);

                    // insere dados
                    anime.setMalId(parseLong(getTagValue("series_animedb_id", e)));
                    anime.setTitle(getTagValue("series_title", e));
                    anime.setType(getTagValue("series_type", e));
                    anime.setEpisodes(parseInteger(getTagValue("series_episodes", e)));
                    anime.setWatchedEpisodes(parseInteger(getTagValue("my_watched_episodes", e)));
                    anime.setScore(parseInteger(getTagValue("my_score", e)));
                    anime.setStatus(getTagValue("my_status", e));
                    anime.setComments(getTagValue("my_comments", e));

                    // Salva no banco de dados Neon
                    animeRepository.save(anime);
                    countImportados++;
                }
            }
        } catch (Exception e){
            System.out.println("Erro ao importar: "+ e.getLocalizedMessage());
            e.printStackTrace();
        }
    }

    private String getTagValue(String tag, Element el) {
        // verifica tags
        NodeList nodelist = el.getElementsByTagName(tag).item(0).getChildNodes();
        if(nodelist != null && nodelist.getLength() > 0) {
            return nodelist.item(0).getNodeValue();
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
}
