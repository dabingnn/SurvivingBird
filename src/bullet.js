/**
 * Created by guanghui on 12/7/14.
 */

Bullet = cc.Node.extend({
   sprite_ : null,
   bird_ : null,
   ctor : function(){
       this._super();

       this.sprite_ = new cc.Sprite(res.bullet_png);
       this.sprite_.setPosition(cc.p(-10,-10));
       this.addChild(this.sprite_);
   },
   update : function(dt){
       //collision
       if(this.bird_ != null){

           var bulletRect = this.sprite_.getBoundingBox();
           var birdRect = this.bird_.getSprite().getBoundingBox();
           if(cc.rectIntersectsRect(bulletRect, birdRect)){
               this.sprite_.setVisible(false);
               this.bird_.hurt(1.0);
           }
       }

   },

    shoot : function(){
        var targetPos = this.bird_.getSprite().getPosition();
        var bulletPos = this.sprite_.getPosition();

        var destionPos = cc.pSub(targetPos, bulletPos);
        destionPos = cc.pNormalize(destionPos);


        var time =  2000 / 960;
        this.sprite_.setVisible(true);

        var self = this;
        var callback = function(){
            self.sprite_.setVisible(false);
            self.sprite_.setPosition(cc.p(-10,-10));
        }
        var endPos = cc.pAdd(cc.pMult(destionPos, 2000),bulletPos);
        cc.log(endPos.x + " " + endPos.y);
        this.sprite_.runAction(cc.sequence(cc.moveTo(time, endPos), cc.callFunc(callback)));

    }


});