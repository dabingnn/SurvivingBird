/**
 * Created by guanghui on 12/6/14.
 */

FacingDirection = { FD_Left : 1, FD_Right : 2}
var HURTING_INTERVAL = 1;
var HIT_TOP_BOUNCING = -20;
var FALLING_GRAVITY = -1000;
var JUMP_POWER = 533;
var BOUNCING_POWER = 220;
var MAX_LEVEL = 5;

var Bird = cc.Node.extend({
    sprite_ : null,
    facing_ : FacingDirection.FD_Right,
    isDead_ : false,
    px_ : 0,
    py_ : 0,
    accelerationY_ : 0,
    flyAnimation_ : null,
    blood_ : 1,
    isHurting_ : true,
    hurtTime_ : 0,
    level_ : 1,
    powerup_ : 0, //used as self upgrade
    powerupConfig : [1, 2, 3, 4],
    levelMaxBlood_ : [2,3,5,7,10],
    ctor : function(){

        this._super();

        var winSize = cc.winSize;

        this.sprite_ = new cc.Sprite(res.bird11_png);
        this.sprite_.setPosition(winSize.width/2, winSize.height/2);
        this.sprite_.runAction(this.getBirdAnimate());
        this.addChild(this.sprite_);

        return true;
    },
    getBirdAnimate : function(){
        var animation = new cc.Animation();

        for (var i = 1; i <= 2; i++) {
            var frameName = "res/images/bird" + this.level_ +  i + ".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(0.1);
        animation.setRestoreOriginalFrame(true);

        var action = cc.animate(animation);

        return action.repeatForever();
    },
    selfUpgrade : function(){
        this.level_ = this.level_ + 1;
        if(this.level_ >= MAX_LEVEL){
            this.level_ = MAX_LEVEL;
        }
        this.maxBlood_ = this.levelMaxBlood_[this.level_-1];
    },

    update : function(dt){
        if(this.isDead_){
            cc.log("dead")
            return;
        }

        if(!this.isHurting_){
            this.hurtTime_ += dt;
            if(this.hurtTime_ > HURTING_INTERVAL){
                this.isHurting_ = true;
                this.hurtTime_ = 0;
            }
        }

        this.py_ += this.accelerationY_ * dt;
        var pt = this.sprite_.getPosition();
        pt.x += this.px_ * dt;
        pt.y += this.py_ * dt;

        //don't let bird fall out of screen
        var halfHeight = this.sprite_.getContentSize().height/2;
        if(pt.y  <= halfHeight ){
            pt.y = halfHeight;
            //todo: add audio
            this.hurt(1.0);
        }

        //don't let bird jump out of screen
        if(pt.y >= cc.winSize.height - halfHeight){
            this.py_ = HIT_TOP_BOUNCING;
            pt.y = cc.winSize.height - halfHeight;
        }

        this.sprite_.setPosition(pt);
    },

    tap : function(){
        if(this.accelerationY_ == 0){
            this.accelerationY_ = FALLING_GRAVITY;
            this.px_ = BOUNCING_POWER;
        }

        this.py_ = JUMP_POWER;
        cc.audioEngine.playEffect(res.jump_ogg,false);
    },

    collideWithWall : function(){
        //todo add audio
    },

    flipVelocityX : function(){
        this.px_ *= -1;
        if(this.facing_ == FacingDirection.FD_Right){
            this.sprite_.setFlippedX(false);
        }else{
            this.sprite_.setFlippedX(true);
        }
    },

    changeFacing : function(){
        if(this.facing_ == FacingDirection.FD_Left){
            this.facing_ = FacingDirection.FD_Right;
        }else{
            this.facing_ = FacingDirection.FD_Left;
        }
        this.flipVelocityX();
    },

    die : function(){
        this.isDead_ = true;
        cc.audioEngine.playEffect(res.die_ogg,false)
    },

    hurt : function(factor){
        if(this.isHurting_){
            this.blood_ = this.blood_ - factor;
            this.isHurting_ = false;
            cc.log("hurt")
            if(this.blood_ <= 0){
                this.die();
            }
        }

    },

    heal : function(factor){
        var maxBlood = this.levelMaxBlood_[this.level_ - 1];
        this.blood_ += factor;
        if(this.blood_ >= maxBlood){
            this.blood_ = maxBlood;
        }
    },

    powerup : function(){
        this.powerup_ += 1;
        var levelup = this.powerupConfig[this.level_ - 1];
        if(this.powerup_ == levelup){
            this.powerup_ = 0;
            this.level_ += 1;
            if(this.level_ <=4)
            {
                var flip = this.sprite_.isFlippedX();
                var position = this.sprite_.getPosition();
                this.removeChild(this.sprite_);
                this.sprite_ = new cc.Sprite(res.bird11_png);
                this.sprite_.setPosition(position);
                this.sprite_.setFlippedX(flip);
                this.sprite_.runAction(this.getBirdAnimate());
                this.addChild(this.sprite_);
            }
            else
            {
                this.level_ = 4;
            }
        }

    },

    reset : function(){
        this.isDead_ = false;
        this.px_ = 0;
        this.py_ = 0;
        this.accelerationY_ = 0;
        this.facing_ = FacingDirection.FD_Right;
        this.sprite_.setFlippedX(false);
    },
    getSprite : function(){
        return this.sprite_;
    },

    playAnimation : function(){
        //todo
    },

    getVelocityX : function(){
      return this.px_;
    },

    setVelocity : function(vx){
        this.px_ = vx;
    },
})