define(['require'], function(require) {
  
    var pluginConf = {
        name: "Oscillator",
        osc: false,
        audioOut: 1,
        version: '0.0.1-alpha1',
        ui: {
            type: 'div',
            width: 410,
            height: 136,
            html: '<div class="osc-container"><div class="dropdown-osc"><select><option>Square</option><option selected="selected">Saw</option><option>Triangle</option><option>Sine</option></select></div><div class="frequency-input"><input></div><div class="go-button"><a href="#" class="flat-button flat-button-2">Play</a></div><div class="chk-container"><div class="flatRoundedCheckbox"><input type="checkbox" value="1" id="flatOneRoundedCheckbox" name=""><label for="flatOneRoundedCheckbox"></label><div></div></div></div><div class="osc-label">Oscillator type</div><div class="osc-freq">Note</div><div class="lock-label">Lock</div></div>',
            css: '.osc-container{background:#000}.dropdown-osc select{background:0 0;color:#f5f5f5;width:120px;padding:5px;font-size:16px;border:1px solid #353535;height:34px;-webkit-appearance:none}.dropdown-osc{top:80px;left:28px;position:absolute;width:120px;height:34px;overflow:hidden;background-color:#202020}.frequency-input{top:19px;left:28px;position:absolute}.frequency-input input{width:80px;height:34px;font-size:16px;text-align:center}.go-button{top:37px;left:308px;position:absolute}.flat-button{height:34px;width:88px;padding-top:22px;font-size:14px;line-height:100%;display:inline-block;vertical-align:middle;text-align:center;cursor:pointer;font-weight:700;transition:background .1s ease-in-out;-webkit-transition:background .1s ease-in-out;-moz-transition:background .1s ease-in-out;-ms-transition:background .1s ease-in-out;-o-transition:background .1s ease-in-out;text-shadow:0 1px rgba(0,0,0,.3);-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;font-family:"Helvetica Neue",Helvetica,sans-serif}.flat-button:active{padding-top:23px;margin-bottom:-1px}.flat-button,.flat-button:active,.flat-button:hover{outline:0 none;text-decoration:none;color:#fff}.flat-button-2{background-color:#f06060;box-shadow:0 3px 0 0 #cd1313}.flat-button-2:hover{background-color:#ed4444}.flat-button-2:active{box-shadow:0 1px 0 0 #cd1313}.flatRoundedCheckbox{width:40px;height:22px;position:relative}.flatRoundedCheckbox div{width:100%;height:100%;background:#d3d3d3;border-radius:50px;position:relative;top:-20px}.flatRoundedCheckbox label{display:block;width:20px;height:20px;border-radius:20px;-webkit-transition:all .5s ease;-moz-transition:all .5s ease;-o-transition:all .5s ease;-ms-transition:all .5s ease;transition:all .5s ease;cursor:pointer;position:absolute;top:0;z-index:1;left:0;background:#FFF}.flatRoundedCheckbox input[type=checkbox]:checked~div{background:#4fbe79}.flatRoundedCheckbox input[type=checkbox]:checked~label{left:20px}.chk-container{top:29px;left:180px;position:absolute}.osc-label{top:98px;left:164px;position:absolute;color:#fff;font-family:"Helvetica Neue",Helvetica,sans-serif;font-weight:700;font-size:14px}.osc-freq{top:29px;left:126px;position:absolute;color:#fff;font-family:"Helvetica Neue",Helvetica,sans-serif;font-weight:700;font-size:14px}.lock-label{top:30px;left:230px;position:absolute;color:#fff;font-family:"Helvetica Neue",Helvetica,sans-serif;font-weight:700;font-size:14px}'
        }
    };

    var pluginFunction = function(args, resources) {
        
        this.name = args.name;
        this.id = args.id;
        this.audioDestination = args.audioDestinations[0];
        this.context = args.audioContext;
        
        var domEl = args.div;

        var style = resources[0];
        var html = resources[1];

        domEl.innerHTML = html;

        var go_button = domEl.getElementsByClassName("flat-button")[0];
        go_button.addEventListener("click",function(e) {
            console.log ("Clicked button", e.target.id);
        });

        // Initialization made it so far: plugin is ready.
        args.hostInterface.setInstanceStatus ('ready');
    };
    
    
    var initPlugin = function(initArgs) {
        var args = initArgs;
          
        // TODO *DON'T* USE CSS HERE IN PRODUCTION      
        var resList = [ './style.css!css',
                        './template.html!text'
                      ];

        console.log ("requiring...");

        var requireErr = function (err) {
            args.hostInterface.setInstanceStatus ('fatal', {description: 'Error loading resources'});
        }.bind(this);

        require (resList,
            function () {
                console.log ("required...");
                pluginFunction.call (this, args, arguments);
            }.bind(this),
            function (err) {
                console.log ("require error");
                requireErr (err);
            }
        );
    };
        
    return {
        initPlugin: initPlugin,
        pluginConf: pluginConf
    };
});
