package com.project.model.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.util.UUID;


class UserTest {

    @Test
    void testDefaultValuesForNewUser() {
        String username = "username";
        String password = "password";
        String avatar = "avatar";

        User user = new User(username, password, avatar);

        assert(user.getUsername()).equals(username);
        assert(user.getAvatar()).equals(avatar);
        assert(user.getPassword() != null);
        assert(user.getPasswordHash() != null);

        assert(user.getGamesPlayed() == 0);
        assert(user.getGamesWon() == 0);
        assert(user.getHighScore() == 0);
        assert(user.getLongestWord() == null);
    }

    @Test
    void testUserSetters() {
        User user = new User();

        user.setUsername("username");
        user.setPassword("password");
        user.setHighScore(150);
        user.setLongestWord("hello");
        user.setGamesPlayed(10);
        user.setAvatar("avatar");

        assert(user.getUsername().equals("username"));
        assert(user.getHighScore() == 150);
        assert(user.getLongestWord().equals("hello"));
        assert(user.getGamesPlayed() == 10);
        assert(user.getAvatar().equals("avatar"));
        assert(user.getPassword() != null);
        assert(user.getPasswordHash() != null);
    }

    @Test
    void testNoArgsConstructor() {
        User user = new User();
        assert(user != null);
    }
}