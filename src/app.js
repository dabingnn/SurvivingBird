

var HelloWorldLayer = cc.Layer.extend({
    bird_ : null,
//    stabs_ : [],
    pickItems_: [],
    gameTime_ : 0,
    gameTimeLabel_ : null,
    isGameStart_ : false,
    lifeSpriteArray_ : [],
    monsters_ : [],
    uiSprite_ : null,
    human_ : null,
    initHUD : function(){
        var winSize = cc.winSize;


        this.gameTimeLabel_ = new cc.LabelTTF("0","Arial",20);
        var labelSize = this.gameTimeLabel_.getContentSize();
        var gameTimeLabelPosition = new cc.Point(winSize.width - labelSize.width * 2,
            winSize.height - labelSize.height/2);
        this.gameTimeLabel_.setPosition(gameTimeLabelPosition.x, gameTimeLabelPosition.y);
        this.addChild(this.gameTimeLabel_,1000);


        var timeIndicatorLabel = new cc.LabelTTF("Time:", "Arial",20);
        var timeIndicatorLabelSize = timeIndicatorLabel.getContentSize();
        timeIndicatorLabel.setPosition(gameTimeLabelPosition.x - timeIndicatorLabelSize.width/2 - 20, gameTimeLabelPosition.y);
        this.addChild(timeIndicatorLabel,1000);

        var birdHealthLabel = new cc.LabelTTF("Life:", "Arial", 20);
        var healthLabelSize = birdHealthLabel.getContentSize();
        birdHealthLabel.setPosition(healthLabelSize.width/2 + 5, winSize.height - healthLabelSize.height/2 - 5);
        this.addChild(birdHealthLabel,1000);

        var startPosition = new cc.Point(birdHealthLabel.getPosition().x + healthLabelSize.width/2 + 25,
                                birdHealthLabel.getPosition().y);
        for(var i = 0; i < 10; ++i){
            var lifeSprite = new cc.Sprite(res.item1_png);
            var lifeSpriteSize = lifeSprite.getContentSize();
            var step = lifeSpriteSize.width * 0.2 + 2;
            lifeSprite.setScale(0.4);
            lifeSprite.setPosition(startPosition.x + i * step, startPosition.y);
            this.addChild(lifeSprite);
            lifeSprite.setVisible(false);

            this.lifeSpriteArray_.push(lifeSprite);

        }

        this.uiSprite_ = new cc.Sprite(res.ui_png)
        this.uiSprite_.setAnchorPoint(cc.p(0,0));
        this.uiSprite_.setPosition(cc.p(0,0));
        this.uiSprite_.setOpacity(255);
        this.addChild(this.uiSprite_,1000);

        var self = this;
        var item1 = new cc.MenuItemImage(res.start_png, res.start_png, function(){
            self.uiSprite_.removeFromParent();
        }, this);

        var menu = new cc.Menu(item1);
        var winSize = cc.director.getWinSize();

        menu.x = winSize.width / 2;
        menu.y = 40;

        this.uiSprite_.addChild(menu);


        //display bird life
        var birdLife = this.bird_.blood_;
        for(var i = 0; i < birdLife; ++i){
            var lifeSprite = this.lifeSpriteArray_[i];
            lifeSprite.setVisible(true);
        }

    },
    startGame : function(){
       cc.audioEngine.playMusic(res.bg_mp3,true);
    },
    initGame : function(){
        var visibleRect = cc.visibleRect;

        var bgSprite = new cc.Sprite(res.background_png);
        bgSprite.setPosition(visibleRect.width/2, visibleRect.height/2);
        this.addChild(bgSprite,-1);

        var bgSprite = new cc.Sprite(res.foreground_png);
        bgSprite.setPosition(visibleRect.width/2, visibleRect.height/2);
        this.addChild(bgSprite,1);

//        //todo: add all stabs
//        var stab = new Stab();
//        this.addChild(stab);
//
//        this.stabs_.push(stab);

        //add pickItem
        var pickItemCount = 3;
        for(var i = 0; i < pickItemCount; ++i ){
            var pickItem = new PickItem(i, PickItemType.RICE);
            this.addChild(pickItem);
            this.pickItems_.push(pickItem);
        }

        var pickItem = new PickItem(0, PickItemType.WORM);
        this.addChild(pickItem);
        this.pickItems_.push(pickItem);

        this.bird_ = new Bird();
        this.addChild(this.bird_);

        //create monsters
        this.initMonsters();

        //create human
        this.human_ = new Human();
        this.human_.bird_ = this.bird_;

        var bullet = new Bullet();
        this.human_.addBullet(bullet);
        this.addChild(this.human_,2);


        //create HUD
        this.initHUD();

        this.addTouchHandling();


        cc.audioEngine.playMusic(res.bg_ogg,true);
        cc.audioEngine.setMusicVolume(0.4)

    },
    initMonsters : function(){
        //add cat
        var cat = new Monster(MonsterType.CAT);
        this.addChild(cat);

        this.monsters_.push(cat);

        // //add monkey
        // var monkey = new Monster(MonsterType.MONKEY);
        // this.addChild(monkey);

        // this.monsters_.push(monkey);

        //add eagle
        var eagle = new Monster(MonsterType.EAGLE);
        this.addChild(eagle);
        this.monsters_.push(eagle);
    },
    addTouchHandling : function(){
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: null,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    onTouchBegan : function(touch, event){
        return true;
    },
    onTouchEnded : function(touch, event){
        var target = event.getCurrentTarget();

        target.bird_.tap();
        target.isGameStart_ = true;

    },

    addKeyboard : function(){
        var that = this;
        if( 'keyboard' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
//                onKeyPressed:function(key, event) {
//                    cc.log("Key down:" + key);
//                },
                onKeyReleased:function(key, event) {
                    //32 is space key
                    if(key == 32){
                        that.bird_.tap();
                        that.isGameStart_ = true;
                    }
                }
            }, this);
        } else {
            cc.log("KEYBOARD Not supported");
        }
    },
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        {
            this.pickItems_ = [];
            this.gameTime_ = 0;
            this.gameTimeLabel_ = null;
            this.isGameStart_ = false;
            this.lifeSpriteArray_ = [];
            this.monsters_ = [];
            this.uiSprite_ = null;
        }

        this.initGame();

        this.addKeyboard();

        this.scheduleUpdate();


        return true;
    },

    checkBirdCollision : function(dt){
        var pos = this.bird_.getSprite().getPosition();
        var birdBounds = this.bird_.getSprite().getContentSize();
        var boundSize = cc.winSize;

        if(pos.x >= boundSize.width - birdBounds.width/2){
            this.bird_.changeFacing();
            this.bird_.getSprite().setPosition(boundSize.width - birdBounds.width/2, pos.y);
        }
        if(pos.x  <= birdBounds.width/2){
            this.bird_.changeFacing();
            this.bird_.getSprite().setPosition(birdBounds.width/2, pos.y);
        }

        var birdBoundingBox = this.bird_.getSprite().getBoundingBox();


//        //check bird and stab collision
//        for (var i = 0; i < this.stabs_.length; ++i){
//            var stab = this.stabs_[i];
//            var stabBoundingBox = stab.getBoundingBox();
//            if(cc.rectIntersectsRect(stabBoundingBox,birdBoundingBox)){
//                this.bird_.hurt(1.0);
//            }
//
//        }

        //check bird and pickItem collision
        for(var i = 0; i < this.pickItems_.length; ++i){
            var item = this.pickItems_[i];
            var itemBB = item.getSprite().getBoundingBox();
            if(item.isActive() &&cc.rectIntersectsRect(itemBB,birdBoundingBox)){
                if(item.type_ == PickItemType.RICE){
                    this.bird_.heal(item.getHealValue());
                }else if(item.type_ == PickItemType.WORM){
                    this.bird_.powerup();
                }
                cc.audioEngine.playEffect(res.pickcoin_ogg,false);
                item.inActivate();
            }
        }

        //check bird and monster collision
        for(var i = 0; i < this.monsters_.length; ++i)
        {
            var monster = this.monsters_[i];
            var monsterBB = monster.getAttackArea();
            if(cc.rectIntersectsRect(monsterBB, birdBoundingBox) && monster.state_ == MonsterState.ATTACKING)
            {
                this.bird_.hurt(monster.getAttackDamage());
            }
        }

    },
    updateTimerHUD : function(dt){
        this.gameTime_ += dt;

        this.gameTimeLabel_.setString(Math.round(this.gameTime_));
    },
    updateHUD : function(dt){
        for(var i = 0; i < 10; ++i){
            var lifeSprite = this.lifeSpriteArray_[i];
            lifeSprite.setVisible(false);
        }

        //display bird life
        var birdLife = this.bird_.blood_;
        for(var i = 0; i < birdLife; ++i){
            var lifeSprite = this.lifeSpriteArray_[i];
            lifeSprite.setVisible(true);
        }
    },

    updateMonster : function(dt){
        for(var i = 0; i < this.monsters_.length; ++i){
            this.monsters_[i].update(dt);
        }
    },

    update : function(dt){
        this.updateHUD(dt);


        if(!this.isGameStart_){
            return;
        }


        if(this.bird_.isDead_){
            //cc.log("game over");
            this.scheduleOnce(function(){
                var gameOverSprite = new cc.Sprite(res.gameover_png);
                gameOverSprite.setAnchorPoint(cc.p(0,0));
                gameOverSprite.setPosition(cc.p(0,0));
                this.addChild(gameOverSprite,1000);


                //add score
                var highscoreLabel = new cc.LabelTTF(Math.round(this.gameTime_), "Arial", 60);
                highscoreLabel.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height - 60 * 2));
                gameOverSprite.addChild(highscoreLabel);

                var self = this;
                var item1 = new cc.MenuItemImage(res.replay_png, res.replay_png, function(){
                    cc.director.runScene(new HelloWorldScene());
                }, this);

                var menu = new cc.Menu(item1);
                var winSize = cc.director.getWinSize();

                menu.x = winSize.width / 2;
                menu.y = 40 * 2;

                gameOverSprite.addChild(menu);

            },1.0);

            this.unscheduleUpdate();

            return;
        }
        this.updateMonster(dt);

        this.updateTimerHUD(dt);
        this.human_.update(dt);


        for(var i = 0; i < this.pickItems_.length; ++i){
            this.pickItems_[i].update(dt);
        }



        this.checkBirdCollision(dt);

        this.bird_.update(dt);


    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

