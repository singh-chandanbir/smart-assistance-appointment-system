const speakText = (text) => {
  return new Promise((resolve) => {
    if (!text) return resolve();

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    // Resolve promise when speech ends
    utterance.onend = resolve;
    synth.speak(utterance);
  });
};

export { speakText };
