import confetti from "canvas-confetti";

export const fireConfetti = () => {
  confetti({
    particleCount: 160,
    spread: 80,
    startVelocity: 40,
    origin: { y: 0 }, // top
  });

  confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 35,
    origin: { x: 0, y: 0.4 },
  });

  confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 35,
    origin: { x: 1, y: 0.4 },
  });
};
