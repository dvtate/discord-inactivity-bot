CREATE DATABASE sexo;
USE sexo;

CREATE TABLE Channels (
    channelId VARCHAR(32) PRIMARY KEY,
    inactivityThresholdMs BIGINT NOT NULL
);

CREATE TABLE Phrases (
    channelId VARCHAR(32) NOT NULL REFERENCES Channels,
    phrase VARCHAR(512) NOT NULL,
    UNIQUE(channelId, phrase)
);
