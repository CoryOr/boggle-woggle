package com.project.service;

/**
 * This is the node class for the Trie.java class. Each node is originally set to false.
 */
public class TrieNode {
  TrieNode[] children = new TrieNode[26];
  boolean validWord = false;

}
