
<?php
/*
  All Emoncms code is released under the GNU Affero General Public License.
  See COPYRIGHT.txt and LICENSE.txt.

  ---------------------------------------------------------------------
  Emoncms - open source energy visualisation
  Part of the OpenEnergyMonitor project:
  http://openenergymonitor.org
*/

// no direct access
defined('EMONCMS_EXEC') or die('Restricted access');

// Create a Javascript associative array who contain all sentences from module
?>
var LANG_JS = new Array();
function _Tr(key)
{
<?php // will return the default value if LANG_JS[key] is not defined. ?>
    return LANG_JS[key] || key;
}
<?php
//Please USE the builder every javascript modify at: /script/langjs_builder.php
?>
// START AUTO GENERATED

// energymeter.js
LANG_JS["/day"] = '<?php echo addslashes(_("/day")); ?>';
LANG_JS["/hr"] = '<?php echo addslashes(_("/hr")); ?>';
LANG_JS["Cumulative use in kWh"] = '<?php echo addslashes(_("Cumulative use in kWh")); ?>';
LANG_JS["Currency"] = '<?php echo addslashes(_("Currency")); ?>';
LANG_JS["Currency symbol (€,£,$...)"] = '<?php echo addslashes(_("Currency symbol (€,£,$...)")); ?>';
LANG_JS["House or building use in watts"] = '<?php echo addslashes(_("House or building use in watts")); ?>';
LANG_JS["kWh"] = '<?php echo addslashes(_("kWh")); ?>';
LANG_JS["kWh/d"] = '<?php echo addslashes(_("kWh/d")); ?>';
LANG_JS["Power (Watts)"] = '<?php echo addslashes(_("Power (Watts)")); ?>';
LANG_JS["Unit cost"] = '<?php echo addslashes(_("Unit cost")); ?>';
LANG_JS["Unit cost of electricity"] = '<?php echo addslashes(_("Unit cost of electricity")); ?>';
LANG_JS["use"] = '<?php echo addslashes(_("use")); ?>';
LANG_JS["use_kwh"] = '<?php echo addslashes(_("use_kwh")); ?>';
LANG_JS["W"] = '<?php echo addslashes(_("W")); ?>';
LANG_JS["£"] = '<?php echo addslashes(_("£")); ?>';

// config.js
LANG_JS["feed"] = '<?php echo addslashes(_("feed")); ?>';
LANG_JS["Launch App"] = '<?php echo addslashes(_("Launch App")); ?>';
LANG_JS["ok"] = '<?php echo addslashes(_("ok")); ?>';
LANG_JS["Select"] = '<?php echo addslashes(_("Select")); ?>';

// myelectric - Kopie.js
LANG_JS["Cumulative use in kWh"] = '<?php echo addslashes(_("Cumulative use in kWh")); ?>';
LANG_JS["Currency"] = '<?php echo addslashes(_("Currency")); ?>';
LANG_JS["Currency symbol (€,£,$...)"] = '<?php echo addslashes(_("Currency symbol (€,£,$...)")); ?>';
LANG_JS["House or building use in watts"] = '<?php echo addslashes(_("House or building use in watts")); ?>';
LANG_JS["Unit cost"] = '<?php echo addslashes(_("Unit cost")); ?>';
LANG_JS["Unit cost of electricity £/kWh"] = '<?php echo addslashes(_("Unit cost of electricity £/kWh")); ?>';
LANG_JS["use"] = '<?php echo addslashes(_("use")); ?>';
LANG_JS["use_kwh"] = '<?php echo addslashes(_("use_kwh")); ?>';

// myelectric.js
LANG_JS["/day"] = '<?php echo addslashes(_("/day")); ?>';
LANG_JS["/hr"] = '<?php echo addslashes(_("/hr")); ?>';
LANG_JS["Cumulative use in kWh"] = '<?php echo addslashes(_("Cumulative use in kWh")); ?>';
LANG_JS["Currency"] = '<?php echo addslashes(_("Currency")); ?>';
LANG_JS["Currency symbol (€,£,$...)"] = '<?php echo addslashes(_("Currency symbol (€,£,$...)")); ?>';
LANG_JS["House or building use in watts"] = '<?php echo addslashes(_("House or building use in watts")); ?>';
LANG_JS["kWh"] = '<?php echo addslashes(_("kWh")); ?>';
LANG_JS["kWh/d"] = '<?php echo addslashes(_("kWh/d")); ?>';
LANG_JS["Power (Watts)"] = '<?php echo addslashes(_("Power (Watts)")); ?>';
LANG_JS["Unit cost"] = '<?php echo addslashes(_("Unit cost")); ?>';
LANG_JS["Unit cost of electricity £/kWh"] = '<?php echo addslashes(_("Unit cost of electricity £/kWh")); ?>';
LANG_JS["use"] = '<?php echo addslashes(_("use")); ?>';
LANG_JS["use_kwh"] = '<?php echo addslashes(_("use_kwh")); ?>';
LANG_JS["W"] = '<?php echo addslashes(_("W")); ?>';
LANG_JS["£"] = '<?php echo addslashes(_("£")); ?>';
// END AUTO GENERATED
