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
            html: '@@include("./template.html")',
            css: '@@include("./style.css")'
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
