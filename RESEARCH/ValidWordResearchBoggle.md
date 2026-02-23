# Research Report

## How to identify valid words for our Boggle project

### Summary of Work

During my research, I looked into different possibilities of how to check if words are valid or not when they are input by the user while considering efficiency since we need very fast results. 

### Motivation

I felt the need to do this since I was thinking about how this could be a potential roadblock later on if we used an API and it was extremely slow in the game. Additionally, my issue I need to work on is dependent on other issues that are not done yet so I decided to do some research about something I thought could help us later. Lastly, since I'm now well educated on this topic, it would probably be easy for me to implement later.

### Time Spent

I spent roughly 30 minutes discussing with ChatGPT[^2] about certain alternatives, how I could get a trie to work without a list of words (I didn't know if I would be able to find a .txt file with all the words), and what the trie method could potentially look like. I then spent 10-15 minutes looking for the best .txt file with English words and found one on GitHub eventually[^1]. Overall, I spent around 45 minutes researching.

### Results

I originally thought checking an API after every word would be the probable way of doing this before realizing that would be extremely slow for an API with hundreds of thousands of words. So, I asked ChatGPT[^2] what the smartest way of doing this would be and learned that using a trie is an extremely fast way of checking words after they are loaded when the website is first launched. To do this, all we need is a method for creating the trie and expanding it when a text file containing all english words is put into our trie method. I found a .txt file that contains nearly 500k words that should have every word that any of our users would know.[^1] So, every time the website is loaded, we can put this .txt file into our trie method so that users can have quick responses to whether they input a valid or invalid word.

### Sources

- Word List[^1]
- ChatGPT[^2]

[^1]: https://github.com/dwyl/english-words
[^2]: https://chatgpt.com/

