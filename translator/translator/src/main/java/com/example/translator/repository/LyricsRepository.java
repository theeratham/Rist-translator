package com.example.translator.repository;

import com.example.translator.entity.Lyrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LyricsRepository extends JpaRepository<Lyrics, Long> {
    boolean existsByName(String name);
    List<Lyrics> findByLyricContaining(String input);

    Lyrics findLyricsBySong_Id(Long songId);
}
