# Boggle Game Rules & Mechanics

This document defines the core rules, round flow, scoring, and edge cases for our multiplayer Boggle implementation.

---
 
## 1. Basic Game Rules and Goals

Players compete to find valid words on a shared letter grid (could be either 3x3, 4x4, or 5x5) within a time limit.
At the end of the round, players earn points based on how many unique words they can formulate using the letters included in said grid.

---

## 2. Basic Definitions

The following terms will be used to describe different elements about the game:

- **Board**: A N x N grid of letters (default 4x4, but can be changed).
- **Adjacency** Each letter can be connected to its neighbors (horizontally, vertically, or diagonally)
- **Path**: A sequence of board positions forming a word.
- **No Reuse Rule**: A single letter in a cell can only be used ONCE in a single unique word path
- **Dictionary**: The authoritative word list used to validate word, kind of similar to scrabble.

---

## 3. Game Flow

1. Lobby:
- The players are put into a 2-8 player lobby via a unique code. 
- One player will be the host of the room and is able to tweak rules to their liking (how big the board is, setting the time limit, etc.)

2. Roung Start:
- The game begins and players are placed into the game room with a filled-in board (random dice shuffle) with a clicking countdown
- Timer begins (seconds)

3. Mid-Round:
- Players submit words 
- Server validates the words

4. End-Game:
- Submissions for new words close when timer hits 0
- Players are brought to a results end screen where the winner is announced and each players' scores are displayed.

---

## 4. Board Generation

- The board is generated from a fixed set of letter dice.
- Steps:
  1. Shuffle the dice list.
  2. For each dice, randomly select one face.
  3. Lay letters into the grid in row-major order.

---

## 5. Words Submission

A submitted word is accepted if all checks pass:

1. Formatting Check
- Case-insensitive. Server normalizes to lowercase.
- Only alphabetic characters allowed (language specific to English).
- Default minimum length is 3.

2. Dictionary Check
- Word must exist in the dictionary.

3. Board Path Check
- Word must be spellable by a valid path:
  - Each consecutive letter is adjacent (8 directions).
  - Must comply to No Reuse Rule (check section 2)
  - Multiple occurrences of a letter on the board are allowed, but must be different cells.

4. Duplicate Check (Per Player)
- A player cannot score the same word twice in a round.
- If a player submits a word they already submitted (accepted or rejected), it is rejected as duplicate.

5. Timing Rule
- Submissions are accepted only while the round state is `RUNNING`.
- Submissions arriving after end-of-round are rejected as `ROUND_OVER`.

---

## 6. Scoring

Points are based on word length:


| Length | Points |
|-------:|:------:|
| 0–2    | 0      |
| 3–4    | 1      |
| 5      | 2      |
| 6      | 3      |
| 7      | 5      |
| 8+     | 11     |

Words that fail validation score 0 points.

---

## 7. Results Screen Requirements

At end of round, show:

- Each player's total score
- Winner (player with highest score, ties allowed)

---

## 9. Words Rejection Codes (quick definition, open to change down the line)

When a word is rejected, the server returns a reason:

- `TOO_SHORT`
- `INVALID_CHARS`
- `NOT_IN_DICTIONARY`
- `NOT_ON_BOARD`
- `DUPLICATE`
- `ROUND_OVER`

---
