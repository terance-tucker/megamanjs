Game.objects.characters.ChangkeyMaker = function()
{
    Game.objects.Character.call(this);

    this.fire = false;
    this.fireCoolDown = 2;
    this.fireLoop = 0;
    this.fireWait = 0;
    this.flickerLoop = 0;
    this.flickerIntensity = .25;
    this.flickerDelay = .05;

    var glow = new Game.traits.Glow();
    glow.addLamp(new THREE.PointLight(0xff5400, 2, 256));
    this.glow = this.applyTrait(glow);
}

Engine.Util.extend(Game.objects.characters.ChangkeyMaker,
                   Game.objects.Character);

Game.objects.characters.ChangkeyMaker.prototype.routeAnimation = function()
{
    if (this.fireWait < 1) {
        return 'throw';
    }
    return 'idle';
}

Game.objects.characters.ChangkeyMaker.prototype.updateAI = function(dt)
{
    if (this.ai.findPlayer() && this.ai.target.position.distanceTo(this.position) < 300) {
        if (this.fireLoop === undefined) {
            this.fireLoop = 0;
        }
    }
    else {
        this.fireLoop = undefined;
    }
}

Game.objects.characters.ChangkeyMaker.prototype.timeShift = function(dt)
{
    this.updateAI(dt);

    if (this.fireLoop !== undefined) {
        this.fireLoop += dt;
        this.fireWait -= dt;
        if (this.fireWait <= 0) {
            //this.fire();
            this.fireWait = this.fireCoolDown;
        }
    }
    else {
        this.fireWait = Infinity;
    }

    Game.objects.Character.prototype.timeShift.call(this, dt);

    this.flickerLoop += dt;
    if (this.flickerLoop > this.flickerDelay) {
        this.flickerLoop = 0;
        var lamps = this.glow.lamps;
        for (var i = 0, l = lamps.length; i !== l; ++i) {
            lamps[i].light.intensity = lamps[i].intensity + (this.flickerIntensity * Math.random());
        }
        this.flickerIntensity = -this.flickerIntensity;
    }
}