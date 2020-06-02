// DOM's elements : 
const startButton = document.querySelector('.start-button');
const startSignal = document.querySelector('.start-signal');
const leftScreen = document.querySelector('.light-left-screen');
const rightScreen = document.querySelector('.light-right-screen');
const frontImage = document.querySelector('.front-image');
const backImage = document.querySelector('.back-image');
const typeOne = document.querySelector('.type-one');
const typeTwo = document.querySelector('.type-two');
const weight = document.querySelector('.weight');
const height = document.querySelector('.height');
const pokemonName = document.querySelector('.pokemon-name');
const pokedexNumber = document.querySelector('.pokedex-number');
const infoButton = document.querySelector('.info');
const infoScreen = document.querySelector('.info-screen');
const returnButton = document.querySelector('.return-button');
const description = document.querySelector('.description');
const listPokemon = document.querySelectorAll('.list-poke');
const previousButton = document.querySelector('.previous-button');
const nextButton = document.querySelector('.next-button');
const baseStat = document.querySelectorAll('.base-stat');

// Variables : 
let id = 1;
let url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=15";
let previousUrl = '';
let nextUrl = '';

// Functions : 
const startPokedex = () => {
    event.preventDefault();

    if(leftScreen.classList.contains('hide') && infoScreen.classList.contains('hide')) {
        startSignal.setAttribute('id', 'signal-on');
        leftScreen.classList.remove('hide');
        rightScreen.classList.remove('hide');
    } else {
        startSignal.removeAttribute('id');
        leftScreen.classList.add('hide');
        rightScreen.classList.add('hide');
        infoScreen.classList.add('hide');
    } 
} 

const displayInfo = () => {
    leftScreen.classList.add('hide');
    infoScreen.classList.remove('hide');
}

const previousScreen = () => {
    leftScreen.classList.remove('hide');
    infoScreen.classList.add('hide');
}

const displayLeftScreen = (event) => {
    const lineValue = event.target.textContent;
    const getId = lineValue.split('.');
    id = getId[0];
    getPokemonInfo(id);
}

const previousView = () => {
    if(previousUrl) {
        displayPokemonList(previousUrl);
    }
}

const nextView = () => {
    if(nextUrl) {
        displayPokemonList(nextUrl);
    }
}

// Function calling API : 
const getPokemonInfo = (id) => {

    if(leftScreen.classList.contains('hide')) {
        leftScreen.classList.remove('hide');
        infoScreen.classList.add('hide')
    }

    fetch("https://pokeapi.co/api/v2/pokemon/" + id)
        .then(response => response.json())
        .then(data => {
            backImage.src = data['sprites']['back_default'];
            frontImage.src = data['sprites']['front_default'];
            height.textContent = "Taille: " + (data['height'] * 10) + "cm";
            weight.textContent = "Poids: " +(data['weight']/10) + "kg";
            
            for(let i = 0; i < 6; i++){
                baseStat[i].textContent = data['stats'][i]['base_stat'];
            }

            if(data['id'] < 10) {
                var index = "#00";
            } else {
                if(data['id'] < 100) {
                    var index = "#0";
                } else {
                    var index = "#";
                }
            }
        
            pokedexNumber.textContent = index + data['id'].toString();
            const typeOneUrl = data['types'][0]['type']['url'];
            // typeOne.textContent = data['types'][0]['type']['name'];
            typeOne.removeAttribute('id');
            typeOne.setAttribute('id', data['types'][0]['type']['name']);
            
            fetch(typeOneUrl)
                .then(response => response.json())
                .then(data => {
                    typeOne.textContent = data['names'][2]['name'];
                });

            if(data['types'][1]){
                const typeTwoUrl = data['types'][1]['type']['url'];
                //typeTwo.textContent = data['types'][1]['type']['name'];
                typeTwo.classList.remove('hide');
                typeTwo.removeAttribute('id');
                typeTwo.setAttribute('id', data['types'][1]['type']['name']);
                fetch(typeTwoUrl)
                    .then(response => response.json())
                    .then(data => {
                        typeTwo.textContent = data['names'][2]['name'];
                    });
            } else {
                typeTwo.classList.add('hide');
            }
            
            var url = data['species']['url'];

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    pokemonName.textContent = data['names'][6]['name'];
                    const descriptionArray = data['flavor_text_entries'];
                    
                    if(descriptionArray[5]['language']['name'] == "fr") {
                        frIndex = 5;
                    } else {
                        frIndex = 6;
                    }
                    description.textContent = '"' + data['flavor_text_entries'][frIndex]['flavor_text'] + '"';
                });
        });
}

const displayPokemonList = (url) => {
    
    if(url == "https://pokeapi.co/api/v2/pokemon?offset=150&limit=15") {
        fetch("https://pokeapi.co/api/v2/pokemon-species/151")
        .then(response => response.json())
        .then(data => {
            const name = data['names'][6]['name'];
            const id = data['id'].toString() + ". ";
            listPokemon[0].textContent = id + name; 
            for(let i = 1; i < 15; i++) {
                listPokemon[i].textContent = '';
            }
            nextUrl = null;
            previousUrl = "https://pokeapi.co/api/v2/pokemon?offset=135&limit=15"
        });
    } else {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < 15; i++) {
                previousUrl = data['previous'];
                nextUrl = data['next'];
                
                const englishName = data['results'][i]['name'];

                fetch("https://pokeapi.co/api/v2/pokemon-species/" + englishName)
                    .then(response => response.json())
                    .then(data => {
                        const nameArray = data['names'][6]['name'];
                        const id = data['id'].toString() + ". ";
                        listPokemon[i].textContent = id + nameArray;   
                    });
            }
        });
    }
}

// Events :
startButton.addEventListener('click', startPokedex);
infoButton.addEventListener('click', displayInfo);
returnButton.addEventListener('click', previousScreen);
previousButton.addEventListener('click', previousView);
nextButton.addEventListener('click', nextView);
for(const pokemon of listPokemon) {
    pokemon.addEventListener('click', displayLeftScreen);
}

// Initialization :
displayPokemonList(url);
getPokemonInfo(id);
leftScreen.classList.add('hide');
