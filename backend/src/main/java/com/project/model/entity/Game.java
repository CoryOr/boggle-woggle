package com.project.model.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "game")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID gameId;

    @Column
    private int boardSize; // Our boards will be square, so this is the column and row length

    @Column
    private String letters; // Store the letters for our game in one string and translate to board later

    // No arg constructor required by JPA for some reason?
    public Game() {}

    public Game(int boardSize, String letters) {
        this.boardSize = boardSize;
        this.letters = letters;
    }

    public UUID getGameId() {
        return gameId;
    }

    public int getBoardSize() {
        return boardSize;
    }

    public String getLetters() {
        return letters;
    }
}