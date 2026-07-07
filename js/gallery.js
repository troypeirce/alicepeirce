/* ==========================================
   Alice Peirce Gallery - Apple Photos Style
========================================== */


const albumNames = Object.keys(albums);
let currentAlbum = albumNames[albumNames.length - 1];
let currentIndex = 0;
let playing = false;
let interval = null;
// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

const SWIPE_DISTANCE = 60;

// DOM elements
const photo = document.getElementById("photo");
const albumTitle = document.getElementById("albumTitle");
const photoCounter = document.getElementById("photoCounter");
const filmstrip = document.getElementById("filmstrip");

const prevBtn = document.getElementById("previousButton");
const nextBtn = document.getElementById("nextButton");
const playBtn = document.getElementById("playButton");
const fullscreenBtn = document.getElementById("fullscreenButton");

/* ==========================================
   LOAD PHOTOS (from photos.js)
========================================== */

function loadAlbum(name) {
    currentAlbum = name;
    currentIndex = 0;

    renderFilmstrip();
    updateView();
}

/* ==========================================
   UPDATE VIEW
========================================== */

function updateView() {

    const photos = albums[currentAlbum];

    if (!photos || photos.length === 0) {
        photo.src = "";
        albumTitle.innerText = currentAlbum;
        photoCounter.innerText = "No photos yet";
        filmstrip.innerHTML = "";
        return;
    }

    const src = photos[currentIndex];

    // fade effect
    photo.style.opacity = 0;

    setTimeout(() => {
        photo.src = src;
        photo.style.opacity = 1;
    }, 200);

    albumTitle.innerText = currentAlbum;
    photoCounter.innerText = `${currentIndex + 1} of ${photos.length}`;

    highlightThumbnail();
}

/* ==========================================
   NAVIGATION
========================================== */

function nextPhoto() {
    const photos = albums[currentAlbum];
    if (!photos) return;

    currentIndex = (currentIndex + 1) % photos.length;
    updateView();
}

function prevPhoto() {
    const photos = albums[currentAlbum];
    if (!photos) return;

    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updateView();
}

/* ==========================================
   THUMBNAILS (FILMSTRIP)
========================================== */

function renderFilmstrip() {

    filmstrip.innerHTML = "";

    const photos = albums[currentAlbum];
    if (!photos) return;

    photos.forEach((src, index) => {

        const img = document.createElement("img");

        img.src = src;
        img.className = "thumbnail";

        img.onclick = () => {
            currentIndex = index;
            updateView();
        };

        filmstrip.appendChild(img);
    });
}

function highlightThumbnail() {

    const thumbs = document.querySelectorAll(".thumbnail");

    thumbs.forEach((t, i) => {

        if (i === currentIndex) {
            t.classList.add("active");
        } else {
            t.classList.remove("active");
        }
    });
}

/* ==========================================
   PLAY / PAUSE SLIDESHOW
========================================== */

function toggleSlideshow() {

    playing = !playing;

    if (playing) {

        playBtn.innerText = "⏸ Pause";

        interval = setInterval(() => {
            nextPhoto();
        }, 5000);

    } else {

        playBtn.innerText = "▶ Play Slideshow";

        clearInterval(interval);
    }
}

/* ==========================================
   FULLSCREEN
========================================== */



async function toggleFullscreen() {

    try {

        if (!document.fullscreenElement) {

            await document.getElementById("viewer").requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (err) {

        console.error(err);

    }

}

/* ==========================================
   KEYBOARD CONTROLS
========================================== */

document.addEventListener("keydown", (e) => {

    switch (e.key) {

        case "ArrowRight":
            nextPhoto();
            break;

        case "ArrowLeft":
            prevPhoto();
            break;

        case " ":
            e.preventDefault();
            toggleSlideshow();
            break;

        case "f":
        case "F":
            toggleFullscreen();
            break;

        case "Escape":
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
});

/* ==========================================
   ALBUM BUTTONS
========================================== */

const albumsButton = document.getElementById("albumsButton");
const albumMenu = document.getElementById("albumMenu");

albumsButton.onclick = ()=>{

    albumMenu.classList.toggle("show");

    overlay.classList.toggle("show");

}

const overlay = document.getElementById("overlay");

function buildAlbumMenu(){

    albumMenu.innerHTML = "";

    for(const name in albums){

        const item = document.createElement("div");

        item.className = "albumItem";

        item.innerHTML =

            '<span class="albumName">📷 '
            + name
            + '</span>'

            +

            '<span class="albumCount">'
            + albums[name].length
            + '</span>';

        item.onclick = ()=>{

            loadAlbum(name);

            albumMenu.classList.remove("show");

            overlay.classList.remove("show");

        };

        albumMenu.appendChild(item);

    }

}

/* ==========================================
   BUTTON EVENTS
========================================== */

nextBtn.onclick = nextPhoto;
prevBtn.onclick = prevPhoto;
playBtn.onclick = toggleSlideshow;
fullscreenBtn.onclick = toggleFullscreen;

/* ==========================================
   INIT (wait for photos.js)
========================================== */

window.addEventListener("load", () => {

    if (typeof albums === "undefined") {
        console.error("albums not found - check photos.js");
        return;
    }

    loadAlbum(currentAlbum);
	buildAlbumMenu();
});

overlay.onclick = ()=>{

    albumMenu.classList.remove("show");

    overlay.classList.remove("show");

}

/* ==========================================
   TOUCH SWIPE SUPPORT
========================================== */

const viewer = document.getElementById("viewer");

viewer.addEventListener("touchstart", (e) => {

    touchStartX = e.changedTouches[0].screenX;

}, { passive: true });

viewer.addEventListener("touchend", (e) => {

    touchEndX = e.changedTouches[0].screenX;

    handleSwipe();

}, { passive: true });

function handleSwipe() {

    const distance = touchEndX - touchStartX;

    // Swipe Left
    if (distance < -SWIPE_DISTANCE) {

        nextPhoto();

    }

    // Swipe Right
    else if (distance > SWIPE_DISTANCE) {

        prevPhoto();

    }

}