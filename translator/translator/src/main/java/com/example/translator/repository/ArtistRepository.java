package com.example.translator.repository;

import com.example.translator.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<Artist,Long> {
    boolean existsByName(String name);
    Optional<Artist> findByName(String name);
    List<Artist> findByNameContaining(String input);
}
