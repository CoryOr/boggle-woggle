package com.project.model.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateReadyRequest {
    private String roomCode;
    private String username;

    public UpdateReadyRequest() {}

    @JsonCreator
    public UpdateReadyRequest(
            @JsonProperty("roomCode") String roomCode,
            @JsonProperty("username") String username) {
        this.roomCode = roomCode;
        this.username = username;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}