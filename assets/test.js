cc.Class({
    extends: cc.Component,

    properties: {
        beatTestPrefab: cc.Prefab,
        scale: 1,
        offset: 0,
        _beatTrack : null,
        _beatStack : null,
        _startTimeStamp: null,
        _beatTrackMain: null,
        _beatStackMain: null,
    },

    onLoad: function () {
        let beatInfo = require('out');
        this._beatTrack = beatInfo.tracks[2];
        this._beatStack = [];
        let incrementTime = 0;
        for(let item of this._beatTrack){
            if(item.subtype== 'noteOn' || item.subtype == 'noteOff'){
                incrementTime += item.deltaTime;
                this._beatStack.push({event: item.subtype, id: item.noteNumber,timeStamp: incrementTime,track: 2});
            }
        }
        this._beatTrackMain = beatInfo.tracks[1];
        this._beatStackMain = [];
        let incrementTimeMain = 0;
        for(let item of this._beatTrackMain){
            if(item.subtype== 'noteOn' || item.subtype == 'noteOff'){
                incrementTimeMain += item.deltaTime;
                this._beatStackMain.push({event: item.subtype, id: item.noteNumber,timeStamp: incrementTimeMain,track: 1});
            }
        }


        this.node.on('note-on',function(e){
            let beatNode = cc.instantiate(this.beatTestPrefab);
            this.node.addChild(beatNode);
            beatNode.name = 'beatNode#' + e.detail.id;
            beatNode.getComponent('beat-script').init(e.detail);
            
        }.bind(this))

        this.node.on('note-off',function(e){
            let beatNode = this.node.getChildByName('beatNode#' + e.detail.id);
            beatNode.removeFromParent();
        }.bind(this))

        this.getComponent(cc.AudioSource).play();


        this._startTimeStamp = Date.now() + this.offset;
    },

    update: function(dt){
        let currentTimeStamp = Date.now();
        while(true){
            let item = this._beatStack.shift();
            if(!item){break;}
            if((currentTimeStamp  - this._startTimeStamp) < item.timeStamp * 1/this.scale){
                this._beatStack.unshift(item);{break;}
            }else{
                if(item.event == 'noteOn'){
                    this.node.emit('note-on',item);
                }else{
                    this.node.emit('note-off',item);
                }
            }
        }
        while(true){
            let item = this._beatStackMain.shift();
            if(!item){break;}
            if((currentTimeStamp  - this._startTimeStamp) < item.timeStamp * 1/this.scale){
                this._beatStackMain.unshift(item);{break;}
            }else{
                if(item.event == 'noteOn'){
                    this.node.emit('note-on',item);
                }else{
                    this.node.emit('note-off',item);
                }
            }
        }
    }

    
});
