package com.example.translator.repository;

import com.example.translator.entity.Lyrics;
import com.example.translator.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SongRepository extends JpaRepository<Song,Long> {
    boolean existsByName(String name);
    Optional<Song> findByName(String name);
    List<Song> findByNameContaining(String input);

}
