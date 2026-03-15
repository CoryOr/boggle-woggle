package com.project.service;

/**
 * This is the Trie class that will store the dictionary of valid words for our Boggle game.
 * This class can insert words (upon startup from the words.txt file) and check for valid words
 */
public class Trie {
  // Root is originally a blank TrieNode
  private final TrieNode root = new TrieNode();

  /**
   * This class inserts a valid word into the Trie from words.txt and marks it as valid at the end
   * @param word - The word being read from words.txt
   */
  public void insert(String word) {

    // Words less than 2 are invalid and words > 16 are impossible
    if (word.length() <= 2 || word.length() >= 17) {
      return;
    }

    TrieNode current = root;

    // Checks if the node exists, adds it if it doesn't, and continues to the next level of the
    // trie if it does or doesn't exist already
    for (char c : word.toCharArray()) {
      int index = c - 'a';

      if (current.children[index] == null) {
        current.children[index] = new TrieNode();
      }

      current = current.children[index];
    }

    // Set word to valid when the end of the word is reached
    current.validWord = true;
  }

  /**
   * Checks if the word being input from the frontend board is valid
   * @param word - The word input by the user
   * @return true if the word is valid; false otherwise
   */
  public boolean isWord(String word) {

    // In case it already isn't from frontend input
    word = word.toLowerCase();

    TrieNode current = root;

    for (char c : word.toCharArray()) {
      int index = c - 'a';

      if (current.children[index] == null) {
        return false;
      }

      current = current.children[index];
    }

    return current.validWord;
  }
}
