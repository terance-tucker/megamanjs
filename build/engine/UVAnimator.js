Engine.UVAnimator = function(geometry)
{
    if (geometry instanceof THREE.Geometry === false) {
        throw new Error('Invalid geometry');
    }

    var self = this;
    var timer;
    var index = 0;
    self.frames = [];

    self.addFrame = function(uvMap, duration)
    {
        self.frames.push({
            'uvMap': uvMap,
            'duration': duration
        });
    }

    self.pause = function()
    {
        clearTimeout(timer);
    }

    self.play = function()
    {
        clearTimeout(timer);
        self.update();
        timer = setTimeout(self.play, self.frames[index].duration * 1000);
        isPlaying = true;
        self.step(1);
    }

    self.step = function(steps)
    {
        index = (index + steps) % self.frames.length;
    }

    self.stop = function()
    {
        self.pause();
        index = 0;
    }

    self.update = function(frame)
    {
        geometry.faceVertexUvs[0] = self.frames[index].uvMap;
        geometry.uvsNeedUpdate = true;
    }
}