package br.com.projeto_anime_list.animelist.model;

public record ReviewDTO (Long reviewId, String userName, String userImage, String reviewText, Integer likes, Double score, Boolean isLikedByMe){}