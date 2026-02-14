const ITEM_MAP = [
    'fa fa-solid fa-cloud text-white',
    'fa fa-solid fa-thumbs-up text-yellow-400',
    'fa fa-solid fa-face-smile text-yellow-400',
    'fa fa-solid fa-bell text-orange-400',
    'fa fa-solid fa-eye text-purple-400',
    'fa fa-solid fa-star text-cyan-400',
    'fa fa-solid fa-heart text-red-400',
    'fa fa-solid fa-bomb text-black',
    'fa fa-solid fa-camera-retro text-gray-400',
    'fa fa-solid fa-hippo text-gray-400',
    'fa fa-solid fa-umbrella text-green-400',
    'fa fa-solid fa-ghost text-cyan-400',
    'fa fa-solid fa-fire text-orange-400',
    'fa fa-solid fa-money-bill text-green-400',
    'fa fa-solid fa-tree text-green-400',
    'fa fa-solid fa-bicycle text-purple-400',
    'fa fa-solid fa-sun text-yellow-400',
    'fa fa-solid fa-moon text-white',
];

function setupMemoryCards() {
    document.querySelectorAll(".memory-card").forEach((div) => {
        div.classList.add('w-full', 'h-full');

        let innerDiv = document.createElement('div');
        innerDiv.classList.add('card-inner', 'w-full', 'h-full', 'bg-gray-200', 'dark:bg-gray-600', 'border', 'border-gray-300', 'dark:border-white', 'rounded-[16px]');

        let backDiv = document.createElement('div');
        backDiv.classList.add('card-back', 'w-full', 'h-full', 'flex', 'justify-center', 'items-center');

        innerDiv.appendChild(backDiv);
        div.appendChild(innerDiv);
    });
}

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateRandomSequence() {
    const MEMORY_LENGTH = document.querySelectorAll('.memory-card').length;

    if (MEMORY_LENGTH % 2 !== 0) {
        alert("Erro! Não é possível fazer um jogo da memória com tamanho ímpar.");
        return;
    }

    const ICONS_QTD = Math.floor(MEMORY_LENGTH / 2); // pega com base na quantidade de divs que tem
    
    let randomIcons = [];

    for(let i = 0; i < ICONS_QTD; i++) {
        let randomNumber = Math.floor(Math.random() * (i * 2));
        randomIcons.push(ITEM_MAP[randomNumber]);
    }

    randomIcons = [...randomIcons, ...randomIcons];

    let randomSequence = shuffle(randomIcons);
    
    return randomSequence;
}

function reveal(card) {
    void card.style.offsetY;

    card.classList.add('reveal-card');
}

function conceal(card) {
    void card.style.offsetY;

    card.classList.add('conceal-card');
    setTimeout(() => {
        card.classList.remove('reveal-card');
        card.classList.remove('conceal-card');
    }, 500);
}

function initBoard() {
    localStorage.clear();

    setupMemoryCards();

    let sequence = generateRandomSequence();
    let pairCounter = 0;
    let cardQtd = sequence.length;

    const gameHandler = {
        sequence: sequence,
        onClick(event) {
            if (window.memoryMatchDebouncer) return;

            const PRESSED_BUTTON = event.target;

            if (PRESSED_BUTTON.tagName !== 'BUTTON') return;
            if (localStorage.getItem('pressed_buttons') && JSON.parse(localStorage.getItem('pressed_buttons'))[0] === PRESSED_BUTTON.id) return;
            if (PRESSED_BUTTON.parentNode?.classList.contains('reveal-card')) return;

            reveal(PRESSED_BUTTON.parentNode, PRESSED_BUTTON);

            let pressedButtons = [];
            pressedButtons.push(PRESSED_BUTTON.id);

            if (localStorage.getItem('pressed_buttons')) {
                pressedButtons.push(...JSON.parse(localStorage.getItem('pressed_buttons')).filter(value => value !== ','));
            }

            if (pressedButtons.length > 1) {
                const encontrouPar = sequence[parseInt(pressedButtons[0], 10)] === sequence[parseInt(pressedButtons[1], 10)];

                if (encontrouPar === false) {
                    const cardsToHide = [...pressedButtons];

                    setTimeout(() => {
                        cardsToHide.forEach(id => {
                            const card = document.getElementById(`${id}`).parentNode;

                            if (!card) return;

                            conceal(card);
                        });
                    }, 1000);
                }
                else {
                    const cardsToReveal = [...pressedButtons];

                    cardsToReveal.forEach(id => {
                        const card = document.getElementById(`${id}`).parentNode;

                        if (!card) return;

                        reveal(card);
                    });

                    pairCounter++;
                }

                localStorage.removeItem('pressed_buttons');
                pressedButtons = [];
            }

            if (pairCounter >= Math.floor(cardQtd / 2)) {
                alert('Você ganhou! Parabéns!');

                const memoryMatch = document.querySelector('#memory-match-board');

                memoryMatch?.removeEventListener('click', gameHandler.onClick);
                document.querySelectorAll('.memory-card').forEach(div => div.innerHTML = '');                
                initBoard();
            }

            localStorage.setItem('pressed_buttons', JSON.stringify(pressedButtons));
        }
    }

    document.querySelector('#memory-match-board')?.addEventListener('click', gameHandler.onClick);

    document.querySelectorAll(".memory-card").forEach((div, index) => {
        let buttonElement = document.createElement('button');
        buttonElement.id = index;
        buttonElement.className = 'w-full h-full absolute inset-[0]';

        let iElement = document.createElement('i');
        iElement.className = sequence[index];

        div.querySelector('.card-inner')?.appendChild(buttonElement);
        div.querySelector('.card-back')?.appendChild(iElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initBoard();
});