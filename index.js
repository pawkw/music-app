const $ = require('jquery');
const mm = require('music-metadata');
const { ipcRenderer } = require('electron');

let songData = {path: [], title: [], artist: []};
let audioPlayer = $('audio').get(0);
let playing = false;
let currentIndex = 0;
let numberOfSongs = 0;
let timer = null;

function chooseMusic() {
    $('input').click();
}

async function musicSelected() {
    let files = $('input').get(0).files;
    console.log(files);
    
    for(let i=0; i<files.length; i++) {
        let {path, name} = files[i];
        console.log(i+numberOfSongs, path);
        const metadata = await mm.parseFile(path, {native: true});
        console.log(metadata.common.title, metadata.common.artist, metadata.format.duration);
        songData.path[i+numberOfSongs] = path;
        songData.title[i+numberOfSongs] = metadata.common.title ? metadata.common.title : name;
        songData.artist[i+numberOfSongs] = metadata.common.artist ? metadata.common.artist : '???';
        let duration = metadata.format.duration ? secondsToTime(metadata.format.duration) : '??:??';
        $('#table-body').append( `
            <tr onclick="playSong(${i+numberOfSongs})" id="song-${i+numberOfSongs}">
                <td>${songData.title[i+numberOfSongs]}</td>
                <td>${songData.artist[i+numberOfSongs]}</td>
                <td>${duration}</td>
            </tr>`);
    }
    numberOfSongs += files.length;
}

function playSong(index) {
    audioPlayer.src = songData.path[index];
    audioPlayer.load();
    audioPlayer.play();
    $('h4').text(songData.title[index]+" - "+songData.artist[index]);
    $(`#song-${currentIndex}`).removeClass('playing');
    $(`#song-${index}`).addClass('playing');
    playing = true;
    updatePlayButton();
    console.log('Playing: '+currentIndex);
    currentIndex = index;
    timer = setInterval(updateTime, 1000);
    ipcRenderer.send('playing', songData.title[index]);
}

function playPrev() {
    $(`#song-${currentIndex}`).removeClass('playing');
    currentIndex--;
    if(currentIndex < 0) {
        currentIndex = songData.path.length-1;
    }
    playSong(currentIndex);
}

function playNext() {
    $(`#song-${currentIndex}`).removeClass('playing');
    console.log('Current: '+currentIndex);
    currentIndex++;
    if(currentIndex >= songData.path.length) {
        currentIndex = 0;
    }
    playSong(currentIndex);
}

function play() {
    if(playing) {
        audioPlayer.pause();
        playing = false;
        clearInterval(timer);
    } else {
        audioPlayer.play();
        playing = true;
        timer = setInterval(updateTime, 1000);
    }
    updatePlayButton();
}

function clearPlaylist() {
    audioPlayer.pause();
    audioPlayer.src = '';
    clearInterval(timer);
    timer = null;
    currentIndex = 0;
    numberOfSongs = 0;
    playing = false;
    $('h4').text('');
    songData = songData = {path: [], title: [], artist: []};
    $('#time-left').text('00:00');
    $('#total-time').text('00:00');
    $('#table-body').html('');
    updatePlayButton();
}

function updateTime() {
    if(!playing) return;
    $('#time-left').text(secondsToTime(audioPlayer.currentTime));
    $('#total-time').text(secondsToTime(audioPlayer.duration));
}


function updatePlayButton() {
    let playIcon = $('#play-button span');
    if(playing) {
        playIcon.removeClass('icon-play');
        playIcon.addClass('icon-pause');
    } else {
        playIcon.removeClass('icon-pause');
        playIcon.addClass('icon-play');
    }
}

function secondsToTime(t) {
    return padZero(parseInt((t/(60)) % 60)) + ":" + padZero(parseInt((t) % 60));
}

function padZero(v) {
    return (v<10) ? '0'+v : v;
}