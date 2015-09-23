/* ========================================================================

    Ported from rico.js and Nifty Corners by Ken Xu.

    Version: 0.0.2

    Date: 2006-07-03

    Requirements

        modello.js: http://modello.sourceforge.net

    Usage
        var options = { ... };
        var co = Class.get('modello.port.Corners').create(options);
        co.apply(element);
        // element can be an object or a valid CSS selector
        // in one line
        Class.get('modello.port.Corners').create({...}).apply(element);


    Options

        corners: which corner(or corners) to be apply
            'all'    - all the four corners(default)
            'tl'     - top left corner
            'tr'     - top right corner
            'bl'     - bottom left corner
            'br'     - bottom right corner
            'top'    - upper corners
            'bottom' - lower corners
            'left'   - left corners
            'right'  - right corners

        bgColor: background color of corners
            '' - use the parent's background color of current element(default)
            or a valid CSS color value

        color: foreground color of corners
            '' - use the current element's background color(default)
            or a valid CSS color value

        (Tips: both bgColor and color can be seted as 'transparent')

        border: border color or border width
            if it is a color, the border width is 1px
            if it is a integer, use bdColor to set the border color

        bdColor: border color
            '' - use the current element's border color(default)
            or a valid CSS color value

        scale: scale of corners
            'small'  - small scale
            'medium' - medium scale(default)
            'large'  - large scale
            or an integer

        style: stype of corners
            'arc'  - rounded style(default)
            'line' - bevel style

        height: set the height of target block
            'same' - use the max height value of the elements
            or an integer
   
        smooth: apply smooth effect in 'arc' style
            true  - use smooth effect(default)
            false - do not use it


    Examples

        http://www.ajaxwing.com/examples/corners_example.html


    Links

        Rico: http://www.openrico.org/
        Nifty Corners: http://www.html.it/articoli/niftycube/index.html

   ======================================================================== */


var Corners = Class.create().register('modello.port.Corners');

Corners.checkColor = function (color) {
    if (typeof color != "string") {
        return "";
    }
    var result = "#";
    if (color.substr(0, 1) == "#") {
        if (color.length == 7) {
            result = color;
        } else if (color.length == 4) {
            result += color.substr(1, 1) + color.substr(1, 1);
            result += color.substr(2, 1) + color.substr(2, 1);
            result += color.substr(3, 1) + color.substr(3, 1);
        } else {
            result = "";
        }
    } else if (color.substr(0, 3) == "rgb") {
        arr = color.substr(3).trim().slice(1, -1).split(",");
        if (arr.length != 3) {
            result = "";
        } else {
            var p1 = parseInt(arr[0]).toString(16);
            if (p1.length == 1) p1 = "0" + p1;
            var p2 = parseInt(arr[1]).toString(16);
            if (p2.length == 1) p2 = "0" + p2;
            var p3 = parseInt(arr[2]).toString(16);
            if (p3.length == 1) p3 = "0" + p3;
            result += p1 + p2 + p3;
        }
    } else if (color == "transparent") {
        result = "transparent";
    } else {
        result = "";
    }
    return result;
}

