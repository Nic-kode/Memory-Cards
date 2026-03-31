import { useEffect, useState } from "react";
import { Card } from "./components/Card";
import { GameHeader } from "./components/GameHeader";

//Memory card values
const cardValues = [
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
];

//Audio
const flipSound = new Audio("/sounds/flip.mp3");
const winSound = new Audio("/sounds/win.mp3");
const pairSound = new Audio("/sounds/pair.mp3");
const backgroundMuisc = new Audio("/sounds/music.mp3");

flipSound.volume = 0.4;
winSound.volume = 0.6;

//App
function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  //Start music
  useEffect(() => {
    backgroundMuisc.loop = true;
    backgroundMuisc.volume = 0.2;

    const startMusic = () => {
      if (!isMuted) backgroundMuisc.play();
      document.removeEventListener("click", startMusic);
    };

    document.addEventListener("click", startMusic);

    return () => backgroundMuisc.pause();
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);

    if (!isMuted) {
      backgroundMuisc.pause();
    } else {
      backgroundMuisc.play();
    }
  };

  //Initialize game
  const initializeGame = () => {
    const shuffled = [...cardValues].sort(() => Math.random() - 0.5);

    const finalCards = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(finalCards);
    setScore(0);
    setMoves(0);
    setFlippedCards([]);
    setHasWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (card) => {
    flipSound.play();
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    setMoves((prev) => prev + 1);

    // Flip card
    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );

    setCards(updatedCards);

    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const first = updatedCards[newFlipped[0]];
      const second = updatedCards[newFlipped[1]];

      //If we find a match
      if (first.value === second.value) {
        setTimeout(() => {
          pairSound.play();
          const matched = updatedCards.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isMatched: true }
              : c
          );
          setScore((prev) => prev + 1);
          setCards(matched);
          setFlippedCards([]);

          // comprobar victoria
          const allMatched = matched.every((c) => c.isMatched);
          if (allMatched) {
            setHasWon(true);
            winSound.play();
          }
        }, 300);

        //If we don't
      } else {
        setTimeout(() => {
          const reset = updatedCards.map((c) =>
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          );
          setCards(reset);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="app">
      <button className="mute-btn" onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>
      <GameHeader score={score} moves={moves} />

      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>

      {hasWon && (
        <div className="modal">
          <div className="modal-content">
            <h2>🎉 Has ganado!</h2>
            <p>Lo has conseguido en {moves} movimientos</p>

            <button onClick={initializeGame}>Volver a jugar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
