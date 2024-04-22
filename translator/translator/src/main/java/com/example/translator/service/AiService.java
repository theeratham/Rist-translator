package com.example.translator.service;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.*;
import com.google.cloud.vertexai.generativeai.ContentMaker;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseStream;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.protobuf.AbstractMessage;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Service
public class AiService {
    GenerativeModel model;
    AiService() {
        VertexAI vertexAi  = new VertexAI("winged-complex-398215", "asia-southeast1");
        GenerationConfig generationConfig =
                GenerationConfig.newBuilder()
                        .setMaxOutputTokens(8192)
                        .setTemperature(1F)
                        .setTopP(0.95F)
                        .build();
        List<SafetySetting> safetySettings = Arrays.asList(
                SafetySetting.newBuilder()
                        .setCategory(HarmCategory.HARM_CATEGORY_HATE_SPEECH)
                        .setThreshold(SafetySetting.HarmBlockThreshold.BLOCK_ONLY_HIGH)
                        .build(),
                SafetySetting.newBuilder()
                        .setCategory(HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT)
                        .setThreshold(SafetySetting.HarmBlockThreshold.BLOCK_ONLY_HIGH)
                        .build(),
                SafetySetting.newBuilder()
                        .setCategory(HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT)
                        .setThreshold(SafetySetting.HarmBlockThreshold.BLOCK_ONLY_HIGH)
                        .build(),
                SafetySetting.newBuilder()
                        .setCategory(HarmCategory.HARM_CATEGORY_HARASSMENT)
                        .setThreshold(SafetySetting.HarmBlockThreshold.BLOCK_ONLY_HIGH)
                        .build()
        );
        model = GenerativeModel.newBuilder()
                        .setModelName("gemini-1.5-pro-preview-0409")
                        .setVertexAi(vertexAi)
                        .setGenerationConfig(generationConfig)
                        .setSafetySettings(safetySettings)
                        .build();
    }
    public String getAiResponse(String question) throws IOException {
        var content = ContentMaker.fromMultiModalData(question);
        GenerateContentResponse response = model.generateContent(content);
        response.getCandidates(0).getContent().getPartsList().forEach(System.out::println);
        System.out.println(response.getCandidates(0).getContent().getPartsCount());
        System.out.println(response.getCandidates(0).getContent().getParts(0).getText());
        return response.getCandidates(0).getContent().getParts(0).getText();

    }



}