Corners.getStyle = function (element, property) {
    try {
        if (element.currentStyle) {
            return element.currentStyle[property];
        } else if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(element, '')[property];
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}

Corners.background = function (element) {
    var cssProperty = "backgroundColor";
    var mozillaEquivalentCSS = "background-color";
    var actualColor = Corners.getStyle(element, cssProperty);
    if (actualColor == null) {
        actualColor = Corners.getStyle(element, mozillaEquivalentCSS);
    }
    if (actualColor == "transparent" && element.parentNode) {
        return arguments.callee(element.parentNode);
    }
    if (actualColor == null) {
        return "#ffffff";
    } else {
        return actualColor;
    }
}

Corners.blend = function (color1, color2){
    if (color1 == "transparent") {
        return color2;
    }
    if (color2 == "transparent") {
        return color1;
    }
    var x, y;
    var result = "#";
    for (var i = 0; i < 3; i++) {
        x = parseInt(color1.substr(1+2*i, 2), 16);
        y = parseInt(color2.substr(1+2*i, 2), 16);
        result += Math.round((x+y)/2).toString(16);
    }
    return result;
}

Corners.construct = function ($self, $class) {

    var _options;

    var _numSlices = 0;

    var _renderTop = false;

    var _renderBottom = false;

    var _marginSizeArr = [];

    var _borderSizeArr = [];

    var _blendBorderSizeArr = [];

    this.initialize = function (options) {
        this.setOptions(options);
    }

    this.setOptions = function (options) {
        _options = {
            corners   : "all",
            bgColor   : "",
            color     : "",
            border    : 0,
            bdColor   : "",
            scale     : "medium",
            style     : "arc",
            smooth    : true
        }
        Object.extend(_options, options || {});
        _setCorners();
        _options.bgColor = $class.checkColor(_options.bgColor);
        _options.color = $class.checkColor(_options.color);
        if (typeof _options.smooth != "boolean") {
            _options.smooth = true;
        }
        switch (typeof _options.border) {
            case "number":
                _options.border = Math.round(_options.border);
                if (_options.border < 0) {
                    _options.border = 0;
                }
                break;
            case "string":
                _options.bdColor = $class.checkColor(_options.border);
                if (_options.bdColor) {
                    _options.border = 1;
                } else {
                    _options.border = 0;
                }
                break;
            default:
                _options.border = 0;
        }
        _options.bdColor = $class.checkColor(_options.bdColor);
        if (_options.color == "transparent") {
            _options.border = 0;
            _options.smooth = false;
        }
        if (_options.border > 0) {
            _options.smooth = false;
        }
        switch (typeof _options.scale) {
            case "number":
                _options.scale = Math.round(_options.scale);
                if (_options.scale < 0) {
                    _options.scale = 0;
                }
                break;
            case "string":
                switch (_options.scale) {
                    case "small":
                        if (_options.border || !_options.smooth) {
                            _options.scale = 6;
                        } else {
                            _options.scale = 4;
                        }
                        break;
                    case "medium":
                        if (_options.border) {
                            _options.scale = 9;
                        } else {
                            _options.scale = 8;
                        }
                        break;
                    case "large":
                        if (!_options.smooth) {
                            _options.scale = 13;
                        } else {
                            _options.scale = 14;
                        }
                        break;
                    default:
                        if (_options.border) {
                            _options.scale = 9;
                        } else {
                            _options.scale = 8;
                        }
                }
                break;
            default:
                if (_options.border) {
                    _options.scale = 9;
                } else {
                    _options.scale = 8;
                }
        }
        if (typeof _options.style != "string") {
            _options.style = "arc";
        }
        if (!["arc", "line"].contains(_options.style)) {
            _options.style = "arc";
        }
        _numSlices = _options.scale > _options.border ?  _options.scale : _options.border;
        _computeSize();
    }

    this.apply = function (element) {
        if (typeof element == 'object') {
            var elements = [element];
        } else if (typeof element == 'string') {
            var elements = [];
            selectors = element.split(/,\s*/);
            for (i = 0; i < selectors.length; i++) {
                elements = elements.concat(document.getElementsBySelector(selectors[i]));
            }
        } else {
            return;
        }
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var bgColor, color;
            if (!_options.bgColor) {
                var bgColor = _options.bgColor;
                _options.bgColor = $class.background(el.parentNode);
                _options.bgColor = $class.checkColor(_options.bgColor);
            }
            if (!_options.color) {
                var color = _options.color;
                _options.color = $class.background(el);
                _options.color = $class.checkColor(_options.color);
            }
            if (_options.border > 0) {
                _renderBorder(el);
            }
            if (_renderTop) {
                _renderTopCorners(el);
            }
            if (_renderBottom) {
                _renderBottomCorners(el);
            }
            if (typeof bgColor != "undefined") {
                _options.bgColor = bgColor;
            }
            if (typeof color != "undefined") {
                _options.color = color;
            }
        }
        _setHeight(elements);
    }

    var _setHeight = function (elements) {
        var height = 0;
        if (typeof _options.height == 'number') {
            var height = _options.height;
        } else if (typeof _options.height == 'string' && _options.height == 'same') {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].offsetHeight > height) {
                    height = elements[i].offsetHeight;
                }
            }
        } else {
            return;
        }
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var gap = height - element.offsetHeight;
            if (gap > 0) {
                var el = document.createElement("b");
                var inStyle = el.style;
                inStyle.display = "block";
                inStyle.height = gap + "px";
                var el2 = element.lastChild;
                if (el2.className == "_bottom_corners") {
                    element.insertBefore(el, el2);
                } else {
                    element.appendChild(el);
                }
            }
        }
    }

    var _setCorners = function () {
        _renderTop = false;
        _renderBottom = false;

        var corners = _options["corners"];
        corners = corners.replace("all", "tl tr bl br");
        corners = corners.replace("left", "tl bl");
        corners = corners.replace("right", "tr br");
        corners = corners.replace("top", "tr tl");
        corners = corners.replace("bottom", "br bl");
        var arr1 = corners.split(" ");
        var arr2 = []
        for (i = 0; i < arr1.length; i++) {
            if (!arr2.contains(arr1[i])) {
                arr2.push(arr1[i]);
            }
        }
        if (arr2.contains("tl") || arr2.contains("tr")) {
            _renderTop = true;
        }
        if (arr2.contains("bl") || arr2.contains("br")) {
            _renderBottom = true;
        }
        _options.corners = arr2;
    }

    var _computeSize = function () {
        _marginSizeArr = [];
        _borderSizeArr = [];
        _blendBorderSizeArr = [];

        if (_options.scale <= 0) {
            return;
        }

        var s = _options.scale;
        var marginSize, borderSize, blendBorderSize;
        for (var h = s; h > 0; h--) {
            if (_options.style == "line") {
                marginSize = h-1;
                blendBorderSize = 0;
            } else {
                var w1 = s - Math.sqrt(Math.pow(s,2) - Math.pow(h-1,2));
                var w2 = s - Math.sqrt(Math.pow(s,2) - Math.pow(h,2));
                if (Math.floor(w1) == Math.floor(w2) || Math.ceil(w1) == Math.ceil(w2)) {
                    if ((w2-w1)/2+(Math.ceil(w2)-w2) < 0.5) {
                        marginSize = Math.ceil(w1);
                        blendBorderSize = 0;
                    } else {
                        marginSize = Math.floor(w1);
                        if (((w2-w1)/2 + (w1-Math.floor(w1))) >= 1/4) {
                            blendBorderSize = 1;
                        } else {
                            blendBorderSize = 0;
                        }
                    }
                } else {
                    var w = Math.ceil(w1);
                    while (true) {
                        if (w >= s) {
                            break;
                        }
                        var h1 = Math.sqrt(Math.pow(s,2) - Math.pow(s-w,2));
                        var h2 = Math.sqrt(Math.pow(s,2) - Math.pow(s-(w+1),2));
                        if (Math.floor(h1) < Math.floor(h2)) {
                            break;
                        }
                        if ((h2-h1)/2+(h1-Math.floor(h1)) >= 0.5) {
                            break;
                        }
                        w += 1;
                    }
                    marginSize = w;
                    blendBorderSize = 0;
                    while (true) {
                        var Ax = w;
                        var Ay = Math.sqrt(Math.pow(s,2) - Math.pow(s-w,2));
                        if (w >= s) {
                            break;
                        }
                        if (Ay >= h) {
                            break;
                        }
                        w += 1;
                        var Bx = w;
                        var By = Math.sqrt(Math.pow(s,2) - Math.pow(s-w,2));
                        if (Math.floor(By) > Math.floor(Ay)) {
                            By = Math.ceil(Ay);
                            Bx = s - Math.sqrt(Math.pow(s,2) - Math.pow(By,2));
                            if ((Bx-Ax)*(By-Ay)/2 < 1/4) {
                                break;
                            }
                        } else {
                            if (((By-Ay)/2 + (Math.ceil(By)-By)) < 1/4) {
                                break;
                            }
                        }
                        blendBorderSize += 1;
                    }
                }
            }
            borderSize = 0;
            if (_options.style == "line") {
                borderSize = Math.floor(_options.border*Math.sqrt(2));
            } else {
                var s2 = s - _options.border;
                if (h <= s2) {
                    var w1 = s2 - Math.sqrt(Math.pow(s2,2) - Math.pow(h-1,2));
                    var w2 = s2 - Math.sqrt(Math.pow(s2,2) - Math.pow(h,2));
                    if (Math.floor(w1) == Math.floor(w2) ||
                         Math.ceil(w1) == Math.ceil(w2)) {
                        if ((w2-w1)/2+(Math.ceil(w2)-w2) < 0.5) {
                            var offset = Math.ceil(w1);
                        } else {
                            var offset = Math.floor(w1);
                        }
                    } else {
                        var w = Math.ceil(w1);
                        while (true) {
                            if (w >= s2) {
                                break;
                            }
                            var h1 = Math.sqrt(Math.pow(s2,2) - Math.pow(s2-w,2));
                            var h2 = Math.sqrt(Math.pow(s2,2) - Math.pow(s2-(w+1),2));
                            if (Math.floor(h1) < Math.floor(h2)) {
                                break;
                            }
                            if ((h2-h1)/2+(h1-Math.floor(h1)) >= 0.5) {
                                break;
                            }
                            w += 1;
                        }
                        var offset = w;
                    }
                    borderSize = offset - marginSize + _options.border;
                } else {
                    borderSize = _options.border;
                }
            }
            _marginSizeArr.push(marginSize);
            _borderSizeArr.push(borderSize);
            _blendBorderSizeArr.push(blendBorderSize);
        }
        if (_options.style == "line" && borderSize > _options.border) {
            _numSlices += borderSize - _options.border - 1;
            for (var i = 1; i < borderSize - _options.border; i++) {
                _marginSizeArr.push(0);
                _borderSizeArr.push(borderSize - i);
                _blendBorderSizeArr.push(0);
            }
        }
    }

    var _renderBorder = function (element) {
        var bc = _options.bdColor;
        var bd = _options.border;
        if (!element.passed) {
            for (var i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].nodeType == 1) {
                    element.childNodes[i].style.borderLeft = bd + "px solid " + bc;
                    element.childNodes[i].style.borderRight = bd + "px solid " + bc;
                } else if (element.childNodes[i].nodeType == 3) {
                    var t = element.childNodes[i].nodeValue;
                    var d = document.createElement("b");
                    d.style.display = "block";
                    d.style.borderLeft = bd + "px solid " + bc;
                    d.style.borderRight = bd + "px solid " + bc;
                    d.appendChild(document.createTextNode(t));
                    element.insertBefore(d, element.childNodes[i]);
                    element.removeChild(element.childNodes[i+1]);
                }
            }
            element.passed = true;
        }
    }

    var _renderTopCorners = function (element) {
        var corner = document.createElement("b");
        corner.style.backgroundColor = _options.color == "transparent" ? "transparent" : _options.bgColor;
        corner.style.display = "block";
        for (var i = 0; i < _numSlices; i++) {
            slice = _createCornerSlice(i, "top");
            if (slice != null) {
                corner.appendChild(slice);
            }
        }
        element.style.paddingTop = 0;
        element.insertBefore(corner, element.firstChild);
    }

    var _renderBottomCorners = function (element) {
        var corner = document.createElement("b");
        corner.style.backgroundColor = _options.color == "transparent" ?  "transparent" : _options.bgColor;
        corner.style.display = "block";
        corner.className = "_bottom_corners";
        for (var i = _numSlices-1; i >= 0; i--) {
            slice = _createCornerSlice(i, "bottom");
            if (slice != null) {
                corner.appendChild(slice);
            }
        }
        element.style.paddingBottom = 0;
        element.appendChild(corner);
    }

    var _createCornerSlice = function (n, position) {
        if (_options.border > 0) {
            if (_marginSizeArr[n] + _borderSizeArr[n] <= _options.border && n >= _options.border) {
                return null;
            }
        } else {
            if (_options.smooth) {
                if (_marginSizeArr[n] + _blendBorderSizeArr[n] <= 0) {
                    return null;
                }
            } else {
                if (_marginSizeArr[n] <= 0) {
                    return null;
                }
            }
        }

        var slice = document.createElement("b");
        var inStyle = slice.style;
        inStyle.backgroundColor = _options.color;
        inStyle.display = "block";
        inStyle.height = "1px";
        inStyle.overflow = "hidden";
        inStyle.fontSize = "1px";
        if (_options.border > 0) {
            inStyle.borderWidth = "0px " + _options.border + "px";
            inStyle.borderStyle = "solid";
            inStyle.borderColor = _options.bdColor;
            if (n < _options.border) {
                inStyle.backgroundColor = _options.bdColor;
            }
        }
        _setMargin(slice, n, position);
        _setBorder(slice, n, position);
        return slice;
    }

    var _setMargin = function (slice, n, position) {
        if (n >= _marginSizeArr.length) {
            return;
        }
        if (_options.color == "transparent") {
            var marginSize = 0;
        } else {
            var marginSize = _marginSizeArr[n];
        }
        slice.style.marginLeft = "0px"; slice.style.marginRight = "0px";
        if ((_options.corners.contains("tl") && position == "top" ) || (_options.corners.contains("bl") && position == "bottom" )) {
            slice.style.marginLeft = marginSize + "px";
        }
        if ((_options.corners.contains("tr") && position == "top" ) || (_options.corners.contains("br") && position == "bottom" )) {
            slice.style.marginRight = marginSize + "px";
        }
    }

    var _setBorder = function (slice, n, position) {
        var borderStyle = "";
        if (_options.smooth) {
            var borderColor = $class.blend(_options.bgColor, _options.color);
            var borderSize = _blendBorderSizeArr[n];
            borderStyle = borderSize + "px solid " + borderColor;
        }
        if (_options.border > 0) {
            var borderColor = _options.bdColor;
            var borderSize = _borderSizeArr[n];
            if (borderSize < 1) {
                borderSize = 1;
            }
            borderStyle = borderSize + "px solid " + borderColor;
        }
        if (_options.color == "transparent") {
            var borderColor = _options.bgColor;
            var borderSize = _marginSizeArr[n];
            borderStyle = borderSize + "px solid " + borderColor;
        }
        if (borderStyle.length > 0) {
            if ((_options.corners.contains("tl") && position == "top" ) || (_options.corners.contains("bl") && position == "bottom" )) {
                slice.style.borderLeft = borderStyle;
            }
            if ((_options.corners.contains("tr") && position == "top" ) || (_options.corners.contains("br") && position == "bottom" )) {
                slice.style.borderRight = borderStyle;
            }
        }
    }
}


