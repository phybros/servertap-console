var obfuscators = [];
var styleMap = {
  "§4": "font-weight:normal;text-decoration:none;color:#be0000",
  "§c": "font-weight:normal;text-decoration:none;color:#fe3f3f",
  "§6": "font-weight:normal;text-decoration:none;color:#d9a334",
  "§e": "font-weight:normal;text-decoration:none;color:#fefe3f",
  "§2": "font-weight:normal;text-decoration:none;color:#00be00",
  "§a": "font-weight:normal;text-decoration:none;color:#3ffe3f",
  "§b": "font-weight:normal;text-decoration:none;color:#3ffefe",
  "§3": "font-weight:normal;text-decoration:none;color:#00bebe",
  "§1": "font-weight:normal;text-decoration:none;color:#0000be",
  "§9": "font-weight:normal;text-decoration:none;color:#3f3ffe",
  "§d": "font-weight:normal;text-decoration:none;color:#fe3ffe",
  "§5": "font-weight:normal;text-decoration:none;color:#be00be",
  "§f": "font-weight:normal;text-decoration:none;color:#ffffff",
  "§7": "font-weight:normal;text-decoration:none;color:#bebebe",
  "§8": "font-weight:normal;text-decoration:none;color:#3f3f3f",
  "§0": "font-weight:normal;text-decoration:none;color:#000000",
  "§l": "font-weight:bold",
  "§n": "text-decoration:underline;text-decoration-skip:spaces",
  "§o": "font-style:italic",
  "§m": "text-decoration:line-through;text-decoration-skip:spaces",
};
function obfuscate(doc, win, string, elem) {
  var magicSpan,
    currNode,
    len = elem.childNodes.length;
  if (string.indexOf("<br>") > -1) {
    elem.innerHTML = string;
    for (var j = 0; j < len; j++) {
      currNode = elem.childNodes[j];
      if (currNode.nodeType === 3) {
        magicSpan = doc.createElement("span");
        magicSpan.innerHTML = currNode.nodeValue;
        elem.replaceChild(magicSpan, currNode);
        init(win, magicSpan);
      }
    }
  } else {
    init(win, elem, string);
  }
  function init(win, el, str) {
    var i = 0,
      obsStr = str || el.innerHTML,
      len = obsStr.length;
    obfuscators.push(
      win.setInterval(function() {
        if (i >= len) i = 0;
        obsStr = replaceRand(obsStr, i);
        el.innerHTML = obsStr;
        i++;
      }, 0)
    );
  }
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function replaceRand(string, i) {
    var randChar = String.fromCharCode(
      randInt(64, 90)
    ); /*Numbers: 48-57 Al:64-90*/
    return string.substr(0, i) + randChar + string.substr(i + 1, string.length);
  }
}
function applyCode(doc, win, string, codes) {
  var len = codes.length;
  var elem = doc.createElement("span"),
    obfuscated = false;
  for (var i = 0; i < len; i++) {
    elem.style.cssText += styleMap[codes[i]] + ";";
    if (codes[i] === "§k") {
      obfuscate(doc, win, string, elem);
      obfuscated = true;
    }
  }
  if (!obfuscated) elem.innerHTML = string;
  return elem;
}
function parseStyle(doc, win, s) {
  var codes = s.match(/§.{1}/g) || [],
    indexes = [],
    apply = [],
    tmpStr,
    indexDelta,
    final = doc.createDocumentFragment(),
    len = codes.length;
  s = s.replace(/\n|\\n/g, "<br>");

  for (var i = 0; i < len; i++) {
    indexes.push(s.indexOf(codes[i]));
    s = s.replace(codes[i], "\x00\x00");
  }
  if (indexes[0] !== 0) {
    final.appendChild(applyCode(doc, win, s.substring(0, indexes[0]), []));
  }
  for (i = 0; i < len; i++) {
    indexDelta = indexes[i + 1] - indexes[i];
    if (indexDelta === 2) {
      while (indexDelta === 2) {
        apply.push(codes[i]);
        i++;
        indexDelta = indexes[i + 1] - indexes[i];
      }
      apply.push(codes[i]);
    } else {
      apply.push(codes[i]);
    }
    if (apply.lastIndexOf("§r") > -1) {
      apply = apply.slice(apply.lastIndexOf("§r") + 1);
    }
    tmpStr = s.substring(indexes[i], indexes[i + 1]);
    final.appendChild(applyCode(doc, win, tmpStr, apply));
  }
  return final;
}
// function clearObfuscators() {
//   var i = obfuscators.length;
//   for (; i--; ) {
//     clearInterval(obfuscators[i]);
//   }
//   obfuscators = [];
// }
module.exports = {
  replaceColorCodes(doc, win, str) {
    // clearObfuscators();
    var outputString = parseStyle(doc, win, String(str));
    return outputString;
  },
};

// /////////////////////////////////////////////////
// function cutString(str, cutStart, cutEnd) {
//   return str.substr(0, cutStart) + str.substr(cutEnd + 1);
// }
