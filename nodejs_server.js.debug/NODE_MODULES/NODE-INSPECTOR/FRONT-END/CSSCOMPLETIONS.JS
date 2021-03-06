WebInspector.CSSCompletions = [];

WebInspector.CSSCompletions.startsWith = function(prefix)
{
    var firstIndex = this._firstIndexOfPrefix(prefix);
    if (firstIndex === -1)
        return [];

    var results = [];
    while (this[firstIndex].indexOf(prefix) === 0)
        results.push(this[firstIndex++]);
    return results;
}

WebInspector.CSSCompletions.firstStartsWith = function(prefix)
{
    var foundIndex = this._firstIndexOfPrefix(prefix);
    return (foundIndex === -1 ? "" : this[foundIndex]);
}

WebInspector.CSSCompletions._firstIndexOfPrefix = function(prefix)
{
    if (!prefix)
        return -1;
    if (!this.length)
        return -1;

    var maxIndex = this.length - 1;
    var minIndex = 0;
    var foundIndex;

    do {
        var middleIndex = (maxIndex + minIndex) >> 1;
        if (this[middleIndex].indexOf(prefix) === 0) {
            foundIndex = middleIndex;
            break;
        }
        if (this[middleIndex] < prefix)
            minIndex = middleIndex + 1;
        else
            maxIndex = middleIndex - 1;
    } while (minIndex <= maxIndex);

    if (!foundIndex)
        return -1;

    while (foundIndex && this[foundIndex - 1].indexOf(prefix) === 0)
        foundIndex--;

    return foundIndex;
}

WebInspector.CSSCompletions.next = function(str, prefix)
{
    return WebInspector.CSSCompletions._closest(str, prefix, 1);
}

WebInspector.CSSCompletions.previous = function(str, prefix)
{
    return WebInspector.CSSCompletions._closest(str, prefix, -1);
}

WebInspector.CSSCompletions._closest = function(str, prefix, shift)
{
    if (!str)
        return "";

    var index = this.indexOf(str);
    if (index === -1)
        return "";

    if (!prefix) {
        index = (index + this.length + shift) % this.length;
        return this[index];
    }

    var propertiesWithPrefix = this.startsWith(prefix);
    var j = propertiesWithPrefix.indexOf(str);
    j = (j + propertiesWithPrefix.length + shift) % propertiesWithPrefix.length;
    return propertiesWithPrefix[j];
}

WebInspector.CSSCompletions._load = function(properties)
{
    for (var i = 0; i < properties.length; ++i)
        WebInspector.CSSCompletions.push(properties[i]);
    WebInspector.CSSCompletions.sort();
}
