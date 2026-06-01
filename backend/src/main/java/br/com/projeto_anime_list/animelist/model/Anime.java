package br.com.projeto_anime_list.animelist.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="Animes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Anime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mal_id")
    private Long malId;

    @Column(nullable = false, length=200)
    private String title;

    @Column(length = 500)
    private String imageUrl;

    private String type;
    private Integer episodes;
    private Integer watchedEpisodes;
    private Double score;
    private String status;

    @Column(columnDefinition = "TEXT", length = 1000)
    private String comments;

    @ElementCollection
    @CollectionTable(name = "anime_tags", joinColumns = @JoinColumn(name = "anime_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
