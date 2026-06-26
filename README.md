# Boggle Woggle

A full-stack multiplayer Boggle game built with React, Spring Boot, MySQL, and WebSockets.

## Overview

Boggle Woggle is a real-time word game where users can play singleplayer or compete against others in multiplayer lobbies. The app generates randomized Boggle boards, validates submitted words, tracks player statistics, and supports real-time multiplayer gameplay through WebSockets. Built as part of a five-person software engineering team using Agile development practices, Git workflows, code reviews, and CI/CD pipelines.

## Notable Contributions

- Lead UI/UX designer in Pre-Production/Concept Art
- Implemented a global audio system using React Context
- Added menu music, gameplay music, and sound effects
- Implemented separate master, music, and SFX volume controls
- Added winner/loser multiplayer audio feedback
- Integrated audio throughout the application UI
- Resolved merge conflicts and integrated multiplayer updates

## Screenshots

### Home Screen
![Home](docs/screenshots/HomeScreenWithUser.png)

### Login Screen
![Login](docs/screenshots/LoginScreen.png)

### Multiplayer Lobby
![Lobby](docs/screenshots/LobbyScreen.png)

### Gameplay
![Gameplay](docs/screenshots/SinglePlayerGameplay.png)

### Player Statistics
![Stats](docs/screenshots/StatsWithUser.png)

### Audio Settings
![Settings](docs/screenshots/SettingsPageGuest.png)

## Demo

Video walkthrough: [YouTube Link]

## Tech Stack

- React
- Spring Boot
- MySQL
- WebSockets
- JWT Authentication

## Running Locally

### Backend

```bash
cd backend
./gradlew bootRun
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Technical Documentation

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

### Additional Documentation

[Style Guide & Conventions](STYLE.md)
