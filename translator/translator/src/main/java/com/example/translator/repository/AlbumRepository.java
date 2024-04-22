package com.example.translator.repository;

import com.example.translator.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlbumRepository extends JpaRepository<Album,Long> {
    boolean existsByName(String name);
    Optional<Album> findByName(String name);
    List<Album> findByNameContaining(String input);
}
