/**
 * Require: Registry.js
 */

/**
 * Get computer name.
 */
function GetComputerName() {
    return new ActiveXObject("WScript.Network").ComputerName;
}
/**
 * Get user name.
 */
function GetUserName() {
    return new ActiveXObject("WScript.Network").UserName;
}
/**
 * Get user domain.
 */
function GetUserDomain() {
    return new ActiveXObject("WScript.Network").UserDomain;
}
/**
 * Get processor architecture.
 */
function GetProcessorArchitecture() {
    return new ActiveXObject("WScript.Shell").Environment("Process").Item("PROCESSOR_ARCHITECTURE");
}

/**
 * Get OS version information.
 * @return OS version(Major, Minor, Build, UBR, toString())
 */
function GetOSVersion() {
    var reg = new Registry('.');
    var keyName = "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion";
    var major = reg.GetDWORDValue(reg.HKLM, keyName, "CurrentMajorVersionNumber");
    var minor = reg.GetDWORDValue(reg.HKLM, keyName, "CurrentMinorVersionNumber");
    var build = reg.GetStringValue(reg.HKLM, keyName, "CurrentBuild");
    var ubr = reg.GetDWORDValue(reg.HKLM, keyName, "UBR");
    return {"Major": major, 
            "Minor": minor, 
            "Build": build, 
            "UBR": ubr, 
            toString: function(){ return [major, minor, build, ubr].join('.');}
           };
}
