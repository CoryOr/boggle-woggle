## Boggle Game (Project_3c)
<!--The name of your team.-->

[![pipeline status](https://git.doit.wisc.edu/cdis/cs/courses/cs506/sp2026/team/t_3c/Project_3c/badges/main/pipeline.svg)](https://git.doit.wisc.edu/cdis/cs/courses/cs506/sp2026/team/t_3c/Project_3c/-/commits/main)

### Project Abstract

This project is a team-based effort to develop a real-time multiplayer Boggle application where users can compete against each other online. Our team is building a system that randomly shuffles and lays out letter dice to generate a unique board for each round, provides an interactive interface for players to submit words, and automatically validates and scores entries using a shared dictionary. At the end of each game, the app will display all players’ word lists, calculate scores, and highlight unique words. Beyond the core gameplay, we plan to explore additional features such as customizable game settings, user accounts with tracked statistics, AI opponents, and the ability to design and share custom boards.

<!--A one paragraph summary of what the software will do.-->

### Customer

Generally, the customer for this software is a casual gamer that, in specific, likes to play word games/puzzles.

<!--A brief description of the customer for this software, both in general (the population who might eventually use such a system) and specifically for this document (the customer(s) who informed this document). Every project will have a customer from the CS506 instructional staff. Requirements should not be derived simply from discussion among team members. Ideally your customer should not only talk to you about requirements but also be excited later in the semester to use the system.-->

### Specification

<!--A detailed specification of the system. UML, or other diagrams, such as finite automata, or other appropriate specification formalisms, are encouraged over natural language.-->

<!--Include sections, for example, illustrating the database architecture (with, for example, an ERD).-->

<!--Included below are some sample diagrams, including some example tech stack diagrams.-->

#### Technology Stack (Finalized)

```mermaid
flowchart RL
subgraph Front End
	A(JavaScript: React)
end
	
subgraph Back End
	B(Java: SpringBoot)
end
	
subgraph Database
	C[(MySQL)]
end

A <--> B
B <--> C
```

#### Database

```mermaid
---
title: Word Game Database ERD
---
erDiagram
    Users ||--o{ Game : "plays"
    Game ||--o{ GameResult : "generates"
 
    Users {
        int id PK
        string username UK
        string password
        string avatar
        int games_played
        int games_won
        int high_score
        string longest_word
    }
 
    Game {
        string game_id PK
        int board_size
        string letters
    }
 
    GameResult {
        int id PK
        string game_id FK
        string username FK
        int score
        string found_words
        bit won
    }
```

#### Class Diagram

```mermaid
---
title: Backend Objects
---
classDiagram
    class Board {
        - String[][] board
        + Board(random)
        + String[][] getBoard()
    }
    class LobbyUser {
        - String username
        - String avatar
        - boolean isReady
        - boolean isHost
        + LobbyUser(String username, String avatar, boolean isReady, boolean isHost)
        + String getUsername()
        + String getAvatar()
        + boolean getIsReady()
        + boolean getIsHost()
    }
```

```mermaid
---
title: Backend Transfer Objects
---
classDiagram
    class Records {
        - All records contain a required structure that the frontend must send to a controller
        + AuthResponse(String accessToken, String tokenType, UUID id, String username, String avatar, int highScore, String longestWord, int gamesPlayed)
        + GameResponse(UUID gameId, String[][] board)
        + GameResultRequest(UUID gameId, int score, List<String> foundWords)
        + GuessRequest(UUID gameId, String guess)
        + GuessResponse(int score, boolean valid)
        + JoinRoomRequest(String roomCode, String username)
        + LoginRequest(String username, String password)
        + MeResponse(UUID id, String username, String avatar, int highScore, String longestWord, int gamesPlayed, int gamesWon)
        + PlayersRequest(String roomCode)
        + PlayersResponse(List<LobbyUser> players)
        + RegisterRequest(String username, String password, String avatar)
    }
```

```mermaid
---
title: Database Entities
---
classDiagram
    class Game {
        - UUID gameId
        - int boardSize
        - String letters
        + Game()
        + Game(int boardSize, String letters)
        + UUID getGameId()
        + int getBoardSize()
        + String getLetters()
        + void setGameId(UUID gameId) // Only used by tests
    }
    class GameResult {
        - UUID id
        - String username
        - UUID gameId
        - int score
        - boolean won
        - String foundWords
        + GameResult()
        + GameResult(String username, UUID gameId, int score, String foundWords, boolean won)
    }
    class User {
        - UUID id
        - String username
        - String password // hashed version, not actual
        - int gamePlayed
        - int gamesWon
        - int highScore
        - String longestWord
        - String avatar
        + User()
        + User(String username, String password, String avatar)
        + UUID getId()
        + String getUsername()
        + void setUsername()
        + String getPassword()
        + void setPassword()
        + String getPasswordHash()
        + int getHighScore()
        + void setHighScore()
        + String getLongestWord()
        + void setLongestWord()
        + int getGamesPlayed()
        + void setGamesPlayed()
        + String getAvatar()
        + void setAvatar()
        + int getGamesWon()
    }
```


#### Behavior

```mermaid
---
title: Flow of Users Playing A Game
---
stateDiagram
    [*] --> Home
    GameSelectPage --> GamePage : Selects Single Player
    GamePage --> GameGenerated : Initialize Board/Timer/Found Words/Score
    GameGenerated --> ScoreAndFoundWordsUpdated : User Guesses a Valid Word
    GameGenerated --> ScoreAndFoundWordsNotUpdated : User Guesses an Invalid Word
    GameGenerated --> GameFinishedPage : Timer Runs Out
    GameFinishedPage --> Home : User Clicks Go Home Button
    GameFinishedPage --> StateUpdate : Game Results Stored in DB
    Home --> GameSelectPage : User Selects Play Game
```

#### Sequence Diagram for Most of App

```mermaid
sequenceDiagram

participant ReactFrontend
participant SpringBootBackend
participant MySQLDatabase

ReactFrontend ->> SpringBootBackend: HTTP Request (e.g., GET /api/users)
activate SpringBootBackend

SpringBootBackend ->> MySQLDatabase: SQL Query (e.g., SELECT * FROM users)
activate MySQLDatabase

MySQLDatabase -->> SpringBootBackend: ResultSet
deactivate MySQLDatabase

SpringBootBackend -->> ReactFrontend: JSON Response
deactivate SpringBootBackend
```

#### Sequence Diagram for Multiplayer

```mermaid
sequenceDiagram
    participant React as React Frontend
    participant Spring as Spring Boot (WebSocket Server)
    participant MySQL as MySQL Database

    Note over React, Spring: WebSocket Handshake (HTTP Upgrade)
    React->>Spring: Connect to /app
    Spring-->>React: Connection Established

    Note over React, Spring: User Joins Lobby
    React->>Spring: SEND /api/room/new (New Room Created)
    activate Spring
    
    Spring->>MySQL: Update Lobby State (INSERT/UPDATE)
    activate MySQL
    MySQL-->>Spring: Success
    deactivate MySQL

    Note right of Spring: Broadcast to all lobby members
    Spring-->>React: MESSAGE /app/room.join (JoinRoomRequest)
    deactivate Spring

    Spring-->>React: MESSAGE /app/room/{id} (Game Start / State Change)
```

### Standards & Conventions

<!--This is a link to a seperate coding conventions document / style guide-->
[Style Guide & Conventions](STYLE.md)
