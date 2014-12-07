/**
 * Created by guanghui on 12/7/14.
 */

HumanState = { Spawn : 0, Shooting : 1};

Human = cc.Node.extend({
    sprite_ : null,
    spawnPosition_ : [ cc.p(45,88), cc.p(550,128)],
    spawnRate_ : 0,
    shootingRate_ : 0,
    state_ : HumanState.Spawn,
    bulletsArray_ : [],
    shootingCount_ : 0,
    bulletCountConfig_ : [1,2,2,3],
    bird_ : null,
    ctor : function(){
        this._super();
        this.sprite_ = new cc.Sprite(res.human_png);
        this.sprite_.setPosition(cc.p(-10,-10));
        this.addChild(this.sprite_);

        {
            this.bulletsArray_ = [];

        }

    },
    addBullet : function(bullet){
        this.addChild(bullet);
        bullet.bird_ = this.bird_;

        this.bulletsArray_.push(bullet);
    },
    updateBullet : function(dt){
        for(var i = 0; i < this.bulletsArray_.length; ++i){
            var bullet = this.bulletsArray_[i];
            bullet.update(dt);
        }
    },
    update : function(dt){
        this.updateBullet(dt);

        var bulletCount = this.bulletCountConfig_[this.bird_.level_-1];
        if(bulletCount > this.bulletsArray_.length ){
            var bullet = new Bullet();
            this.addBullet(bullet);
            cc.log("add bullets")
        }

        if(this.state_ == HumanState.Spawn){
            this.spawnRate_ += dt;
            if(this.spawnRate_ > 5){
                //determine which spawn position
                var randomPos = cc.random0To1();
                var spawnPosition;
                if(randomPos > 0.5){
                    spawnPosition = this.spawnPosition_[0];
                    this.sprite_.setFlippedX(true);
                    this.sprite_.setAnchorPoint(cc.p(0,0));
                }else{
                    spawnPosition = this.spawnPosition_[1];
                    this.sprite_.setFlippedX(false);
                    this.sprite_.setAnchorPoint(cc.p(1,1));
                }

                this.sprite_.setPosition(spawnPosition);

                this.spawnRate_ = 0;
                this.state_ = HumanState.Shooting;
            }
        }else{
            //rotate and shooting
            this.shootingRate_ += dt;
            if(this.shootingRate_ > 1){
                this.shootingRate_ = 0;


                this.shootingCount_ = this.shootingCount_ +1;

                //let bullet to shoot the bird
                if(this.shootingCount_ - 1 < this.bulletsArray_.length){
                    var bullet = this.bulletsArray_[this.shootingCount_-1];
                    bullet.sprite_.setPosition(this.sprite_.getPosition());
                    bullet.shoot();
                    cc.audioEngine.playEffect(res.bullet_ogg,false)
                }

                if(this.shootingCount_ == this.bulletsArray_.length){
                    this.shootingCount_ = 0;
                    this.state_ = HumanState.Spawn;
                }



            }

        }


    }
});