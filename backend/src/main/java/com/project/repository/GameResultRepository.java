package com.project.repository;

import com.project.model.entity.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface GameResultRepository extends JpaRepository<GameResult, UUID> {
}