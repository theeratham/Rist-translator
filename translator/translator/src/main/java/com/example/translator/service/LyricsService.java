package com.example.translator.service;

import com.example.translator.entity.Lyrics;
import com.example.translator.entity.Song;
import com.example.translator.entity.external.SpotifyLyricLines;
import com.example.translator.entity.request.LyricsRequest;
import com.example.translator.repository.LyricsRepository;
import com.example.translator.repository.SongRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.reflect.TypeToken;
import com.google.gson.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Service
public class LyricsService {
    @Autowired
    private LyricsRepository lyricsRepository;
    @Autowired
    private SongRepository songRepository;
    @Autowired
    AiService aiService;
    @Autowired
    private AwsS3FileService awsS3FileService;
    @Value("${spotify.key}")
    private String spotifyKey;

    public List<Lyrics> findAllLyrics(){
        return lyricsRepository.findAll();
    }

    public Lyrics findLyricsById(Long lyrics_id){
        return lyricsRepository.findById(lyrics_id).orElseThrow(() -> new EntityNotFoundException("Lyrics Not Found"));
    }

    public boolean isInputNull(LyricsRequest request){
        return request.getSong_name() == null || request.getSong_name().isEmpty() ||
                request.getLyric() == null || request.getLyric().equals("");
    }

    public Lyrics findLyricsBySongId(Long songId) {
        return lyricsRepository.findLyricsBySong_Id(songId);
    }

    public Lyrics addLyrics(LyricsRequest request) {
        Lyrics lyrics = Lyrics.builder()
                .name(request.getSong_name())
                .lyric(request.getLyric())
                .build();
        return lyricsRepository.save(lyrics);
    }
    private HashMap<String, List<SpotifyLyricLines>> generateTranslatedLyrics (String lyrics) throws IOException {
        Gson gson = new Gson();
        String basePrompt = "" +
                "Input: JSON of synced lyrics lines of a song in JSON form\n" +
                "Output: only { \"lyric_lines: [{...}] } with lyric line objects with translated words with only startTimeMs and words, do not add newlines (\\n), do not remove decoration lines such as \"♪\"\n" +
                "Order: Translate given lyrics into Thai. Keep the mood of the song and try to translate metaphors if met. In case of grammatical weirdness crossing over lyric lines, you can swap their position according to how it should be\n" +
                "---\n";
        try {
            String aiResponse = aiService.getAiResponse(basePrompt + lyrics);
            String cleanedText = aiResponse.replaceAll("```json|```|\n", "");
            JsonObject lyricsObj = JsonParser.parseString(cleanedText).getAsJsonObject();
            JsonArray lines =  lyricsObj.get("lyric_lines").getAsJsonArray();
            Type listType = new TypeToken<List<SpotifyLyricLines>>() {}.getType();
            List<SpotifyLyricLines> linesList = gson.fromJson(lines, listType);
            HashMap<String, List<SpotifyLyricLines>> hashmapWithLines = new HashMap<>();
            hashmapWithLines.put("lyric_lines", linesList);
            return hashmapWithLines;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw e;
        }
    }
    public HashMap<String, List<SpotifyLyricLines>> generateLyricsFromSpotifyTrackId(String trackId) throws Exception {
        HashMap<String, List<SpotifyLyricLines>> lyrics = this.getSpotifyLyrics(trackId);
        return generateTranslatedLyrics(lyrics.toString());
    }

    public HashMap<String, List<SpotifyLyricLines>> getSpotifyLyrics (String trackId) throws Exception {
        if (trackId.isEmpty()) {
            throw new Exception("No Spotify track ID given!");
        }
        Gson gson = new Gson();
        HttpHeaders headers = new HttpHeaders();
        headers.add("authorization", "Bearer " + spotifyKey);
        headers.add("Accept", "application/json");
        headers.add("App-Platform", "WebPlayer");

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(
                "https://spclient.wg.spotify.com/color-lyrics/v2/track/" + trackId,
                HttpMethod.GET,
                entity,
                String.class
        );

        JsonObject parsed = JsonParser.parseString(Objects.requireNonNull(response.getBody())).getAsJsonObject();
        JsonObject lyricsObj = parsed.get("lyrics").getAsJsonObject();
        JsonArray lines =  lyricsObj.get("lines").getAsJsonArray();
        Type listType = new TypeToken<List<SpotifyLyricLines>>() {}.getType();
        List<SpotifyLyricLines> linesList = gson.fromJson(lines, listType);
        HashMap<String, List<SpotifyLyricLines>> hashmapWithLines = new HashMap<>();
        hashmapWithLines.put("lyric_lines", linesList);
        return hashmapWithLines;
    }

}
