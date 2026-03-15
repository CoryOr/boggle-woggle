package com.project.model.domain;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.Collections;

public class Board {
  private String[][] board;

  public Board() {
    this.board = generateBoard();
  }

  // Only used for testing with a specified random seed
  public Board(Random rand) {
    this.board = generateBoardTest(rand);
  }

  public String[][] getBoard() {
    return board;
  }

  // Only used for testing with a specified random seed
  private String[][] generateBoardTest(Random rand) {

    String[][] grid = new String[4][4];

    // Generates lists for dice given in the physical game
    List<String> d1 = List.of("A", "A", "E", "E", "G", "N");
    List<String> d2 = List.of("A", "B", "B", "J", "O", "O");
    List<String> d3 = List.of("A", "C", "H", "O", "P", "S");
    List<String> d4 = List.of("A", "F", "F", "K", "P", "S");
    List<String> d5 = List.of("A", "O", "O", "T", "T", "W");
    List<String> d6 = List.of("C", "I", "M", "O", "T", "U");
    List<String> d7 = List.of("D", "E", "I", "L", "R", "X");
    List<String> d8 = List.of("D", "E", "L", "R", "V", "Y");
    List<String> d9 = List.of("D", "I", "S", "T", "T", "Y");
    List<String> d10 = List.of("E", "E", "G", "H", "N", "W");
    List<String> d11 = List.of("E", "E", "I", "N", "S", "U");
    List<String> d12 = List.of("E", "H", "R", "T", "V", "W");
    List<String> d13 = List.of("E", "I", "O", "S", "T", "X");
    List<String> d14 = List.of("N", "O", "O", "U", "T", "W");
    List<String> d15 = List.of("Qu", "I", "E", "Z", "L", "E");
    List<String> d16 = List.of("S", "S", "N", "S", "E", "U");

    List<List<String>> dice = new ArrayList<>();
    dice.addAll(Arrays.asList(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16));

    Collections.shuffle(dice, rand);

    // Randomize locations of dice and then pick the face to show
    for (int i = 0; i < 16; i++) {
      int row = i / 4;
      int col = i % 4;
      List<String> die = dice.get(i);
      grid[row][col] = die.get(rand.nextInt(6));
    }


    return grid;
  }
  
  private String[][] generateBoard() {

    String[][] grid = new String[4][4];
    Random rand = new Random();

    // Generates lists for dice given in the physical game
    List<String> d1 = List.of("A", "A", "E", "E", "G", "N");
    List<String> d2 = List.of("A", "B", "B", "J", "O", "O");
    List<String> d3 = List.of("A", "C", "H", "O", "P", "S");
    List<String> d4 = List.of("A", "F", "F", "K", "P", "S");
    List<String> d5 = List.of("A", "O", "O", "T", "T", "W");
    List<String> d6 = List.of("C", "I", "M", "O", "T", "U");
    List<String> d7 = List.of("D", "E", "I", "L", "R", "X");
    List<String> d8 = List.of("D", "E", "L", "R", "V", "Y");
    List<String> d9 = List.of("D", "I", "S", "T", "T", "Y");
    List<String> d10 = List.of("E", "E", "G", "H", "N", "W");
    List<String> d11 = List.of("E", "E", "I", "N", "S", "U");
    List<String> d12 = List.of("E", "H", "R", "T", "V", "W");
    List<String> d13 = List.of("E", "I", "O", "S", "T", "X");
    List<String> d14 = List.of("N", "O", "O", "U", "T", "W");
    List<String> d15 = List.of("Qu", "I", "E", "Z", "L", "E");
    List<String> d16 = List.of("S", "S", "N", "S", "E", "U");

    List<List<String>> dice = new ArrayList<>();
    dice.addAll(Arrays.asList(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16));

    Collections.shuffle(dice, rand);

    // Randomize locations of dice and then pick the face to show
    for (int i = 0; i < 16; i++) {
      int row = i / 4;
      int col = i % 4;
      List<String> die = dice.get(i);
      grid[row][col] = die.get(rand.nextInt(6));
    }


    return grid;
  }
}