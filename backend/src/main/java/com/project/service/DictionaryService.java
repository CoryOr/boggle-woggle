package com.project.service;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

/**
 * Loads the dictionary into a trie at startup and provides methods for the backend to check
 * if an input string is a valid word for our Boggle game
 */
@Service
public class DictionaryService {

  private Trie trie = new Trie();

  // Constructor
  public Trie getTrie() {
    return trie;
  }

  /**
   * Loads the dictionary line by line of the words.txt file, adding these as
   * valid words to the trie
   * @throws IOException with errors in readLine()
   */
  @PostConstruct
  public void loadDictionary() throws IOException {
    BufferedReader reader =
        new BufferedReader(
            new InputStreamReader(
                getClass().getResourceAsStream("/words.txt")
            )
        );

    String word;

    while ((word = reader.readLine()) != null) {
      trie.insert(word.trim());
    }
  }

  /**
   * Uses the Trie.java isWord() function to check if the String word is valid
   * @param word - the input string from the player
   * @return true if a valid word; false otherwise
   */
  public boolean isValidWord(String word) {
      if (word.length() < 3) {
          return false;
      }

      return trie.isWord(word);
  }
}
