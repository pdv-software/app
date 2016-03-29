var app = {

    basepath: path+"Modules/app/",

    include: {},
    
    loaded: {},
    initialized: {},
    
    datastore: {},
    view: {},

    load: function(appname) 
    {
        app.loaded[appname] = true;
        // We load here the html of the app into an dedicated element for that app
        // when an app is loaded its html remains in the dom even when viewing another app
        // an app is just hidden and shown depending on the visibility settings.
        
        // we check here if the app has been loaded to the dom, if not we load it
        
        var appdom = $("#app_"+appname);
        
        if (appdom.length) return true;
        
    
        var html = "";
        $.ajax({url: app.basepath+appname+"/"+appname+".html", async: false, cache: false, success: function(data) {html = data;} });
        
        $("#content").append('<div class="apps" id="app_'+appname+'" style="display:none"></div>');
        $("#app_"+appname).html(html);

        $.ajax({
            url: app.basepath+appname+"/"+appname+".js",
            dataType: 'script',
            async: false
        });
        
        // ----------------------------------------------------------
        // Included javascript loader
        // ----------------------------------------------------------
        var include = window["app_"+appname].include;
        for (i in include) {
            var file = include[i];
            if (app.include[file]==undefined)
            {
                app.include[file] = true;
                $.ajax({
                    url: path+file,
                    dataType: 'script',
                    async: false
                });
            }
        }
        
        if (app.config[appname]==undefined) app.config[appname] = {};
        
        var feeds = feed.listbyname();
        
        // Check that the config is complete first otherwise show config interface
        var configured = config_check(window["app_"+appname].config, app.config[appname], feeds);
        
        // Show dashboard if all present, configuration page if not:
        if (!configured) {
            $("#"+appname+"-setup").show();
            configUI(appname, window["app_"+appname].config, app.config[appname]);
        }
        
        if (configured && app.initialized[appname]==undefined) {
            console.log("init from load "+appname);
            $("#"+appname+"-block").show();
            window["app_"+appname].config = config_load(window["app_"+appname].config, app.config[appname], feeds);
            app.initialized[appname] = true;
            window["app_"+appname].init();
        }
        
        return true;
    },
    
    show: function(appname)
    {
        if (app.datastore[appname]!=undefined) {
            datastore = JSON.parse(JSON.stringify(app.datastore[appname]));
        }
        
        if (app.view[appname]!=undefined) { 
            view.start = app.view[appname].start;
            view.end = app.view[appname].end;
        }
        
        if (app.loaded[appname]==undefined) app.load(appname);
        $(".apps").hide();
        $("#app_"+appname).show();
        if (window["app_"+appname]!=undefined && app.initialized[appname]!=undefined) {
            window["app_"+appname].show();
        }
    },
    
    hide: function(appname)
    {
        app.datastore[appname] = JSON.parse(JSON.stringify(datastore));
        app.view[appname] = {start:view.start, end:view.end};
        
        $("#app_"+appname).hide();
        if (window["app_"+appname]!=undefined && app.initialized[appname]!=undefined) window["app_"+appname].hide();
    },
    
    getconfig: function()
    {
        var config = {};
        var apikeystr = "";
        if (window.apikey!=undefined) apikeystr = "?apikey="+apikey;
        $.ajax({ url: path+"app/getconfig.json"+apikeystr, dataType: 'json', async: false, success: function(data) {config = data;} });
        app.config = config;
    },
    
    setconfig: function(appname, appconfig)
    {
        app.config[appname] = appconfig;
        
        var feeds = feed.listbyname();
        window["app_"+appname].config = config_load(window["app_"+appname].config, app.config[appname], feeds);
        
        $.ajax({ url: path+"app/setconfig.json", data: "data="+JSON.stringify(app.config), async: false, success: function(data){} });
    }
};
