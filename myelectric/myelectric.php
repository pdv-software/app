<div class="container">

    <div id="myelectric-block" style="display:none">
    
        <div style="height:20px; border-bottom:1px solid #333; padding:8px;">
        
            <div style="float:left; color:#aaa">
            <span class="visnav myelectric-view-cost" ><?php echo _("Cost"); ?></span> 
            <span class="visnav myelectric-view-kwh" ><?php echo _("kWh"); ?></span>
            </div>
        
            <div style="float:right;">
                <i class="openconfig icon-wrench icon-white" style="cursor:pointer"></i>
            </div>
        </div>
        
        <table style="width:100%">
            <tr>
                <td style="border:0; width:33%">
                    <div class="electric-title"><?php echo _("POWER NOW"); ?></div>
                    <div class="power-value"><span id="myelectric_powernow"><?php echo _("-"); ?></span></div>
                </td>
                <td style="text-align:center; border:0; width:33%"></td>
                <td style="text-align:right; border:0; width:33%">
                    <div class="electric-title"><?php echo _("USE TODAY"); ?></div>
                    <div class="power-value"><span id="myelectric_usetoday_units_a"></span><span id="myelectric_usetoday">0</span><span id="myelectric_usetoday_units_b" style="font-size:16px"> <?php echo _("kWh"); ?></span></div>
                </td>
            </tr>
        </table>

        <br>

        <div class="visnavblock" style="height:28px; padding-bottom:5px;">
            <span class="visnav myelectric-time" time="1"><?php echo _("1h"); ?></span>
            <span class="visnav myelectric-time" time="8"><?php echo _("8h"); ?></span>
            <span class="visnav myelectric-time" time="24"><?php echo _("D"); ?></span>
            <span class="visnav myelectric-time" time="168"><?php echo _("W"); ?></span>
            <span class="visnav myelectric-time" time="720"><?php echo _("M"); ?></span>
            <span id="myelectric_zoomin" class="visnav" >+</span>
            <span id="myelectric_zoomout" class="visnav" >-</span>
            <span id="myelectric_left" class="visnav" >&lt;</span>
            <span id="myelectric_right" class="visnav" >&gt;</span>
        </div>
        <br>
        
        <div id="myelectric_placeholder_bound_power" style="width:100%; height:250px;">
            <canvas id="myelectric_placeholder_power"></canvas>
        </div>
        <br>
        
        <div id="myelectric_placeholder_bound_kwhd" style="width:100%; height:280px;">
            <canvas id="myelectric_placeholder_kwhd"></canvas>
        </div>
        <br>
            
        <table style="width:100%">
            <tr>
                <td class="appbox">
                    <div class="appbox-title"><?php echo _("WEEK"); ?></div>
                    <div><span class="appbox-value u1a" style="color:#0699fa"><?php echo _("£"); ?></span><span class="appbox-value" id="myelectric_week_kwh" style="color:#0699fa">---</span> <span class="units appbox-units u1b" style="color:#0779c1"><?php echo _("kWh"); ?></span></div>
                    
                    <div style="padding-top:5px; color:#0779c1" class="appbox-units" ><span class="units u2a"></span><span id="myelectric_week_kwhd">---</span><span class="units u2b"> <?php echo _("kWh/d"); ?></span></div>
                </td>
                
                <td class="appbox">
                    <div class="appbox-title"><?php echo _("MONTH"); ?></div>
                    <div><span class="appbox-value u1a" style="color:#0699fa"><?php echo _("£"); ?></span><span class="appbox-value" id="myelectric_month_kwh" style="color:#0699fa">---</span> <span class="units appbox-units u1b" style="color:#0779c1"><?php echo _("kWh"); ?></span></div>
                    
                    <div style="padding-top:5px; color:#0779c1" class="appbox-units" ><span class="units u2a"></span><span id="myelectric_month_kwhd">---</span><span class="units u2b"> <?php echo _("kWh/d"); ?></span></div>
                </td>
                
                <td class="appbox">
                    <div class="appbox-title"><?php echo _("YEAR"); ?></div>
                    <div><span class="appbox-value u1a" style="color:#0699fa"><?php echo _("£"); ?></span><span class="appbox-value" id="myelectric_year_kwh" style="color:#0699fa">---</span> <span class="units appbox-units u1b" style="color:#0779c1"><?php echo _("kWh"); ?></span></div>
                    
                    <div style="padding-top:5px; color:#0779c1" class="appbox-units" ><span class="units u2a"></span><span id="myelectric_year_kwhd">---</span><span class="units u2b"> <?php echo _("kWh/d"); ?></span></div>
                </td>
                
                <td class="appbox">
                    <div class="appbox-title"><?php echo _("ALL"); ?></div>
                    <div><span class="appbox-value u1a" style="color:#0699fa"><?php echo _("£"); ?></span><span class="appbox-value" id="myelectric_alltime_kwh" style="color:#0699fa">---</span> <span class="units appbox-units u1b" style="color:#0779c1"><?php echo _("kWh"); ?></span></div>
                    
                    <div style="padding-top:5px; color:#0779c1" class="appbox-units" ><span class="units u2a"></span><span id="myelectric_alltime_kwhd">---</span><span class="units u2b"> <?php echo _("kWh/d"); ?></span></div>
                </td>
            </tr>
        </table>
    </div>
</div>    

<div id="myelectric-setup" style="display:none; padding-top:50px" class="block">

    <h2 style="color:#0699fa"><?php echo _("My Electric"); ?></h2>

    <div class="float:left">
      <div class="span9">
        <p class="a2"><?php echo _("The My Electric app is a simple home energy monitoring app for exploring home or building electricity consumption over time. It includes a real-time view and a historic kWh per day bar graph."); ?></p>

        <p class="a2"><?php echo _("<b>Auto configure:</b> This app can auto-configure connecting to emoncms feeds with the names shown on the right, alternatively feeds can be selected by clicking on the edit button."); ?></p>

        <p class="a2"><?php echo _("<b>Cumulative kWh</b> feeds can be generated from power feeds with the power_to_kwh input processor."); ?></p>

        <img src="Modules/app/images/myelectric_app.png" style="width:600px" class="img-rounded">
      </div>
      <div class="span3"><div class="app-config"></div></div>
    </div>

</div>
</div>
