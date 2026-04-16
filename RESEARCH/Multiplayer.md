# Research Report

## Multiplayer

### Summary of Work

I researched how the multiplayer is structured. I focused on how the frontend and backend should communicate, what responsibilities each side should handle, and what kind of architecture works best. I created a google doc for notes and a multiplayer example project to compare ideas and use some of their elements and put it into our project.

### Motivation

Because none of us have extensive experience in making multiplayer games.

### Time Spent

I spent about 150 minutes watching YouTube videos, checking their GitHub links, and asking ChatGPT about different approaches to making multiplayer functionality.

### Results

The frontend should handle the interface and player interactions. It should also reuse existing UI components when possible so development stays consistent. For setup actions like creating a room, joining a game, or marking a player as ready, we'll use REST endpoints make sense For live game updates, we'll use WebSockets are a better choice because they allow the game to update in real time without constant refreshing.[^1]

The Stick Fighter repository is a multiplayer fighting game built in JavaScript with an Express server and Socket.io. The repository structure shows a separation between client and server code, which matches the architecture I found in my research.[^2]

### Sources

- ChatGPT[^1]
- Multiplayer Example[^2]

[^1]: https://chatgpt.com/
[^2]: https://github.com/jfox16/stick-fighter