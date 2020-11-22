/**********************************************************
 *
 *  Registry operation class
 *
 * *******************************************************/

var Registry = function () {
    this.initialize.apply(this, arguments);
};

Registry.prototype = {
    initialize: function(computer) {
        var locator = new ActiveXObject("WbemScripting.SWbemLocator");
        var server = locator.ConnectServer(computer, "root\\default");
        this.stdregprov = server.Get("StdRegProv");

        this.HKCR = 0x80000000;    // HKEY_CLASSES_ROOT
        this.HKCU = 0x80000001;    // HKEY_CURRENT_USER
        this.HKLM = 0x80000002;    // HKEY_LOCAL_MACHINE
        this.HKUS = 0x80000003;    // HKEY_USERS
        this.HKCC = 0x80000005;    // HKEY_CURRENT_CONFIG

        // Types
        this.REG_SZ = 1;                            // 
        this.REG_EXPAND_SZ = 2;                     // 
        this.REG_BINARY = 3;                        // 
        this.REG_DWORD = 4;                         // 
        this.REG_MULTI_SZ = 7;                      // Multiple Unicode strings

        this.REG_QWORD = 11;                        // 64-bit number
        this.REG_KEY = 0x7fff;                      // 便宜上のタイプ(実際にはない)また以下は用途不明
        this.REG_NON = 0;                           // No value type
        this.REG_DWORD_LITTLE_ENDIAN = 4;           // 32-bit number (same as REG_DWORD)
        this.REG_DWORD_BIG_ENDIAN = 5;              // 32-bit number
        this.REG_LINK = 6;                          // Symbolic Link (unicode)
        this.REG_RESOURCE_LIST = 8;                 // Resource list in the resource map
        this.REG_FULL_RESOURCE_DESCRIPTOR = 9;      // Resource list in the hardware description
        this.REG_RESOURCE_REQUIREMENTS_LIST = 10;
        this.REG_QWORD_LITTLE_ENDIAN = 11;          // 64-bit number (same as REG_QWORD)

    },

    // Invoke method
    doMethod: function(methodName, hkey, key, value, valueName) {
        var inParam = this.stdregprov.Methods_.Item(methodName).InParameters.SpawnInstance_();
        inParam.hDefKey = hkey;
        inParam.sSubKeyName = key;
        if (value !== undefined) {
            // WScript.echo('value: ' + typeof value + ':' + value);
            if (valueName !== undefined) {
                // WScript.echo('methodName: ' + methodName);
                // WScript.echo('valueName: ' + typeof valueName + ' ' + valueName);
                // WScript.echo('value: ' + typeof value + ' ' + value);
                inParam.sValueName = valueName;
                switch (typeof value) {
                case 'number':
                case 'object':
                case 'unknown':
                    if (methodName === 'SetMultiStringValue') {
                        // MultiStringValue
                        inParam.sValue = value;
                    } else {
                        // object, unknown = SetRegBinaryValue
                        inParam.uValue = value;
                    }
                    break;
                default:
                    // String
                    inParam.sValue = value;
                    break;
                }
            } else {
                inParam.sValueName = value;
            }
        }
        var out = this.stdregprov.ExecMethod_(methodName, inParam);
        return out;
    },

    // Enum key
    EnumKey: function(hkey, key) {
        var outParam = this.doMethod("EnumKey", hkey, key);
        var names = [];
        if (outParam.sNames !== null) {
            names = outParam.sNames.toArray();
        }
        return    names;
    },

    // Enum values
    EnumValues: function(hkey, key) {
        var outParam = this.doMethod("EnumValues", hkey, key);
        var valueNames = [];
        if (outParam.sNames !== null) {
            valueNames = outParam.sNames.toArray();
        }
        var valueTypes = [];
        if (outParam.Types !== null) {
            valueTypes = outParam.Types.toArray();
        }

        return {
            Names: valueNames,
            Types: valueTypes
        };
    },

    // String(REG_SZ)
    GetStringValue: function(hkey, key, name) {
        var outParam = this.doMethod("GetStringValue", hkey, key, name);
        return outParam.sValue;
    },
    SetStringValue: function(hkey, key, name, value) {
        var outParam = this.doMethod("SetStringValue", hkey, key, value, name);
        return outParam.ReturnValue;
    },
    ExistsStringValue: function(hkey, key, name) {
        var outParam = this.GetStringValue(hkey, key, name);
        return (outParam.sValue !== null);
    },

    // ExpandString(REG_EXPAND_SZ)
    GetExpandedStringValue: function(hkey, key, name) {
        var outParam = this.doMethod("GetExpandedStringValue", hkey, key, name);
        return outParam.sValue;
    },
    SetExpandedStringValue: function(hkey, key, name, value) {
        var outParam = this.doMethod("SetExpandedStringValue", hkey, key, value, name);
        return outParam.ReturnValue;
    },
    ExistsExpandedStringValue: function(hkey, key, name) {
        var outParam = this.GetExpandedStringValue(hkey, key, name);
        return (outParam.sValue !== null);
    },

    // DWORD(REG_DWORD)
    GetDWORDValue: function(hkey, key, name) {
        var outParam = this.doMethod("GetDWORDValue", hkey, key, name);
        return outParam.uValue;
    },
    SetDWORDValue: function(hkey, key, name, value) {
        var outParam = this.doMethod("SetDWORDValue", hkey, key, value, name);
        return outParam.ReturnValue;
    },
    ExistsDWORDValue: function(hkey, key, name) {
        var outParam = this.GetDWORDValue(hkey, key, name);
        return (outParam.uValue !== null);
    },

    // QWORD(REG_QWORD)
    GetQWORDValue: function(hkey, key, name) {
        var outParam = this.doMethod("GetQWORDValue", hkey, key, name);
        return outParam.uValue;
    },
    SetQWORDValue: function(hkey, key, name, value) {
        var outParam = this.doMethod("SetQWORDValue", hkey, key, value, name);
        return outParam.ReturnValue;
    },
    ExistsQWORDValue: function(hkey, key, name) {
        var outParam = this.GetDWORDValue(hkey, key, name);
        return (outParam.uValue !== null);
    },

    // Multi String(REG_MULTI_SZ)
    GetMultiStringValue: function(hkey, key, name) {
        var outParam = this.doMethod("GetMultiStringValue", hkey, key, name);
        return outParam.sValue;
    },
    SetMultiStringValue: function(hkey, key, name, value) {
        var outParam = this.doMethod("SetMultiStringValue", hkey, key, value, name);
        return outParam.ReturnValue;
    },
    ExistsMultiStringValue: function(hkey, key, name) {
        var outParam = this.GetMultiStringValue(hkey, key, name);
        return (outParam.sValue !== null);
    },

    // Binary(REG_BINARY) TODO:
    GetBinaryValue: function(hkey, key, name) {
        var outParam = this.doMethod("GetBinaryValue", hkey, key, name);
        return outParam.uValue;
    },
    SetBinaryValue: function(hkey, key, name, value) {
        var outParam = this.doMethod("SetBinaryValue", hkey, key, value, name);
        return outParam.ReturnValue;
    },
    ExistsBinaryValue: function(hkey, key, name) {
        var outParam = this.GetBinaryValue(hkey, key, name);
        return (outParam.uValue !== null);
    },

    // Create key
    CreateKey: function(hkey, key) {
        var outParam = this.doMethod("CreateKey", hkey, key);   // 0:ok, not 0: ng
        return outParam.ReturnValue;   // 0:ok, not 0: ng
    },
    // Delete key
    DeleteKey: function(hkey, key) {
        var outParam = this.doMethod("DeleteKey", hkey, key);   // 0:ok, not 0: ng
        return outParam.ReturnValue;   // 0:ok, not 0: ng
    },
    ExistsKey: function(hkey, key) {
        var enumKeyArray = key.split('\\');
        var findKeyName = enumKeyArray.pop();
        var regKeys = this.EnumKey(hkey, enumKeyArray.join("\\"));
        for (var i = 0; i < regKeys.length; i++) {
            if (regKeys[i] === findKeyName) {
                return true;
            }
        }
        return false;
    },

    // Delete value
    DeleteValue: function(hkey, key, name) {
        var outParam = this.doMethod("DeleteValue", hkey, key, name);   // 0:ok, not 0: ng
        return outParam.ReturnValue;   // 0:ok, not 0: ng
    }

};