/* ===================================
    Utilitie methods
   =================================== */

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}

Array.prototype.indexOf = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === item) {
            return i;
        }
    }
    return -1;
}

Array.prototype.contains = function (item) {
    return this.indexOf(item) != -1;
}

Object.extend = function (dest, src) {
    for (prop in src) {
        dest[prop] = src[prop];
    }
    return dest;
}

/* document.getElementsBySelector(selector)
   - returns an array of element objects from the current document
     matching the CSS selector. Selectors can contain element names, 
     class names and ids and can be nested. For example:
     
       elements = document.getElementsBySelect('div#main p a.external')
     
     Will return an array of all 'a' elements with 'external' in their 
     class attribute that are contained inside 'p' elements that are 
     contained inside the 'div' element which has id="main"

   New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
   See http://www.w3.org/TR/css3-selectors/#attribute-selectors

   Version 0.4 - Simon Willison, March 25th 2003
   -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
   -- Opera 7 fails 
*/

function getAllChildren(e) {
  // Returns all children of element. Workaround required for IE5/Windows. Ugh.
  return e.all ? e.all : e.getElementsByTagName('*');
}

document.getElementsBySelector = function(selector) {
  // Attempt to fail gracefully in lesser browsers
  if (!document.getElementsByTagName) {
    return new Array();
  }
  // Split selector in to tokens
  var tokens = selector.split(' ');
  var currentContext = new Array(document);
  for (var i = 0; i < tokens.length; i++) {
    token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');;
    if (token.indexOf('#') > -1) {
      // Token is an ID selector
      var bits = token.split('#');
      var tagName = bits[0];
      var id = bits[1];
      var element = document.getElementById(id);
      if (tagName && element.nodeName.toLowerCase() != tagName) {
        // tag with that ID not found, return false
        return new Array();
      }
      // Set currentContext to contain just this element
      currentContext = new Array(element);
      continue; // Skip to next token
    }
    if (token.indexOf('.') > -1) {
      // Token contains a class selector
      var bits = token.split('.');
      var tagName = bits[0];
      var className = bits[1];
      if (!tagName) {
        tagName = '*';
      }
      // Get elements matching tag, filter them for class selector
      var found = new Array;
      var foundCount = 0;
      for (var h = 0; h < currentContext.length; h++) {
        var elements;
        if (tagName == '*') {
            elements = getAllChildren(currentContext[h]);
        } else {
            elements = currentContext[h].getElementsByTagName(tagName);
        }
        for (var j = 0; j < elements.length; j++) {
          found[foundCount++] = elements[j];
        }
      }
      currentContext = new Array;
      var currentContextIndex = 0;
      for (var k = 0; k < found.length; k++) {
        if (found[k].className && found[k].className.match(new RegExp('\\b'+className+'\\b'))) {
          currentContext[currentContextIndex++] = found[k];
        }
      }
      continue; // Skip to next token
    }
    // Code to deal with attribute selectors
    if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
      var tagName = RegExp.$1;
      var attrName = RegExp.$2;
      var attrOperator = RegExp.$3;
      var attrValue = RegExp.$4;
      if (!tagName) {
        tagName = '*';
      }
      // Grab all of the tagName elements within current context
      var found = new Array;
      var foundCount = 0;
      for (var h = 0; h < currentContext.length; h++) {
        var elements;
        if (tagName == '*') {
            elements = getAllChildren(currentContext[h]);
        } else {
            elements = currentContext[h].getElementsByTagName(tagName);
        }
        for (var j = 0; j < elements.length; j++) {
          found[foundCount++] = elements[j];
        }
      }
      currentContext = new Array;
      var currentContextIndex = 0;
      var checkFunction; // This function will be used to filter the elements
      switch (attrOperator) {
        case '=': // Equality
          checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue); };
          break;
        case '~': // Match one of space seperated words 
          checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('\\b'+attrValue+'\\b'))); };
          break;
        case '|': // Match start with value followed by optional hyphen
          checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))); };
          break;
        case '^': // Match starts with value
          checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0); };
          break;
        case '$': // Match ends with value - fails with "Warning" in Opera 7
          checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length); };
          break;
        case '*': // Match ends with value
          checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1); };
          break;
        default :
          // Just test for existence of attribute
          checkFunction = function(e) { return e.getAttribute(attrName); };
      }
      currentContext = new Array;
      var currentContextIndex = 0;
      for (var k = 0; k < found.length; k++) {
        if (checkFunction(found[k])) {
          currentContext[currentContextIndex++] = found[k];
        }
      }
      // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
      continue; // Skip to next token
    }
    // If we get here, token is JUST an element (not a class or ID selector)
    tagName = token;
    var found = new Array;
    var foundCount = 0;
    for (var h = 0; h < currentContext.length; h++) {
      var elements = currentContext[h].getElementsByTagName(tagName);
      for (var j = 0; j < elements.length; j++) {
        found[foundCount++] = elements[j];
      }
    }
    currentContext = found;
  }
  return currentContext;
}

/* That revolting regular expression explained 
/^(\w+)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/
  \---/  \---/\-------------/    \-------/
    |      |         |               |
    |      |         |           The value
    |      |    ~,|,^,$,* or =
    |   Attribute 
   Tag
*/
