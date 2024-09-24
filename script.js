const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// Elements
const searchBtn = document.getElementById('search-btn');
const wordInput = document.getElementById('word-input');
const wordTitle = document.getElementById('word-title');
const definition = document.getElementById('definition');
const audioBtn = document.getElementById('audio-btn');
const loader = document.getElementById('loader');
const historyList = document.getElementById('history-words');

let searchHistory = [];

// Show loader
function showLoader() {
    loader.style.display = 'block';
}

// Hide loader
function hideLoader() {
    loader.style.display = 'none';
}

// Fetch word definition from API
async function fetchWord(word) {
    showLoader();
    try {
        const response = await fetch(`${apiUrl}${word}`);
        const data = await response.json();
        hideLoader();
        
        if (data && data[0]) {
            const wordData = data[0];
            wordTitle.textContent = wordData.word;
            definition.textContent = wordData.meanings[0].definitions[0].definition;
            
            // Audio pronunciation
            if (wordData.phonetics[0].audio) {
                audioBtn.style.display = 'inline';
                audioBtn.onclick = () => playAudio(wordData.phonetics[0].audio);
            } else {
                audioBtn.style.display = 'none';
            }

            // Update history
            updateHistory(wordData.word);
        } else {
            wordTitle.textContent = "Word not found";
            definition.textContent = "Try searching for another word.";
            audioBtn.style.display = 'none';
        }
    } catch (error) {
        hideLoader();
        wordTitle.textContent = "Error";
        definition.textContent = "There was an issue fetching the definition.";
    }
}

// Play audio pronunciation
function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}

// Update search history
function updateHistory(word) {
    if (!searchHistory.includes(word)) {
        searchHistory.push(word);
        const historyItem = document.createElement('li');
        historyItem.textContent = word;
        historyList.appendChild(historyItem);
    }
}

// Search button event
searchBtn.addEventListener('click', () => {
    const word = wordInput.value.toLowerCase().trim();
    if (word) {
        fetchWord(word);
    }
});

// Random word generator
document.getElementById('random-word').addEventListener('click', () => {
    const words = ['apple', 'book', 'computer', 'javascript', 'ocean'];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    fetchWord(randomWord);
});

// About page
document.getElementById('about').addEventListener('click', () => {
    wordTitle.textContent = "About This App";
    definition.textContent = "This dictionary app fetches real-time word definitions and audio pronunciation from an external API.";
});
