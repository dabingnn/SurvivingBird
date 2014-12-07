/**
 * Created by guanghui on 12/6/14.
 */

var Stab = cc.Node.extend({
    sprite_ : null,
    ctor : function(){
        this._super();


        this.sprite_ = new cc.Sprite(res.stab_png);
        this.sprite_.setPosition(0,-10);
        this.addChild(this.sprite_);
    },
    getSprite : function(){
        return this.sprite_;
    },
    getBoundingBox : function(){
        return this.sprite_.getBoundingBox();
    }
})