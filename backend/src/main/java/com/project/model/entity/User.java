package com.project.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    @UuidGenerator // Generates the UUID automatically
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password; // This stores the hashed password

    @Column(name = "games_played")
    private int gamesPlayed = 0;

    @Column(name = "games_won")
    private int gamesWon = 0;

    @Column(name = "high_score")
    private int highScore = 0;

    // JPA requires a protected or public no-arg constructor
    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getPasswordHash() {
        return this.password;
    }

    public UUID getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}