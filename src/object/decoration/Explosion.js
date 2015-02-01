Engine.assets.decorations.Explosion = function()
{
    Engine.assets.Object.call(this);

    var model = Engine.Util.createSprite('explosions.gif', 48, 48);
    this.sprites = new Engine.SpriteManager(model, 48, 48 , 256, 256);

    var explosion = this.sprites.addSprite('explosion');
    for (var i = 1; i <= 2; i++) {
        explosion.addFrame(0,   0, .05);
        explosion.addFrame(48,  0, .05);
        explosion.addFrame(96,  0, .0333);

        explosion.addFrame(0,  48, .05);
        explosion.addFrame(48, 48, .05);
        explosion.addFrame(96, 48, .0333);

        explosion.addFrame(0,  96, .05);
        explosion.addFrame(48, 96, .05);
        explosion.addFrame(96, 96, .0333);

        explosion.addFrame(0,  144, .05);
        explosion.addFrame(48, 144, .05);
        explosion.addFrame(96, 144, .0333);
    }
    explosion.addFrame(144, 144, .05);

    this.sprites.selectSprite('explosion');

    this.damage = 50;
    this.lifetime = explosion.timeline.totalDuration;
    this.lifespan = 0;

    this.setModel(model);

    this.addCollisionZone(22)
}

Engine.assets.decorations.Explosion.prototype = Object.create(Engine.assets.Decoration.prototype);
Engine.assets.decorations.Explosion.constructor = Engine.assets.decorations.Explosion;

Engine.assets.decorations.Explosion.prototype.collides = function(withObject, ourZone, theirZone)
{
    if (withObject.health) {
        withObject.health.reduce(this.damage);
    }
}

Engine.assets.decorations.Explosion.prototype.timeShift = function(dt)
{
    if (this.lifespan > this.lifetime) {
        this.scene.removeObject(this);
        return;
    }

    this.sprites.timeShift(dt);

    Engine.assets.Decoration.prototype.timeShift.call(this, dt);

    this.lifespan += dt;
}