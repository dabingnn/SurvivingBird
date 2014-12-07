/**
 * Created by guanghui on 12/6/14.
 */

var ACTIVE_DURATION=3;
var INACTIVE_DURATION_MAX=[15, 25, 40, 60];
var INACTIVE_DURATION_MIN=[5, 15, 25, 40];
PickItemType = { RICE : 1, WORM : 2};

var PickItem = cc.Node.extend({
    sprite_ : null,
    active_ : true,
    activeInterval_ : 0,
    inativeInterval_ : 0,
    type_ : PickItemType.RICE,
    healValue_ : 1,
    ctor : function(dt, type){
        this._super();
        this.type_ = type;
        if(this.type_ == PickItemType.RICE)
        {
            this.sprite_ = new cc.Sprite(res.item1_png);
        }
        else
        {
            this.sprite_ = new cc.Sprite(res.item2_png);
        }
        //this.sprite_.setScale(0.6);
        this.sprite_.setPosition(cc.winSize.width/2, cc.winSize.height/1.5);
        this.addChild(this.sprite_);

        //this.inActivate();
        this.active_ = false;
        this.activeInterval_ = 0;
        this.sprite_.setVisible(false);
        this.inativeInterval_ = dt;

    },
    getHealValue : function(){
        return this.healValue_;
    },
    randomPosition : function(){
        var spriteContentSize = this.sprite_.getContentSize();
        var randomX = cc.random0To1() * (cc.winSize.width - spriteContentSize.width) + spriteContentSize.width/2;
        var randomY = cc.random0To1() * (cc.winSize.height - spriteContentSize.height - 20) + spriteContentSize.height/2 + 20;
        this.sprite_.setPosition(randomX, randomY);
    },
    update : function(dt){
       if(this.active_){
           this.activeInterval_ +=dt;
           if(this.activeInterval_ > ACTIVE_DURATION){
               if(this.type_ == PickItemType.RICE)  this.inActivate();
           }
       }else{
            var birdLevel = this.getParent().bird_.level_;
           this.inativeInterval_ += dt;
           var randomTime = (cc.random0To1() * (INACTIVE_DURATION_MAX[birdLevel - 1] - INACTIVE_DURATION_MIN[birdLevel -1 ])) + INACTIVE_DURATION_MIN[birdLevel - 1];
           if(this.inativeInterval_ >= randomTime){
               this.randomPosition();
               this.activate();
           }
       }
    },

    inActivate : function(){
        var item = this;
        var callback = function() { 
          item.sprite_.setVisible(false);
        }
        var action = cc.sequence(cc.scaleTo(0.3,0), cc.callFunc(callback));
        this.active_ = false; 
        this.activeInterval_= -0.3;
        this.inativeInterval_= -0.3;
        this.sprite_.runAction(action);

    },

    activate : function(){
        var item = this;
        var callback = function() { 
          item.active_ = true; 
        }
        //var action = cc.sequence(cc.show(), cc.scaleTo(1,1), cc.callFunc(callback));
        var action = cc.sequence(cc.scaleTo(1,0.6), cc.callFunc(callback));
        this.sprite_.setVisible(true);
        this.sprite_.setScale(0);
        this.activeInterval_ = -1;
        this.inativeInterval_ = -1;
        this.sprite_.runAction(action);
        // this.active_ = true;
        // this.setVisible(true);
        // this.activeInterval_=0;
        // this.inativeInterval_=0;
    },

    isActive : function(){
        return this.active_;
    },

    getSprite : function(){
        return this.sprite_;
    }

});