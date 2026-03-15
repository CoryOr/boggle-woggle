package com.project.controller;

import com.project.service.DictionaryService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/words")
public class WordController {

  private final DictionaryService dictionaryService;

  public WordController(DictionaryService dictionaryService) {
    this.dictionaryService = dictionaryService;
  }

  // Check if a string is a valid word
  @GetMapping("/check")
  public boolean checkWord(@RequestParam String word) {
    return dictionaryService.isValidWord(word);
  }
}
