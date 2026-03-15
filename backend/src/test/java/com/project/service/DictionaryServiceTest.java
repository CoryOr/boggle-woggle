package com.project.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * This is a test class for DictionaryService.java. It uses a test_words.txt file containing
 * various words that address some potential edge cases.
 */
class DictionaryServiceTest {

  private DictionaryService dictionaryService;

  /**
   * Sets up the test dictionary
   * @throws IOException for mistakes with readLine()
   */
  @BeforeEach
  void setUp() throws IOException {
    dictionaryService = new DictionaryService();

    BufferedReader reader =
        new BufferedReader(
            new InputStreamReader(
                getClass().getResourceAsStream("/test_words.txt")
            )
        );

    String word;
    while ((word = reader.readLine()) != null) {
      dictionaryService.getTrie().insert(word.trim().toLowerCase());
    }
  }

  /**
   * Tests various words that are in the dictionary and some that are not. Words that are shorter
   * than 3 letters or longer than 16 letters should not be added, so this is tested as well.
   */
  @Test
  void testValidWords() {
    assertTrue(dictionaryService.isValidWord("cat"));
    assertTrue(dictionaryService.isValidWord("doing"));
    assertTrue(dictionaryService.isValidWord("dots"));
    assertTrue(dictionaryService.isValidWord("dot"));
    assertTrue(dictionaryService.isValidWord("cardinal"));
    assertTrue(dictionaryService.isValidWord("card"));
    assertTrue(dictionaryService.isValidWord("cards"));
    assertTrue(dictionaryService.isValidWord("dog"));
    assertTrue(dictionaryService.isValidWord("dogs"));
    assertTrue(dictionaryService.isValidWord("cat"));

    assertFalse(dictionaryService.isValidWord("anticommercialism"));
    assertFalse(dictionaryService.isValidWord("do"));
    assertFalse(dictionaryService.isValidWord("dotty"));
    assertFalse(dictionaryService.isValidWord("car"));
    assertFalse(dictionaryService.isValidWord("god"));
    assertFalse(dictionaryService.isValidWord("stop"));
  }
}
