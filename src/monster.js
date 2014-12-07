/**
 * Created by guanghui on 12/6/14.
 */

MonsterType = {CAT : 1, EAGLE : 2, HUMANBEING : 3}
MonsterState = {DANGEROUS : 0, FRIENDLY : 1, ATTACKING : 2}

var Monster = cc.Node.extend({
    sprite_ : null,
    type_: MonsterType.CAT,
    state_ : MonsterState.FRIENDLY,
    stateChangeDuration_: [[10, 10], [8, 10], [5, 8], [3, 5]],

    stateChangeInterval_: 0,
    spriteSize_ : null,
    winSize_ : null,
    textureName_ : "",

    getMonsterAnimate : function(){
        var animation = new cc.Animation();

        var frameComponent = "";
        if(this.type_ == MonsterType.CAT){
            frameComponent = "cat";
        }else if(this.type_ = MonsterType.EAGLE){
            frameComponent = "eagle";
        }


        for (var i = 1; i <= 2; i++) {
            var frameName = "res/images/" + frameComponent +  i + ".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        if(this.type_ == MonsterType.CAT){
            animation.setDelayPerUnit(0.2);
        }else if(this.type_ = MonsterType.EAGLE){
            animation.setDelayPerUnit(0.1);
        }
        
        animation.setRestoreOriginalFrame(true);

        var action = cc.animate(animation);

        return action.repeatForever();
    },
    playSwingAnimation : function(){
        if(this.type_ == MonsterType.EAGLE || this.type_ == MonsterType.CAT){
            var animate = this.getMonsterAnimate();
            this.sprite_.runAction(animate);
        }
    },
    initTextureName : function(){
        if(this.type_ == MonsterType.CAT){
            this.textureName_ = res.cat_png;
        }else if(this.type_ == MonsterType.EAGLE){
            this.textureName_ = res.eagle1_png;
        }else if(this.type_ == MonsterType.HUMANBEING){
            this.textureName_ = res.human_png;
        }
    },
    ctor : function(type){
        this._super();
        this.type_ = type;

        this.initTextureName();

        this.sprite_ = new cc.Sprite(this.textureName_);
        this.addChild(this.sprite_);
        this.spriteSize_ = this.sprite_.getContentSize();
        this.winSize_ = cc.winSize;
        this.initPosition();


        this.playSwingAnimation();
    },

    initPosition : function(){
        if(this.type_ == MonsterType.CAT){
            this.setPosition(this.winSize_.width - this.spriteSize_.width/2, this.spriteSize_.height/2);
        }else if(this.type_ == MonsterType.EAGLE){
            this.setPosition(this.winSize_.width - this.spriteSize_.width/2, this.winSize_.height);
        }else if(this.type_ == MonsterType.HUMANBEING){
            this.sprite_.setAnchorPoint(1,1);
            this.setPosition(this.winSize_.width, this.winSize_.height/4-40);
        }



    },

    getAttackArea : function(){
        if(this.type_ == MonsterType.CAT){
            return this.sprite_.getBoundingBox();
        }else if(this.type_ == MonsterType.EAGLE){
            var rect = cc.rect(0, 0, this.spriteSize_.width, this.spriteSize_.height);
            return cc._rectApplyAffineTransformIn(rect, this.getNodeToParentTransform());

            return rect;
        }else if(this.type_ == MonsterType.HUMANBEING){
            return new cc.Rect(0,0,0,0);
        }
    },

    switchStates : function()
    {
        this.state_ = (this.state_ == MonsterState.FRIENDLY) ? MonsterState.DANGEROUS : MonsterState.FRIENDLY;
        var bird = this.getParent().bird_;
        var birdPos = bird.getSprite().getPosition();

        var extraOffset = 0;
        if(bird.facing_ == FacingDirection.FD_Left){
            extraOffset = -40;
        }else{
            extraOffset = 40;
        }

        birdPos = cc.pAdd(birdPos,cc.p(extraOffset,-40));

        var originalPos = this.getPosition();
        var distance = cc.pDistance(birdPos, originalPos);
        var time = distance / 960;

        if(this.state_ == MonsterState.DANGEROUS)
        {

            this.sprite_.setColor(cc.color(255,0,0,255));
            if(this.type_ == MonsterType.EAGLE)
            {
                if(this.state_ != MonsterState.ATTACKING){
                    //attack
                    var attackAction = cc.moveTo(time, birdPos);
                    //fly back to top
                    var moveBack = cc.moveTo(time * 2, originalPos);
                    var self = this;
                    var callback = function(){
                        self.state_ = MonsterState.FRIENDLY;
                        self.sprite_.setColor(cc.color(255,255,255,255));
                        self.playSwingAnimation();
                    }
                    this.sprite_.stopAllActions();


                    var tempSprite = new cc.Sprite(res.eagle1_png);
                    var spriteFrame = new cc.SpriteFrame(res.eagle1_png,tempSprite.getTextureRect());
                    this.sprite_.setSpriteFrame(spriteFrame);

                    var action = cc.sequence(attackAction, cc.callFunc(callback), moveBack);
                    this.runAction(action);

                    //play attacking music
                    cc.audioEngine.playEffect(res.eagle_ogg,false);

                    this.state_ = MonsterState.ATTACKING;
                }
            }
            else if(this.type_ == MonsterType.CAT)
            {
                this.state_ = MonsterState.ATTACKING;
            }
            else
            {
                //human

            }
        }
        else
        {

            this.sprite_.setColor(cc.color(255,255,255,255));
            if(this.type_ == MonsterType.EAGLE)
            {

            }
            else if(this.type_ == MonsterType.CAT)
            {

            }
            else
            {
                //human

            }
        }
    },

    update : function(dt)
    {
        this.stateChangeInterval_ += dt;
        var birdLevel = this.getParent().bird_.level_;
        var duration = this.stateChangeDuration_[birdLevel];
        var random = cc.random0To1();
        var changeIntelval =  random * duration[1] + (1.0 - random) * duration[0];
        if(this.stateChangeInterval_ >= changeIntelval)
        {
            this.stateChangeInterval_ = 0;
            this.switchStates();
        }

        this.walk(dt);
    },

    getAttackDamage : function()
    {
      return 1;
    },

    walk : function(dt){
        var monsterPosition = this.getPosition();


        if(this.type_ == MonsterType.CAT || this.type_ == MonsterType.EAGLE){
            var moveBy = cc.moveBy(3.3, cc.p(-1 * (this.winSize_.width - this.spriteSize_.width), 0));
            var reverseMoveby = moveBy.reverse();


            if(monsterPosition.x > this.winSize_.width/2){
                if(this.getNumberOfRunningActions() == 0){
                    this.sprite_.setFlippedX(false);

                    this.runAction(moveBy);


                }
            }else{
                if(this.getNumberOfRunningActions() == 0){
                    this.sprite_.setFlippedX(true);
                    this.runAction(reverseMoveby);
                }
            }

        }
    }
})