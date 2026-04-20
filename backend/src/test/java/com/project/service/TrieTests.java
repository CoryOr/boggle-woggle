package com.project.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class TrieTests {
    private Trie trie;

    @BeforeEach
    void setUp() {
        trie = new Trie();
    }

    /**
     * Tests that a single word inserted is a word
     */
    @Test
    void testSimpleWord() {
        trie.insert("hello");

        assert(trie.isWord("hello"));
    }

    /**
     * Tests that inserting multiple words results in all of them being valid
     */
    @Test
    void testMultipleValidWords() {
        trie.insert("hello");
        trie.insert("world");
        trie.insert("test");

        assert(trie.isWord("hello"));
        assert(trie.isWord("world"));
        assert(trie.isWord("test"));
    }

    /**
     * Tests validating a valid word that hasn't yet been inserted. It shouldn't be a word in the trie yet
     */
    @Test
    void testNotYetInsertedWord() {
        trie.insert("hello");
        assert(!trie.isWord("world"));
    }

    /**
     * Tests seeing if a partial word is valid, which is shouldn't be.
     */
    @Test
    void testPartialWord() {
        trie.insert("hello");
        assert(!trie.isWord("hel"));
    }

    /**
     * Tests that adding more random letters to a valid word doesn't result in a valid longer word.
     */
    @Test
    void testWordLongerThanValidWordThatIsInvalid() {
        trie.insert("test");
        assert(trie.isWord("test"));
        assert(!trie.isWord("testasdf"));
    }

    /**
     * Tests that words that have the same first few letters are valid
     */
    @Test
    void testWordLongerThanValidWordThatIsValid() {
        trie.insert("test");
        trie.insert("testing");
        assert(trie.isWord("test"));
        assert(trie.isWord("testing"));
    }

    /**
     * Words less than two letters aren't inserted, so that should be tested.
     */
    @Test
    void testTwoLetterWord() {
        trie.insert("so");
        assert(!trie.isWord("so"));
    }

    /**
     * Words longer than 16 letters aren't possible to make with the gameboards.
     */
    @Test
    void testTooLongWord() {
        trie.insert("pneumonoultramicroscopicsilicovolcanoconiosis");
        assert(!trie.isWord("pneumonoultramicroscopicsilicovolcanoconiosis"));
    }

    /**
     * Tests that an empty word isn't considered a word
     */
    @Test
    void testEmptyWord() {
        assert(!trie.isWord(""));
    }

    /**
     * isWord in Trie.java converts input to lowercase, so that should also be tested.
     */
    @Test
    void testIsWordWorksWithUppercaseWords() {
        trie.insert("hello");

        assert(trie.isWord("HELLO"));
        assert(trie.isWord("hElLO"));
    }
}
