cc.Class({
    extends: cc.Component,

    properties: {
        radio: 100,
        _beatNumLabel: {
            get: function(){return this.node.getChildByName("beat-num").getComponent(cc.Label);}
        },
        _beatSpriteNode: {
            get: function(){return this.node.getChildByName('beat-test')}
        }
    },


    init: function (item) {
        this._beatNumLabel.string = item.id;
        this.node.position = cc.v2(cc.randomMinus1To1() * 450, cc.randomMinus1To1() * 290);
        if(item.track == 1){
            this._beatSpriteNode.color = cc.Color.RED;

        }
    },

});
