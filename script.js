class MemoryCardGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.gameActive = true;
        this.canClick = true;
        
        this.gameBoard = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('score');
        this.pairsFoundDisplay = document.getElementById('pairs-found');
        this.gameStatusDisplay = document.getElementById('game-status');
        
        this.initGame();
        this.setupEventListeners();
    }

    initGame() {
        // Data kartu dengan pasangan angka (1-8, masing-masing muncul 2 kali)
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
        
        // Shuffle kartu
        this.cards = this.shuffleArray(numbers).map((number, index) => ({
            id: index,
            number: number,
            isFlipped: false,
            isMatched: false
        }));

        this.renderBoard();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        
        this.cards.forEach(card => {
            const cardElement = document.createElement('button');
            cardElement.className = 'card';
            
            if (card.isFlipped || card.isMatched) {
                cardElement.classList.add('flipped');
                cardElement.textContent = card.number;
            }
            
            if (card.isMatched) {
                cardElement.classList.add('matched');
            }
            
            cardElement.addEventListener('click', () => this.flipCard(card, cardElement));
            this.gameBoard.appendChild(cardElement);
        });
    }

    flipCard(card, cardElement) {
        // Cek apakah permainan masih aktif dan kartu dapat diklik
        if (!this.canClick || card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
            return;
        }

        // Flip kartu
        card.isFlipped = true;
        cardElement.classList.add('flipped');
        cardElement.textContent = card.number;
        
        this.flippedCards.push({ card, cardElement });

        // Jika sudah 2 kartu dibuka, cek apakah cocok
        if (this.flippedCards.length === 2) {
            this.canClick = false;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [first, second] = this.flippedCards;

        if (first.card.number === second.card.number) {
            // Kartu cocok
            this.handleMatch(first, second);
        } else {
            // Kartu tidak cocok, tutup kembali setelah 1 detik
            setTimeout(() => this.handleMismatch(first, second), 1000);
        }
    }

    handleMatch(first, second) {
        // Tandai kartu sebagai matched
        first.card.isMatched = true;
        second.card.isMatched = true;

        // Update tampilan kartu
        first.cardElement.classList.add('matched');
        second.cardElement.classList.add('matched');

        // Update skor dan pasangan ditemukan
        this.score += 10;
        this.matchedPairs++;

        this.scoreDisplay.textContent = this.score;
        this.pairsFoundDisplay.textContent = this.matchedPairs;

        this.gameStatusDisplay.textContent = '✓ Pasangan cocok!';
        this.gameStatusDisplay.classList.remove('error');

        // Reset flipped cards
        this.flippedCards = [];
        this.canClick = true;

        // Cek apakah permainan selesai
        if (this.matchedPairs === 8) {
            this.endGame();
        }
    }

    handleMismatch(first, second) {
        // Tutup kartu
        first.card.isFlipped = false;
        second.card.isFlipped = false;

        first.cardElement.classList.remove('flipped');
        second.cardElement.classList.remove('flipped');
        first.cardElement.textContent = '';
        second.cardElement.textContent = '';

        this.gameStatusDisplay.textContent = '✗ Tidak cocok, coba lagi!';
        this.gameStatusDisplay.classList.add('error');

        // Reset flipped cards
        this.flippedCards = [];
        this.canClick = true;
    }

    endGame() {
        this.gameActive = false;
        this.canClick = false;
        
        setTimeout(() => {
            this.gameStatusDisplay.textContent = `🎉 Selesai! Total Skor: ${this.score}`;
            this.gameStatusDisplay.classList.remove('error');
        }, 500);
    }

    resetGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.gameActive = true;
        this.canClick = true;
        
        this.scoreDisplay.textContent = '0';
        this.pairsFoundDisplay.textContent = '0';
        this.gameStatusDisplay.textContent = '';
        this.gameStatusDisplay.classList.remove('error');
        
        this.initGame();
    }

    setupEventListeners() {
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });
    }
}

// Inisialisasi permainan ketika DOM siap
document.addEventListener('DOMContentLoaded', () => {
    new MemoryCardGame();
});
