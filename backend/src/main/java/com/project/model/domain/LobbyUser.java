package com.project.model.entity;

public class LobbyUser {
    private String name;
    private String avatar;
    private boolean isReady;
    private boolean isHost;

    public LobbyUser(String name, String avatar, boolean isReady, boolean isHost) {
        this.name = name;
        this.avatar = avatar;
        this.isReady = isReady;
        this.isHost = isHost;
    }
}
