package com.project.model.domain;

public class LobbyUser {
    private String username;
    private String avatar;
    private boolean isReady;
    private boolean isHost;

    public LobbyUser(String username, String avatar, boolean isReady, boolean isHost) {
        this.username = username;
        this.avatar = avatar;
        this.isReady = isReady;
        this.isHost = isHost;
    }

    public String getUsername() {
        return username;
    }

    public String getAvatar() {
        return avatar;
    }

    public boolean getIsReady() {
        return isReady;
    }

    public boolean getIsHost() {
        return isHost;
    }

    public void setIsReady() {
        isReady = !isReady;
    }
}
