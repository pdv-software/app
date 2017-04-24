
var app_energymeter = {

    config: {
        "use":{"type":"feed", "autoname":_Tr("use"), "engine":0, "description":_Tr("House or building use in watts"), "unit":"W"},
        "use_kwh":{"type":"feed", "autoname":_Tr("use_kwh"), "engine":0, "description":_Tr("Cumulative use in kWh"), "unit":"kWh"},
        "unitcost":{"type":"value", "default":0.15, "name": _Tr("Unit cost"), "description":_Tr("Unit cost of electricity")},
        "currency":{"type":"value", "default":_Tr("£"), "name": _Tr("Currency"), "description":_Tr("Currency symbol (€,£,$...)")}
    },
    
    daily_data: [],
    daily: [],
    
    raw_kwh_data: [],
    
    fastupdateinst: false,
    slowupdateinst: false,
    
    viewmode: "energy",
    
    startofweek: [0,0],
    startofmonth: [0,0],
    startofyear: [0,0],
    startofday: 0,
    startalltime: 0,
    
    last_daytime:0,                 // used for reload kwhd daily graph
    last_startofweektime: 0,        // used for reloading statistics
    last_startofmonthtime: 0,
    last_startofyeartime: 0,
    
    lastupdate: 0, 
    autoupdate: true,
    reload: true,
    feeds: {},
    
    kwhdtmp: [],
    
    // Include required javascript libraries
    include: [
        "Modules/app/lib/graph_bars.js",
        "Modules/app/lib/graph_lines.js",
        "Modules/app/lib/timeseries.js",
        "Modules/app/vis.helper.js"
    ],

    init: function()
    {   
        app.log("INFO","energymeter init");
    
        var timewindow = (3600000*3.0*1);
        view.end = +new Date;
        view.start = view.end - timewindow;

        // -------------------------------------------------------------------------
        // Decleration of energymeter events
        // -------------------------------------------------------------------------
        
        $("#energymeter_zoomout").click(function () {view.zoomout(); app_energymeter.reload = true; app_energymeter.autoupdate = false; app_energymeter.fastupdate();});
        $("#energymeter_zoomin").click(function () {view.zoomin(); app_energymeter.reload = true; app_energymeter.autoupdate = false; app_energymeter.fastupdate();});
        $('#energymeter_right').click(function () {view.panright(); app_energymeter.reload = true; app_energymeter.autoupdate = false; app_energymeter.fastupdate();});
        $('#energymeter_left').click(function () {view.panleft(); app_energymeter.reload = true; app_energymeter.autoupdate = false; app_energymeter.fastupdate();});
        
        $('.energymeter-time').click(function () {
            view.timewindow($(this).attr("time")/24.0); 
            app_energymeter.reload = true; 
            app_energymeter.autoupdate = true;
            app_energymeter.fastupdate();
        });
        
        $(".energymeter-view-cost").click(function(){
            app_energymeter.viewmode = "cost";
            app_energymeter.fastupdate();
            app_energymeter.slowupdate();
        });
        
        $(".energymeter-view-kwh").click(function(){
            app_energymeter.viewmode = "energy";
            app_energymeter.fastupdate();
            app_energymeter.slowupdate();
        });
    },
    
    show: function()
    {   
        app.log("INFO","energymeter show");
        // start of all time
        var meta = {};
        $.ajax({                                      
            url: path+"feed/getmeta.json",                         
            data: "id="+app_energymeter.config.use_kwh.value+apikeystr,
            dataType: 'json',
            async: false,                      
            success: function(data_in) { meta = data_in; } 
        });
        app_energymeter.startalltime = meta.start_time;
        view.first_data = meta.start_time * 1000;
        
        app_energymeter.reloadkwhd = true;
        
        // resize and start updaters
        app_energymeter.resize();
        // called from withing resize:
        // app_energymeter.fastupdate();
        // app_energymeter.slowupdate();
        app_energymeter.fastupdateinst = setInterval(app_energymeter.fastupdate,5000);
        app_energymeter.slowupdateinst = setInterval(app_energymeter.slowupdate,60000);
    },
    
    resize: function() 
    {
        app.log("INFO","energymeter resize");
        
        var windowheight = $(window).height();
        
        bound = {};
        
        var width = $("#energymeter_placeholder_bound_kwhd").width();
        $("#energymeter_placeholder_kwhd").attr('width',width);
        graph_bars.width = width;
        
        var height = $("#energymeter_placeholder_bound_kwhd").height();
        $("#energymeter_placeholder_kwhd").attr('height',height); 
        graph_bars.height = height;
        
        var width = $("#energymeter_placeholder_bound_power").width();
        $("#energymeter_placeholder_power").attr('width',width);
        graph_lines.width = width;
        
        var height = $("#energymeter_placeholder_bound_power").height();
        $("#energymeter_placeholder_power").attr('height',height); 
        graph_lines.height = height;
        
        
        if (width<=500) {
            $(".electric-title").css("font-size","16px");
            $(".power-value").css("font-size","38px");
            $(".power-value").css("padding-top","12px");
            $(".power-value").css("padding-bottom","8px");
            $(".midtext").css("font-size","14px");
            $(".units").hide();
            $(".visnav").css("padding-left","5px");
            $(".visnav").css("padding-right","5px");
        } else if (width<=724) {
            $(".electric-title").css("font-size","18px");
            $(".power-value").css("font-size","52px");
            $(".power-value").css("padding-top","22px");
            $(".power-value").css("padding-bottom","12px");
            $(".midtext").css("font-size","18px");
            $(".units").show();
            $(".visnav").css("padding-left","8px");
            $(".visnav").css("padding-right","8px");
        } else {
            $(".electric-title").css("font-size","22px");
            $(".power-value").css("font-size","85px");
            $(".power-value").css("padding-top","40px");
            $(".power-value").css("padding-bottom","20px");
            $(".midtext").css("font-size","20px");
            $(".units").show();
            $(".visnav").css("padding-left","8px");
            $(".visnav").css("padding-right","8px");
        }
        
        app_energymeter.reloadkwhd = true;
        app_energymeter.fastupdate();
        app_energymeter.slowupdate();
    },
    
    hide: function()
    {
        clearInterval(this.fastupdateinst);
        clearInterval(this.slowupdateinst);
    },
    
    fastupdate: function()
    {
       var use = app_energymeter.config.use.value;
       var use_kwh = app_energymeter.config.use_kwh.value;
    
        if (app_energymeter.viewmode=="energy") {
            scale = 1;
            $("#energymeter_usetoday_units_a").html("");
            $("#energymeter_usetoday_units_b").html(" "+_Tr("kWh"));
            $(".u1a").html(""); $(".u1b").html(_Tr("kWh"));
            $(".u2a").html(""); $(".u2b").html(" "+_Tr("kWh/d"));
        } else {
            scale = app_energymeter.config.unitcost.value;
            $("#energymeter_usetoday_units_a").html(app_energymeter.config.currency.value);
            $("#energymeter_usetoday_units_b").html("");
            $(".u1a").html(app_energymeter.config.currency.value); $(".u1b").html("");
            $(".u2a").html(app_energymeter.config.currency.value); $(".u2b").html(_Tr("/day"));
        }
        
        var now = new Date();
        var timenow = now.getTime();
        
        // --------------------------------------------------------------------------------------------------------
        // REALTIME POWER GRAPH
        // -------------------------------------------------------------------------------------------------------- 
        // Check if the updater ran in the last 60s if it did not the app was sleeping
        // and so the data needs a full reload.
        
        if ((timenow-app_energymeter.lastupdate)>60000) {
            app_energymeter.reload = true;
            var timewindow = view.end - view.start;
            view.end = timenow;
            view.start = view.end - timewindow;
        }
        
        app_energymeter.lastupdate = timenow;
        
        // reload power data
        if (app_energymeter.reload) {
            app_energymeter.reload = false;
            
            var npoints = 1500;
            interval = Math.round(((view.end - view.start)/npoints)/1000);
            if (interval<1) interval = 1;
            
            view.start = 1000*Math.floor((view.start/1000)/interval)*interval;
            view.end   = 1000*Math.ceil ((view.end  /1000)/interval)*interval;
            
            timeseries.load("use",feed.getdata(use,view.start,view.end,interval,0,0));
        }
        
        // --------------------------------------------------------------------
        // 1) Get last value of feeds
        // --------------------------------------------------------------------
        var feeds = feed.listbyid();
        app_energymeter.feeds = feeds;
        
        // set the power now value
        if (app_energymeter.viewmode=="energy") {
            $("#energymeter_powernow").html((feeds[use].value*1).toFixed(0)+"W");
        } else {
            // 1000W for an hour (x3600) = 3600000 Joules / 3600,000 = 1.0 kWh x 0.15p = 0.15p/kWh (scaling factor is x3600 / 3600,000 = 0.001)
            $("#energymeter_powernow").html(app_energymeter.config.currency.value+(feeds[use].value*1*app_energymeter.config.unitcost.value*0.001).toFixed(3)+_Tr("/hr"));
        }
        // Advance view
        if (app_energymeter.autoupdate) {

            // move the view along
            var timerange = view.end - view.start;
            view.end = timenow;
            view.start = view.end - timerange;
            
            timeseries.append(
                "use", 
                feeds[use].time, 
                feeds[use].value
            );
            
            // delete data that is now beyond the start of our view
            timeseries.trim_start("use",view.start*0.001);
        }
        
        // draw power graph
        var options = {
            axes: {
                color: "rgba(6,153,250,1.0)",
                font: "12px arial"
            },
            
            xaxis: {
                minor_tick: 60000*10,
                major_tick: 60000*60
            },
            
            yaxis: {
                title: _Tr("Power (Watts)"),
                units: _Tr("W"),
                minor_tick: 250,
                major_tick: 1000
            }
        };
        
        var timewindowhours = Math.round((view.end-view.start)/3600000);
        options.xaxis.major_tick = 30*24*3600*1000;
        if (timewindowhours<=24*7) options.xaxis.major_tick = 24*3600*1000;
        if (timewindowhours<=24) options.xaxis.major_tick = 2*3600*1000;
        if (timewindowhours<=12) options.xaxis.major_tick = 1*3600*1000;
        options.xaxis.minor_tick = options.xaxis.major_tick / 4;
        
        
        var series = {
            "solar": {
                color: "rgba(255,255,255,1.0)",
                data: []
            },
            "use": {
                color: "rgba(6,153,250,0.5)",
                data: timeseries.data("use")
            }
        };
        
        graph_lines.draw("energymeter_placeholder_power",series,options);
        $(".ajax-loader").hide();

        // --------------------------------------------------------------------------------------------------------
        // THIS WEEK, MONTH, YEAR TOTALS
        // --------------------------------------------------------------------------------------------------------
        // All time total
        var alltime_kwh = feeds[use_kwh].value;
        // -------------------------------------------------------------------------------------------------------- 
        // WEEK: Get the time of the start of the week, if we have rolled over to a new week, load the watt hour
        // value in the watt accumulator feed recorded for the start of this week. (scale is unitcost)
        var dayofweek = now.getDay();
        if (dayofweek>0) dayofweek -= 1; else dayofweek = 6;

        var time = new Date(now.getFullYear(),now.getMonth(),now.getDate()-dayofweek).getTime();
        if (time!=app_energymeter.last_startofweektime) {
            app_energymeter.startofweek = feed.getvalue(use_kwh,time);
            app_energymeter.last_startofweektime = time;
        }
        if (app_energymeter.startofweek===false) app_energymeter.startofweek = [app_energymeter.startalltime*1000,0];
        
        // Week total
        var week_kwh = alltime_kwh - (app_energymeter.startofweek[1]);
        $("#energymeter_week_kwh").html((scale*week_kwh).toFixed(1));
        var days = ((feeds[use_kwh].time - (app_energymeter.startofweek[0]*0.001))/86400);
        $("#energymeter_week_kwhd").html((scale*week_kwh/days).toFixed(1));
        // --------------------------------------------------------------------------------------------------------       
        // MONTH: repeat same process as above (scale is unitcost)
        var time = new Date(now.getFullYear(),now.getMonth(),1).getTime();
        if (time!=app_energymeter.last_startofmonthtime) {
            app_energymeter.startofmonth = feed.getvalue(use_kwh,time);
            app_energymeter.last_startofmonthtime = time;
        }
        if (app_energymeter.startofmonth===false) app_energymeter.startofmonth = [app_energymeter.startalltime*1000,0];
        
        // Monthly total
        var month_kwh = alltime_kwh - (app_energymeter.startofmonth[1]);
        $("#energymeter_month_kwh").html(Math.round(scale*month_kwh));
        var days = ((feeds[use_kwh].time - (app_energymeter.startofmonth[0]*0.001))/86400);
        $("#energymeter_month_kwhd").html((scale*month_kwh/days).toFixed(1));
        // -------------------------------------------------------------------------------------------------------- 
        // YEAR: repeat same process as above (scale is unitcost)
        var time = new Date(now.getFullYear(),0,1).getTime();
        if (time!=app_energymeter.last_startofyeartime) {
            app_energymeter.startofyear = feed.getvalue(use_kwh,time);
            app_energymeter.last_startofyeartime = time;
        }
        if (app_energymeter.startofyear===false) app_energymeter.startofyear = [app_energymeter.startalltime*1000,0];     
        
        // Year total
        var year_kwh = alltime_kwh - (app_energymeter.startofyear[1]);
        $("#energymeter_year_kwh").html(Math.round(scale*year_kwh));
        var days = ((feeds[use_kwh].time - (app_energymeter.startofyear[0]*0.001))/86400);
        $("#energymeter_year_kwhd").html((scale*year_kwh/days).toFixed(1));
        // -------------------------------------------------------------------------------------------------------- 
        // ALL TIME (scale is unitcost)
        $("#energymeter_alltime_kwh").html(Math.round(scale*alltime_kwh));
        var days = ((feeds[use_kwh].time - app_energymeter.startalltime)/86400);
        $("#energymeter_alltime_kwhd").html((scale*alltime_kwh/days).toFixed(1));
        // --------------------------------------------------------------------------------------------------------        
    },
    
    slowupdate: function()
    {
       var use = app_energymeter.config.use.value;
       var use_kwh = app_energymeter.config.use_kwh.value;
       
        // When we make a request for daily data it returns the data up to the start of this day. 
        // This works appart from a request made just after the start of day and before the buffered 
        // data is written to disk. This produces an error as the day rolls over.

        // Most of the time the request will return data where the last datapoint is the start of the
        // current day. If the start of the current day is less than 60s (the buffer time)  from the 
        // current day then the last datapoint will be the previous day start.

        // The easy solution is to request the data every 60s and then always append the last kwh value 
        // from feeds to the end as a new day, with the interval one day ahead of the last day in the kwh feed.

        // This presents a minor error for 60s after midnight but should not be noticable in most cases 
        // and will correct itself after the 60s is over.
        
        var interval = 86400;
        var now = new Date();
        var end = Math.floor(now.getTime() * 0.001);
        var start = end - interval * Math.round(graph_bars.width/30);
        
				var result = feed.getdata(use_kwh,start*1000,end*1000,interval,1,1);

        var data = [];
        // remove nan values from the end.
        for (z in result) {
          if (result[z][1]!=null) {
            data.push(result[z]);
          }
        }
        
        app_energymeter.daily = [];
        
        if (data.length>0) {
            var lastday = data[data.length-1][0];
            
            var d = new Date();
            d.setHours(0,0,0,0);
            if (lastday==d.getTime()) {
                // last day in kwh data matches start of today from the browser's perspective
                // which means its safe to append today kwh value
                var next = data[data.length-1][0] + (interval*1000);
                if (app_energymeter.feeds[use_kwh]!=undefined) {
                    data.push([next,app_energymeter.feeds[use_kwh].value*1.0]);
                }
            }
        
            // Calculate the daily totals by subtracting each day from the day before
            
            for (var z=1; z<data.length; z++)
            {
              var time = data[z-1][0];
              var diff = (data[z][1]-data[z-1][1]);
              app_energymeter.daily.push([time,diff*scale]);
            }
        }
        
        var usetoday_kwh = 0;
        if (app_energymeter.daily.length>0) {
            usetoday_kwh = app_energymeter.daily[app_energymeter.daily.length-1][1];
        }
        $("#energymeter_usetoday").html((usetoday_kwh).toFixed(1));

        graph_bars.draw('energymeter_placeholder_kwhd',[app_energymeter.daily]);
        $(".ajax-loader").hide();
    }
};
