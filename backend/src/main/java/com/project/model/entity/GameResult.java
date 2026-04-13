package com.project.model.entity;

import jakarta.persistence.*;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "game_result")
public class GameResult {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "game_id", nullable = false)
    private UUID gameId;

    @Column
    private int score;

    @Column
    private boolean won;

    @Column(columnDefinition = "TEXT")
    private String foundWords;

    public GameResult() {}

    public GameResult(String username, UUID gameId, int score, String foundWords, boolean won) {
        this.username = username;
        this.gameId = gameId;
        this.score = score;
        this.foundWords = foundWords;
        this.won = won;
    }
}