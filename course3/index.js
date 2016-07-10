var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('sky', 'assets/sky.png');
  game.load.image('star', 'assets/star.png');
  game.load.image('firstaid', 'assets/firstaid.png');
  game.load.image('diamond', 'assets/diamond.png');
  game.load.image('platform', 'assets/platform.png');

  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

  game.load.audio('jump', 'assets/jump.wav');
}

var platforms;
var stars;
var platforms;
var diamonds;
var timer;
var player;
var score = 0;
var scoreText;
var cursors;
var jump_sound;
function create() {
	//game.physics.startSystem(Phaser.Physics.ARCADE);

  //背景的构建
  game.add.sprite(0, 0, 'sky');
	platforms = game.add.group();
  platforms.enableBody = true;
  var ground = platforms.create(0, game.world.height - 64, 'platform');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;

//创建下落的物体
	createObjects();
	timer = game.time.events.loop(8000, createObjects, this);//计时器

	//创建能够控制的玩家
  player = game.add.sprite(200, game.world.height - 100, 'dude');
	//game.physics.startSystem(Phaser.Physics.ARCADE);
	//game.physics.arcade.enable(player);

	cursors= game.input.keyboard.createCursorKeys();
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  scoreText = game.add.text(16,16,'score:0', {fontSize:'32px', fill:'#fff'});
  //jump_sound = game.add.audio('jump');

}

function update() {
	animationsPlayer();



	game.physics.overlap(player, stars, collectObjects, null, this);
 	game.physics.overlap(player, diamonds, collectObjects, null, this);
 	game.physics.overlap(player, firstaids, collectObjects, null, this);
}

function collectObjects(player, ob){
	ob.kill();

	score += 10;
	scoreText.content = 'Score:'+ score;
}

function createObjects(){
	stars = game.add.group();
	stars.enableBody = true;
	for(var i = 0; i< 12; i++){
    var star = stars.create(i*70, Math.random()*100+Math.random()*100, 'star');
    star.body.gravity.y = (Math.random()*10)*5;
  }

	diamonds = game.add.group();
  diamonds.enableBody = true;
  firstaids = game.add.group();
  firstaids.enableBody = true;

	if(Math.random() < 0.33){
    var diamond = diamonds.create(Math.random()*200+Math.random()*200, Math.random()*30+Math.random()*30, 'diamond');
    diamond.body.gravity.y = (Math.random()*10)*5;
  }else if(Math.random() < 0.66){
    var firsttaid = firsttaids.create(Math.random()*30+Math.random()*30, Math.random()*200+Math.random()*200, 'firstaid');
    firsttaid.body.gravity.y = (Math.random()*10)*5;
  }else{
    var diamond = diamonds.create(Math.random()*200+Math.random()*200, Math.random()*30+Math.random()*30, 'diamond');
    diamond.body.gravity.y = (Math.random()*10)*5;

    var firsttaid = firstaids.create(Math.random()*30+Math.random()*30, Math.random()*200+Math.random()*200, 'firstaid');
    firsttaid.body.gravity.y = (Math.random()*10)*5;
  }
}

function animationsPlayer(){
	player.body.velocity.x = 0;

	 if(cursors.left.isDown){
		 player.body.velocity.x = -450;
		 player.animations.play('left');
	 }else if(cursors.right.isDown){
		 player.body.velocity.x = 450;
		 player.animations.play('right');
	 }else{
		 player.animations.stop();
		 player.frame = 4;
	 }

	if(cursors.up.isDown && player.body.touching.down){
		 player.body.velocity.x = 350;
	 }
}

function gameOver(){
}
