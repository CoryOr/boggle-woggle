package com.project.model.entity;

import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.Random;
import static org.junit.jupiter.api.Assertions.*;

class BoardTest {
  @Test
  void getBoard_ShouldProduceExpectedBoardWithKnownSeed() {
    String[][] result = new Board(new Random(42)).getBoard();
    
    String[][] expected = {
      {"N", "A", "A", "B"},
      {"Y", "I", "I", "G"},
      {"O", "U", "T", "T"},
      {"T", "E", "A", "V"}
    };

    assertArrayEquals(expected, result);
  }
}