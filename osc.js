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

        this.playOscMidiNote = function (midiNote, when) {
            var freqValue = Note.prototype.midi2Freq(midiNote);
            this.osc.frequency.setValueAtTime(freqValue, when);
            this.gain.gain.setValueAtTime(1, when);
        }

        this.playOsc = function (when) {
            this.gain.gain.value = 1;
            this.playing = true;
        }
        this.stopOsc = function (when) {
            if (!when) {
                this.gain.gain.value = 0;
                this.playing = false;
            }
            else {
                this.gain.gain.setValueAtTime(0, when);
            }
        }

        this.osc = this.context.createOscillator();
        this.gain = this.context.createGainNode();

        this.stopOsc();
        this.changeOsc();

        this.osc.connect (this.gain);
        this.gain.connect(this.audioDestination);
        this.osc.start(0);

        // Event stuff
        var domEl = args.div;

        this.go_button = domEl.getElementsByClassName("flat-button")[0];
        this.go_button.addEventListener("click",function(e) {
            console.log ("Clicked play button", e.target.id);
            if (!this.playing) {
                console.log ("Starting oscillator");
                this.playOsc();
                e.target.innerHTML = "Stop";
            }
            else {
                console.log ("Stopping oscillator");
                this.stopOsc();
                e.target.innerHTML = "Play";
            }
        }.bind(this));

        this.osc_select = domEl.getElementsByTagName("select")[0];
        this.osc_select.addEventListener("change",function(e) {
            console.log ("Changed value of dropdown", e.target.value);
            var type = e.target.value.toLowerCase();
            this.status.type = type;
            this.changeOsc();
        }.bind(this));


        this.inputHandler = function(e) {
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

        this.main_input = domEl.getElementsByClassName("freq-field")[0];
        this.main_input.addEventListener("blur", this.inputHandler);
        this.main_input.addEventListener("keypress", function (e) {
            if(event.keyCode == 13) {
                this.inputHandler(e);
            }
        }.bind(this));

        this.lock_chk = domEl.getElementsByClassName("lock_checkbox")[0];
        this.lock_chk.addEventListener("change",function(e) {
            console.log ("Lock set:", e.target.checked);
            this.status.lock = e.target.checked;
            if (this.status.lock) {
                this.main_input.value = this.note.name;
            }
            else {
                this.main_input.value = this.note.frequency.toFixed(3);
            }
        }.bind(this));

        this.onMIDIMessage = function (message, when) {
            if (message.type === 'noteon') {
                console.log ("noteon", message, when);
                this.playOscMidiNote (message.pitch, when);
            }
            if (message.type === 'noteoff') {
                console.log ("noteoff", message, when);
                //this.stopOsc (when);
            }
        }.bind(this);

        args.MIDIHandler.setMIDICallback (this.onMIDIMessage);

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
