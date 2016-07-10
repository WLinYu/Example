// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');

// Creates a new 'main' state that wil contain the game
var main_state = {

    preload: function() {
		// Function called first to load all the assets
      this.game.load.image('sky', 'assets/sky.png');
      this.game.load.image('star', 'assets/star.png');
      this.game.load.image('firstaid', 'assets/firstaid.png');
      this.game.load.image('diamond', 'assets/diamond.png');
      this.game.load.image('platform', 'assets/platform.png');

      game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

      this.game.load.audio('jump', 'assets/jump.wav');
    },

    create: function() {
    	//背景的构建
    	this.game.add.sprite(0, 0, 'sky');

      this.platforms = this.game.add.group();
    	this.platforms.enableBody = true;
    	var ground = this.platforms.create(0, game.world.height - 64, 'platform');
    	ground.scale.setTo(2, 2);



    	//ground.body.immovable = true;

      //物体下落
      this.addFirstShow();
      this.timer = this.game.time.events.loop(8000, this.addFirstShow, this);//计时器

      //创建能够控制的玩家
      //game.physics.startSystem(Phaser.Physics.ARCADE);
      this.player = game.add.sprite(180, game.world.height - 100, 'dude');
      //game.physics.arcade.enable(this.player);

      this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    	this.player.animations.add('right', [5, 6, 7, 8], 10, true);

      //this.score = 0;
      //this.scoreText = game.add.text(16,16,'score:0', {fontSize:'32px', fill:'#fff'});
      this.score = 0;
      var style = {font: "30px Arial", fill: "#000"};
      this.label_score = this.game.add.text(20, 20, "Score:0", style);

      this.cursors= game.input.keyboard.createCursorKeys();
      //this.animationsPlayer();

      this.jump_sound = this.game.add.audio('jump');
    },

    update: function() {
      this.animationsPlayer();

      game.physics.overlap(this.player, this.stars, this.collects, null, this);
      game.physics.overlap(this.player, this.diamonds, this.collects, null, this);
      game.physics.overlap(this.player, this.firstaids, this.collects, null, this);

    //  this.timer = this.game.time.events.loop(8000, this.addFirstShow, this);

    },

    animationsPlayer: function(){
      this.player.body.velocity.x = 0;

      if(this.cursors.left.isDown){
    		this.player.body.velocity.x = -400;
    		this.player.animations.play('left');
    	}else if(this.cursors.right.isDown){
    		this.player.body.velocity.x = 400;
    		this.player.animations.play('right');
    	}else{
    		this.player.animations.stop();
    		this.player.frame = 4;
    	}
    },

    addFirstShow: function(){
    	this.stars = game.add.group();
    	this.stars.enableBody = true;

      this.diamonds = game.add.group();
      this.diamonds.enableBody = true;

      this.firstaids = game.add.group();
      this.firstaids.enableBody = true;

    	for(var i = 0; i< 12; i++){
    		var star = this.stars.create(i*70, Math.random()*100*2, 'star');
    		star.body.gravity.y = (Math.random()*10)*10;
    	}

      if(Math.random() < 0.33){
        var diamond = this.diamonds.create(Math.random()*200*2, Math.random()*30*2, 'diamond');
        diamond.body.gravity.y = (Math.random()*10)*20;
      }else if(Math.random() < 0.66){
        var firsttaid = this.firsttaids.create(Math.random()*30*2, Math.random()*200*2, 'firstaid');
        firsttaid.body.gravity.y = (Math.random()*10)*20;
      }else{
        var diamond = this.diamonds.create(Math.random()*200*2, Math.random()*30*2, 'diamond');
        diamond.body.gravity.y = (Math.random()*10)*20;

        var firsttaid = this.firstaids.create(Math.random()*30*2, Math.random()*200*2, 'firstaid');
        firsttaid.body.gravity.y = (Math.random()*10)*20;
      }
    },

    collects: function(player, ob){
      ob.kill();

      //this.score += 10;
      //this.scoreText.text = 'Score:' + this.score;
      this.label_score.content = 'Score:'+this.score;
      this.score += 10;
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);
game.state.start('main');
