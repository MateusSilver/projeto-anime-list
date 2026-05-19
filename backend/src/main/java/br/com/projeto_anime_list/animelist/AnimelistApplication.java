package br.com.projeto_anime_list.animelist;

import br.com.projeto_anime_list.animelist.service.AnimeImageService;
import br.com.projeto_anime_list.animelist.service.AnimeImportService;
import org.springframework.boot.CommandLineRunner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AnimelistApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnimelistApplication.class, args);
	}
	@Bean
	CommandLineRunner runner(AnimeImportService importService, AnimeImageService imageService) {
		return args -> {
			// System.out.println("Iniciando script e ETL...");
			// importService.importFromXml();
			// imageService.atualizarCapas();
		};
	}
}
