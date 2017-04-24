function configUI (appname, config, appconfig) {
    $(".app-config").html("");
 
    // Remove old config items that are no longer used/described in new config definition
    if (appconfig.constructor===Array) appconfig = {};
    
    for (var z in appconfig) {
        if (config[z]==undefined) delete appconfig[z];
    }

    var feeds = {};
    $.ajax({                                      
        url: path+"feed/list.json",
        dataType: 'json',
        async: false,                      
        success: function(result) {
            for (z in result) feeds[result[z].id] = result[z];
        } 
    });

    // Draw the config interface from the config object:
    var out = "";
    for (var z in config) {
        out += "<div class='appconfig-box' key="+z+">";
        if (config[z].type=="feed") {
            out += "<i class='status icon-ok-sign icon-white'></i> <b class='feedname' key="+z+">"+config[z].autoname+" <span style='color:#ccc; font-size:12px'>[AUTO]</span></b><i class='appconfig-edit icon-pencil icon-white' style='float:right; cursor:pointer'></i>";
            out += "<br><span class='appconfig-info'></span>";
            out += "<div class='feed-select-div input-append'><select class='feed-select'></select><button class='btn feed-select-ok'>"+_Tr("ok")+"</button></div>";
        } else if (config[z].type=="value") {
            out += "<i class='status icon-ok-sign icon-white'></i> <b>"+config[z].name+"</b>";
            out += "<br><span class='appconfig-info'></span>";
            out += "<input class='appconfig-value' type='text' key="+z+" value="+config[z].default+" / >";
        }
        out += "</div>";
    }
    
    out += "<br><div style='text-align:center;'><button class='btn launchapp' style='padding:10px;'>"+_Tr("Launch App")+"</button></div>";
    
    $(".app-config").html(out);

    for (var z in config) {
        var configItem = $(".appconfig-box[key="+z+"]");
        
        if (config[z].type=="feed") {
            // Create list of feeds that satisfy engine requirement
            var out = "<option value=0>"+_Tr("Select")+" "+_Tr("feed")+" ["+config[z].unit+"]:</option>";
            out += "<option value=auto>AUTO SELECT</option>";
            for (var n in feeds)  {
                if ((config_engine_check(feeds[n],config[z])) && (config_unit_check(feeds[n],config[z]))) {
                    out += "<option value="+feeds[n].id+">"+feeds[n].name+" ["+feeds[n].unit+"]</option>";
                }
            }
            configItem.find(".feed-select").html(out);
            
            var feedvalid = false;
            // Check for existing configuration
            if (appconfig[z]!=undefined) {
                var feedid = appconfig[z];
                if (feeds[feedid]!=undefined && config_engine_check(feeds[feedid],config[z])) {
                    var keyappend = ""; if (z!=feeds[feedid].name) keyappend = z+": ";
                    configItem.find(".feedname").html(keyappend+feeds[feedid].name);
                    configItem.find(".feed-select").val(feedid);
                    configItem.find(".feed-select-div").hide();
                    feedvalid = true;
                } else {
                    // Invalid feedid remove from configuration
                    delete appconfig[z]; 
                }
            }
            
            // Important that this is not an else here as an invalid feedid 
            // in the section above will call delete making the item undefined again
            if (appconfig[z]==undefined) {
                // Auto match feeds that follow the naming convention
                for (var n in feeds) {
                    if (feeds[n].name==config[z].autoname && config_engine_check(feeds[n],config[z])) {
                        configItem.find(".feed-select").val("auto");
                        configItem.find(".feed-select-div").hide();
                        feedvalid = true;
                    }
                }
            }
            
            // Indicator icon to show if setup correctly or not
            if (!feedvalid) {
                configItem.find(".status").removeClass("icon-ok-sign"); 
                configItem.find(".status").addClass("icon-remove-circle");
            }
        }
        
        if (config[z].type=="value") {
            if (appconfig[z]!=undefined) configItem.find(".appconfig-value").val(appconfig[z]);
        }
        
        // Set description
        configItem.find(".appconfig-info").html(config[z].description);
    }
    
    if (config_check(config, appconfig, feeds)) {
        $(".launchapp").show();
    }

    // Brings up the feed selector if the pencil item is clicked
    $(".appconfig-edit").unbind("click");
    $(".appconfig-edit").click(function(){
        var key = $(this).parent().attr("key");
        var configItem = $(".appconfig-box[key="+key+"]");
        
        if (config[key].type=="feed") {
            configItem.find(".feed-select-div").show();
        }
    });

    $(".feed-select-ok").unbind("click");
    $(".feed-select-ok").click(function(){
        var key = $(this).parent().parent().attr("key");
        var configItem = $(".appconfig-box[key="+key+"]");
        
        var feedid = $(this).parent().find(".feed-select").val();
        
        if (feedid!="auto" && feedid!=0) {
            appconfig[key] = feedid;
            var keyappend = ""; if (key!=feeds[feedid].name) keyappend = key+": ";
            configItem.find(".feedname").html(keyappend+feeds[feedid].name);
            configItem.find(".status").addClass("icon-ok-sign"); 
            configItem.find(".status").removeClass("icon-remove-circle");
            // Save config
        }
        
        if (feedid=="auto") {
            delete appconfig[key];
            configItem.find(".feedname").html(config[key].autoname+" <span style='color:#ccc; font-size:12px'>[AUTO]</span>");
        }
        
        if (feedid!=0 ) {
            configItem.find(".feed-select-div").hide();
            
            app.setconfig(appname, appconfig);
            
//            if (config_check(config, appconfig, feeds)) {
                $(".launchapp").show();
//            } else {
//                $(".launchapp").hide();
//            }
        }
    });
    
    $(".appconfig-value").unbind("click");
    $(".appconfig-value").change(function(){
        var value = $(this).val();

        var key = $(this).parent().attr("key");
        var configItem = $(".appconfig-box[key="+key+"]");
        
        appconfig[key] = value;
        
        app.setconfig(appname, appconfig);
    });
}

