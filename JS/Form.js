class Form {
  constructor(lobbyID) {
    this.input = createInput("Enter your name");
    this.button = createButton("Play");
    this.greeting = createElement("h2");
    this.reset = createButton("Reset");
    this.rules = createElement("h4");
    this.lobbyID = lobbyID;
    this.totalGamesText = createElement("h4");

    // Add custom classes for styling
    this.input.class("form-input");
    this.button.class("form-button play-button");
    this.reset.class("form-button reset-button");
    this.greeting.class("form-greeting");
    this.rules.class("form-rules");
    this.totalGamesText.class("form-total-games");
  }

  hide() {
    this.input.hide();
    this.button.hide();
    this.greeting.hide();
    this.rules.hide();
    this.totalGamesText.hide();
  }

  async view() {
    // Title Position
    this.input.position(windowWidth / 2.8, windowHeight / 3);
    this.button.position(windowWidth / 2.2, windowHeight / 2);

    // Reset Button Position
    this.reset.position(windowWidth / 1.2, 20);

    // Total Games Text
    this.totalGamesText.position(windowWidth / 1.4, windowHeight / 1.2); // Position bottom-right
    this.updateTotalGamesDisplay();

    // Button Actions
    this.button.mousePressed(() => {
      this.input.hide();
      this.button.hide();
      player.name = this.input.value();

      playerCount += 1;
      player.index = playerCount;
      player.update();
      player.updateCount(playerCount);

      this.greeting.html(
        `Welcome, <span class="player-name">${player.name}</span>! Waiting for others to join...`
      );
      this.greeting.position(windowWidth / 3, windowHeight / 3);

      this.rules.html(
        `<strong>Rules:</strong>
        <ul>
          <li>Use the <span class="highlight"> arrow keys </span> to navigate your car.</li>
          <li>Moving diagonally gives you a speed boost.</li>
          <li>Avoid obstacles like teleporters, lasers, and slow zones.</li>
          <li>Press the <span class="highlight">spacebar</span> to activate your boost.</li>
          <li>The amount of boost you have is shown by the green bar.</li>
          <li>Collect mushrooms to get more boost.</li>
          <li>Stay in this tab and wait for countdown to begin.</li>
        </ul>`
      );
      this.rules.position(windowWidth / 2.5, windowHeight / 2);
    });

    this.reset.mousePressed(() => {
      alert("The game has been reset. Please refresh the page.");
      game.updateGameState(0);
      player.updateCount(0);
      player.clearPlayerDetails();
      player.clearFinished();
      Player.finished(0);
    });
  }

  async updateTotalGamesDisplay() {
    // Get the total number of games played from the database
    const totalGamesRef = database.ref('games/totalGames');
    totalGamesRef.once("value", (snapshot) => {
      const totalGames = snapshot.val() || 0;
      this.totalGamesText.html(`Total Games Played: ${totalGames}`);
    });
  }

  static incrementTotalGames() {
    // Increment the total number of games played in the database
    const totalGamesRef = database.ref('games/totalGames');
    totalGamesRef.transaction((currentValue) => {
      return (currentValue || 0) + 1;
    });
  }
}
