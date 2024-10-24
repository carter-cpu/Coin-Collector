
// Define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var deathMessage;
var won = false;
var isDead = false; // New variable to track if the player is dead
var currentScore = 0;
var winningScore = 100;
var health = 100; // Health variable

// Add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  // Create items at specified positions
  createItem(375, 400, 'coin');
  createItem(575, 500, 'coin');
  createItem(225, 500, 'coin');
  createItem(100, 250, 'coin');
  createItem(575, 150, 'coin');
  createItem(525, 300, 'coin');
  createItem(650, 250, 'coin');
  createItem(225, 200, 'coin');
  createItem(225, 20, 'coin');
  createItem(175, 175, 'coin');
  createItem(375, 110, 'frog');
  createItem(375, 200, 'frog');
  createItem(375, 3.6, 'frog'); 
}

// Add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  // Create platforms at specified positions
  platforms.create(450, 550, 'platform');
  platforms.create(100, 550, 'platform2');
  platforms.create(300, 450, 'platform');
  platforms.create(250, 150, 'platform2');
  platforms.create(50, 300, 'platform');
  platforms.create(150, 250, 'platform');
  platforms.create(650, 300, 'platform2');
  platforms.create(550, 200, 'platform2');
  platforms.setAll('body.immovable', true);
}

// Create a single animated item and add to the screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// Create the winning badge and add to the screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(750, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// Handle item collection
function itemHandler(player, item) {
  if (isDead) return; // Prevent item collection if dead

  item.kill();
  if (item.key === 'coin') {
    currentScore += 10; // Increase score for coins
  } else if (item.key === 'frog') {
    health -= 100; // Reduce health for frogs
    if (health <= 0) {
      health = 0;
      isDead = true; // Mark player as dead
    }
  } else if (item.key === 'star') {
    currentScore += 20; // Increase score for stars
  }
  
  if (currentScore >= winningScore) {
    createBadge(); // Create badge when score reaches winning score
  }
}

// Handle badge collection
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// Setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

  // Preload assets
  function preload() {
    game.stage.backgroundColor = '#5db1ad';
    game.load.image('platform', 'platform_1.png');
    game.load.image('platform2', 'platform_2.png');
    game.load.spritesheet('player', 'mikethefrog.png',32,32);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('frog', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'star.png', 32, 32);
  }

  // Initial game setup
  function create() {
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore + " | HEALTH: " + health, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
    deathMessage = game.add.text(game.world.centerX, game.world.centerY, "", { font: "bold 48px Arial", fill: "red" });
    deathMessage.anchor.setTo(0.5, 1);
    deathMessage.visible = false; // Initially hidden
  }

  // Game update loop
  function update() {
    if (isDead) {
      deathMessage.text = "MORE LOST THAN JACK "; // Show death message
      deathMessage.visible = true; // Make death message visible
      return; // Stop the update function if dead
    }

    text.text = "SCORE: " + currentScore + " | HEALTH: " + health;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // Player movement
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = -1;
    } else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    } else {
      player.animations.stop();
    }

    // Jumping
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }

    // Winning message
    if (won) {
      winningMessage.text = "YOU WIN!!!"; // Change the winning message
    }
  }

  function render() {
    // Optional: Rendering debug info
  }
};
