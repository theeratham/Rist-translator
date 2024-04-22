package com.example.translator.exception;

import java.util.List;

public class InvalidFileExtensionException extends Exception {
    public InvalidFileExtensionException(List<String> validExtensions) {
        super("Valid File Extensions are:" + String.join(", ", validExtensions));
    }
}