function config_check(config, appconfig, feeds)
{
    var feedsbyname = {};
    for (var z in feeds) feedsbyname[feeds[z].name] = feeds[z];
    
    var valid = {};
    for (var key in config) {
        if (config[key].type=="feed") {
            if (config[key].optional!=undefined && config[key].optional) {
            
            } else {
                valid[key] = false;
                
                if (appconfig[key]==undefined) {
                    // Check if feeds match naming convention and engine
                    var autoname = config[key].autoname;
                    if (feedsbyname[autoname]!=undefined) {
                        if (config_engine_check(feedsbyname[autoname],config[key])) valid[key] = true;
                    }
                } else {
                    // Overwrite with any user set feeds if applicable
                    for (var z in feeds) {
                        // Check that the feed exists
                        // config will be shown if a previous valid feed has been deleted
                        var feedid = feeds[z].id;
                        if (appconfig[key] == feedid) {
                            if (config_engine_check(feeds[z],config[key])) valid[key] = true;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    for (var key in valid) {
        if (valid[key]==false) return false;
    }
    
    return true;
}

function config_load(config, appconfig, feeds)
{
    for (var key in config) {
        
        if (config[key].type=="feed") {
            config[key].value = false;
            
            // Check if feeds match naming convention
            var autoname = config[key].autoname;
            if (feeds[autoname]!=undefined) {
                config[key].value = feeds[autoname].id;
            }
            // Overwrite with any user set feeds if applicable
            if (app.config[appname][key]!=undefined) {
                config[key].value = appconfig[key];
            }
        }
        
        if (config[key].type=="value") {
            if (appconfig[key]!=undefined) {
                config[key].value = appconfig[key];
            } else {
                config[key].value = config[key].default;
            }
        }
    }
    
    return config;
}

function config_engine_check(feed,conf)
{
    if (isNaN(conf.engine)) {
        var engines = conf.engine.split(",");
        if (engines.length>0) {
            for (var z in engines) {
                if (feed.engine==engines[z]) return true;
            }
        }
    } else {
        if (feed.engine*1==conf.engine*1) return true;
    }

    return false;
}

function config_unit_check(feed,conf)
{
    if (conf.unit.length>0) {
			if (String(feed.unit)===String(conf.unit)) {
			  return true;
			}
    } else {
			return true;
    }
    return false;
}
