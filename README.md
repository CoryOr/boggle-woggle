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
    Users ||--o{ GameResult : "has"
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

#### Class Diagram (Not fully thought out yet)

```mermaid
---
title: Sample Class Diagram for Animal Program
---
classDiagram
    class Animal {
        - String name
        + Animal(String name)
        + void setName(String name)
        + String getName()
        + void makeSound()
    }
    class Dog {
        + Dog(String name)
        + void makeSound()
    }
    class Cat {
        + Cat(String name)
        + void makeSound()
    }
    class Bird {
        + Bird(String name)
        + void makeSound()
    }
    Animal <|-- Dog
    Animal <|-- Cat
    Animal <|-- Bird
```

#### Flowchart

```mermaid
---
title: Authentication & Authorization Flow (Spring Boot + JWT)
---
graph TD;

    Start([Start]) --> Login_Request[/User Submits Login (React)/];

    Login_Request --> Send_To_Backend[Send Credentials to Spring Boot];
    Send_To_Backend --> Load_User[Load User from Database];

    Load_User --> Validate_Credentials{Credentials Valid?};

    Validate_Credentials -->|No| Return_401[/Return 401 Unauthorized/];
    
    Validate_Credentials -->|Yes| Generate_JWT[Generate JWT Token];
    Generate_JWT --> Return_Token[/Return JWT to Frontend/];

    Return_Token --> Protected_Request[/User Requests Protected Endpoint (Bearer Token)/];
    Protected_Request --> Validate_JWT{JWT Valid?};

    Validate_JWT -->|No| Reject_Request[/Return 401 Unauthorized/];
    
    Validate_JWT -->|Yes| Check_Roles{Has Required Role?};

    Check_Roles -->|No| Return_403[/Return 403 Forbidden/];
    Check_Roles -->|Yes| Access_Resource[Access Protected Resource];

    Access_Resource --> Send_Response[/Return Protected Data/];
    Send_Response --> End([End]);

    Return_401 --> End;
    Reject_Request --> End;
    Return_403 --> End;
```

#### Behavior (Not fully thought out yet)

```mermaid
---
title: Sample State Diagram For Coffee Application
---
stateDiagram
    [*] --> Ready
    Ready --> Brewing : Start Brewing
    Brewing --> Ready : Brew Complete
    Brewing --> WaterLowError : Water Low
    WaterLowError --> Ready : Refill Water
    Brewing --> BeansLowError : Beans Low
    BeansLowError --> Ready : Refill Beans
```

#### Sequence Diagram (Not fully thought out yet)

```mermaid
sequenceDiagram

participant ReactFrontend
participant DjangoBackend
participant MySQLDatabase

ReactFrontend ->> DjangoBackend: HTTP Request (e.g., GET /api/data)
activate DjangoBackend

DjangoBackend ->> MySQLDatabase: Query (e.g., SELECT * FROM data_table)
activate MySQLDatabase

MySQLDatabase -->> DjangoBackend: Result Set
deactivate MySQLDatabase

DjangoBackend -->> ReactFrontend: JSON Response
deactivate DjangoBackend
```

### Standards & Conventions

<!--This is a link to a seperate coding conventions document / style guide-->
[Style Guide & Conventions](STYLE.md)
