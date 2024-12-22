class OnlineGame {
  constructor(
    gameId,
    setTurn,
    setSelectedFlags,
    setIncorrectAnswer,
    hasInitialized
  ) {
    this.socket = new WebSocket(`ws://localhost:8080/ws/game/${gameId}`);
    this.isOnline = !!gameId;
    this.hasInitialized = hasInitialized;
    this.setTurn = setTurn;
    this.setSelectedFlags = setSelectedFlags;
    this.setIncorrectAnswer = setIncorrectAnswer;
  }

  setTurn(playerTurn) {
    this.setTurn(playerTurn);
  }

  handleOpponentsAnswer() {}

  handleCorrectAnswer(player, { name, iso_2 }, answerArr, cell) {
    this.setSelectedFlags(player, { name, iso_2 }, answerArr, cell);
  }

  handleIncorrectAnswer(player, flag, cell) {
    this.setIncorrectAnswer({
      player,
      flag,
      cell
    });
  }

  quitGame() {
    this.socket?.close();
  }
}

export const initGame = (
  gameId,
  setTurn,
  setSelectedFlags,
  setIncorrectAnswer
) => {
  return new OnlineGame(
    gameId,
    setTurn,
    setSelectedFlags,
    setIncorrectAnswer,
    true
  );
};
