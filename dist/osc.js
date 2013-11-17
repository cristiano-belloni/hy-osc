define(['require', './template.html!text', './style.css!text'], function(require, htmlTemp, cssTemp) {
  
    var pluginConf = {
        name: "Oscillator",
        osc: false,
        audioOut: 1,
        version: '0.0.1-alpha1',
        ui: {
            type: 'div',
            width: 410,
            height: 136,
            html: htmlTemp,
            css: cssTemp
        }
    };

    var pluginFunction = function(args) {

        this.name = args.name;
        this.id = args.id;
        this.audioDestination = args.audioDestinations[0];
        this.context = args.audioContext;

        this.oscType = {sine: 0, square: 1, saw: 2, triangle: 3};

        this.status = {
            OscillatorType: "sine",
            frequency: 440,
            detune: 0,
            playing: false
        }

        this.changeOsc = function () {
            console.log (this.osc, this.status);
            if (this.osc.frequency !== this.status.frequency) {
                this.osc.frequency.value = this.status.frequency;
            }
            console.log (this.osc.type, this.status.OscillatorType);
            if (this.osc.type !== this.status.OscillatorType) {
                this.osc.type = this.oscType[this.status.OscillatorType];
            }
        }

        this.osc = this.context.createOscillator();
        this.changeOsc();
        this.osc.connect (this.audioDestination);

        var domEl = args.div;

        var go_button = domEl.getElementsByClassName("flat-button")[0];
        go_button.addEventListener("click",function(e) {
            console.log ("Clicked play button", e.target.id);
            if (!this.status.playing) {
                console.log ("Starting oscillator");
                this.osc.start(0);
                this.status.playing = true;
            }
            else {
                console.log ("Stopping oscillator");
                this.osc.stop(0);
                this.status.playing = false;
                this.osc.disconnect();
                this.osc = this.context.createOscillator();
                this.changeOsc();
                this.osc.connect (this.audioDestination);
            }
        }.bind(this));

        var osc_select = domEl.getElementsByTagName("select")[0];
        osc_select.addEventListener("change",function(e) {
            console.log ("Changed value of dropdown", e.target.value);
            var type = e.target.value.toLowerCase();
            this.status.OscillatorType = type;
            this.changeOsc();
        }.bind(this));

        var main_input = domEl.getElementsByClassName("freq-field")[0];
        main_input.addEventListener("blur",function(e) {
            console.log ("We have input:", e.target.value);
        }.bind(this));

        var lock_chk = domEl.getElementsByClassName("lock_checkbox")[0];
        lock_chk.addEventListener("change",function(e) {
            console.log ("Lock set:", e.target.checked);
        }.bind(this));

        // Initialization made it so far: plugin is ready.
        args.hostInterface.setInstanceStatus ('ready');
    };
    
    
    var initPlugin = function(initArgs) {
        var args = initArgs;
          
        pluginFunction.call (this, args);
    };
        
    return {
        initPlugin: initPlugin,
        pluginConf: pluginConf
    };
});
