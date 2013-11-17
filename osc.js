define(['require', 'github:janesconference/nu.js/nu','./template.html!text', './style.css!text'], function(require, Note, htmlTemp, cssTemp) {

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

        this.note = new Note({frequency:440});

        this.status = {
            type: "sine",
            frequency: 440,
            detune: 0,
            lock: false
        }

        this.playing = false;

        this.changeOsc = function () {
            console.log (this.osc, this.status);
            if (this.osc.frequency !== this.status.frequency) {
                this.osc.frequency.value = this.status.frequency;
            }
            console.log (this.osc.type, this.status.type);
            if (this.osc.type !== this.status.type) {
                this.osc.type = this.oscType[this.status.type];
            }
        }

        this.osc = this.context.createOscillator();
        this.changeOsc();
        this.osc.connect (this.audioDestination);

        var domEl = args.div;

        var go_button = domEl.getElementsByClassName("flat-button")[0];
        go_button.addEventListener("click",function(e) {
            console.log ("Clicked play button", e.target.id);
            if (!this.playing) {
                console.log ("Starting oscillator");
                this.osc.start(0);
                this.playing = true;
                e.target.innerHTML = "Stop";
            }
            else {
                console.log ("Stopping oscillator");
                this.osc.stop(0);
                this.playing = false;
                this.osc.disconnect();
                this.osc = this.context.createOscillator();
                this.changeOsc();
                this.osc.connect (this.audioDestination);
                e.target.innerHTML = "Play";
            }
        }.bind(this));

        var osc_select = domEl.getElementsByTagName("select")[0];
        osc_select.addEventListener("change",function(e) {
            console.log ("Changed value of dropdown", e.target.value);
            var type = e.target.value.toLowerCase();
            this.status.type = type;
            this.changeOsc();
        }.bind(this));


        var inputHandler = function(e) {
            console.log ("We have input:", e.target.value);
            if (this.status.lock) {
                this.note.setName(e.target.value);
                console.log (this.note);
                e.target.value = this.note.name;
                this.status.frequency = this.note.frequency;
                this.changeOsc();
            }
            else {
                var f = parseFloat (e.target.value);
                if (isNaN(f)) {
                    f = this.note.frequency;
                }
                else {
                    this.note.setFrequency (f);
                    this.status.frequency = f;
                    this.changeOsc();
                }
                e.target.value = f.toFixed(3);
            }
        }.bind(this);

        var main_input = domEl.getElementsByClassName("freq-field")[0];
        main_input.addEventListener("blur", inputHandler);

        var lock_chk = domEl.getElementsByClassName("lock_checkbox")[0];
        lock_chk.addEventListener("change",function(e) {
            console.log ("Lock set:", e.target.checked);
            this.status.lock = e.target.checked;
            if (this.status.lock) {
                main_input.value = this.note.name;
            }
            else {
                main_input.value = this.note.frequency.toFixed(3);
            }
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
