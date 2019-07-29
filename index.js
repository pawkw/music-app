const $ = require('jquery');
const mm = require('music-metadata');
let songData = {path: [], title: [], artist: []};
let audioPlayer = $('audio').get(0);
let playing = false;

function chooseMusic() {
    $('input').click();
}

function musicSelected() {
    let files = $('input').get(0).files;
    console.log(files);

    for(let i = 0; i<files.length; i++) {
        let {name, path} = files[i];
        
        mm.parseFile(path, {native:true}).then(metadata => {
            let title = (metadata.common.title == undefined) ? name : metadata.common.title;
            let artist = (metadata.common.artist == undefined) ? '???' : metadata.common.artist;
            let duration = (metadata.format.duration == undefined) ? '??:??' : secondsToTime(metadata.format.duration);
            songData.path[i] = path;
            songData.title[i] = title;
            songData.artist[i] = artist;
            let songRow = `<tr ondblclick="playSong(${i})">
                <td>${title}</td>
                <td>${artist}</td>
                <td>${duration}</td>
            </tr>`;
            $('#table-body').append(songRow);
        });
    }
}

function playSong(index) {
    audioPlayer.src = songData.path[index];
    audioPlayer.load();
    audioPlayer.play();
    $('h4').text(songData.title[index]+" - "+songData.artist[index]);
    playing = true;
    updatePlayButton();
}

function play() {
    if(playing) {
        audioPlayer.pause();
        playing = false;
    } else {
        audioPlayer.play();
        playing = true;
    }
    updatePlayButton();
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