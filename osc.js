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

    var pluginFunction = function(args) {
        
        this.name = args.name;
        this.id = args.id;
        this.audioDestination = args.audioDestinations[0];
        this.context = args.audioContext;
        
        var domEl = args.div;

        var go_button = domEl.getElementsByClassName("flat-button")[0];
        go_button.addEventListener("click",function(e) {
            console.log ("Clicked button", e.target.id);
        });

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
