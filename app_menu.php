<?php

    global $session, $user;
    $domain = "messages";
    bindtextdomain($domain, "Modules/app/locale");
    bind_textdomain_codeset($domain, 'UTF-8');

    $apikey = "";
    if ($session['write']) $apikey = "?readkey=".$user->get_apikey_read($session['userid']);
    
    $menu_left[] = array(
        'name'=>"Apps", 
        'path'=>"app/mysolarpv" , 
        'session'=>"write", 
        'order' => 5,
        'icon'=>'icon-leaf icon-white',
        'dropdown'=>array(
            
            array('name' => dgettext($domain, 'Energy Meter'), 'icon' => '', 'path' => "app$apikey&appname=energymeter#energymeter", 'session' => 'read', 'order' => 0),
            array('name' => dgettext($domain, 'My Electric'), 'icon' => '', 'path' => "app$apikey&appname=myelectric#myelectric", 'session' => 'read', 'order' => 1),
            array('name' => dgettext($domain, 'My Solar'), 'icon' => '', 'path' => "app$apikey&appname=mysolarpv#mysolarpv", 'session' => 'read', 'order' => 2),
            array('name' => dgettext($domain, 'My Solar&amp;Wind'), 'icon' => '','path' => "app$apikey&appname=myenergy#myenergy", 'session' => 'read', 'order' => 3),
            array('name' => dgettext($domain, 'My Solar (with divert)'), 'icon' => '', 'path' => "app$apikey&appname=mysolarpvdivert#mysolarpvdivert", 'session' => 'read', 'order' => 4),
            
        )
    );
    
    

