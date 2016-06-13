'use strict';

Game.Loader.XML.SceneParser =
class SceneParser
extends Game.Loader.XML.Parser
{
    constructor(loader, scene)
    {
        super(loader);
        this._scene = scene;
        this._objects = {};
    }
    getScene()
    {
        if (!this._promise) {
            this._promise = this._parse();
        }
        return this._promise;
    }
    _createObject(id)
    {
        return new (this._getObject(id)).constructor;
    }
    _getObject(id)
    {
        if (this._objects[id]) {
            return this._objects[id];
        } else if (resource.has('object', id)) {
            return resource.get('object', id);
        }
        throw new Error(`Object "${id}" no defined.`);
    }
    _parseAudio(sceneNode)
    {
        const scene = this._scene;
        const nodes = this._node.querySelectorAll(':scope > audio > *');
        const tasks = [];
        for (let node, i = 0; node = nodes[i++];) {
            const id = this.getAttr(node, 'id');
            const task = this.getAudio(node).then(audio => {
                scene.audio[id] = audio;
            });
            tasks.push(task);
        }
        return Promise.all(tasks);
    }
    _parseEvents()
    {
        const node = this._node.querySelector(':scope > events');
        if (!node) {
            return Promise.resolve();
        }

        const parser = new Game.Loader.XML.EventParser(this.loader, node);
        return parser.getEvents().then(events => {
            const scene = this._scene;
            events.forEach(event => {
                scene.events.bind(event.name, event.callback);
            });
        });
    }
    _parseObjects()
    {
        const node = this._node.querySelector(':scope > objects');
        if (!node) {
            return Promise.resolve();
        }

        const parser = new Game.Loader.XML.ObjectParser(this.loader, node);
        return parser.getObjects().then(objects => {
            this._objects = objects;
        });
    }
    _parseSequences()
    {
        const sequences = {};
        const nodes = this._node.querySelectorAll(':scope > sequences > sequence');
        for (let node, i = 0; node = nodes[i]; ++i) {
            const id = this.getAttr(node, 'id');
            const sequence = this._parseSequence(node);
            sequences[id] = sequence;
        }
        this._scene.sequences = sequences;
    }
    _parseSequence(sequenceNode)
    {
        const actionParser = new Game.Loader.XML.ActionParser;
        const nodes = sequenceNode.querySelectorAll('action');
        const sequence = [];
        for (let node, i = 0; node = nodes[i]; ++i) {
            const action = actionParser.getAction(node);
            sequence.push([action]);
        }
        return sequence;
    }
}
