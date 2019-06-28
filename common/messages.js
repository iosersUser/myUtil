;
if (!window.ES) {
    window.ES = {}
}
ES.msg = {}

ES.msg.get = function(key, arg) {
    if (this[key] || this[key]=='') {
        return ES.util.format_string(this[key], arg)
    } else {
        console.warn('key not found: ' + key)
        return key;
    }
}
