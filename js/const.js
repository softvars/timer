var CONSTANTS = {
    COLON: ':',
    _24: 24,
    _12: 12
};
var _c = CONSTANTS;

var ENTRY_IN = 'IN';
var ENTRY_OUT = 'OUT';
var MODE_PAIR = 'PAIR';
var MODE_FLEX = 'FLEX';

var ENTRY_PAIR = {};
ENTRY_PAIR[ENTRY_IN] = ENTRY_OUT;
ENTRY_PAIR[ENTRY_OUT] = ENTRY_IN;

var CONTEXT = {};
CONTEXT[ENTRY_IN] = "success";
CONTEXT[ENTRY_OUT] = "info";


var KEY_ENTRIES = "entries";
var KEY_ENTRIES_UNDO = "entries_undo";
var KEY_TOTAL_TIME = "entriesTimeTotal";
var KEY_UC_STATE = "User_Curr_State";
var KEY_UC_DATE = "User_Curr_Date";
var KEY_UC_SETTINGS_MODE = "User_Curr_Swip_Mode";
var KEY_DAY_ENTRIES = "_TimeEntries";
