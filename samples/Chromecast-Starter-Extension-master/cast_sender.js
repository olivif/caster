(function() {var __GCast_isChromeBrowser = window.chrome ? !0 : !1, chrome = window.chrome || {};
chrome.cast = chrome.cast || {};
chrome.cast.media = chrome.cast.media || {};
chrome.cast.ApiBootstrap_ = function() {
};
chrome.cast.ApiBootstrap_.extensionIds_ = "boadgeojelhgndaghljhdicfkmllpafd dliochdbjfkdbacpmhlcpmleaejidimm hfaagokkkhdbgiakmmlclaapfelnkoah fmfcbgogabcbclcofgocippekhfcmgfj enhhojjnijigcajfphajepfemndkmdlo eojlgccfgnjlphjnlopmadngcgmmdgpk".split(" ");
chrome.cast.ApiBootstrap_.MR_EXTENSION_IDS_ = ["jgemmmdkcmfbomjcnhkehaboplncaohk", "fjhoaacokmgbjemoflkofnenfaiekifl", "ekpaaapppgpmolpcldedioblbkmijaca", "lhkfccafpkdlaodkicmokbmfapjadkij", "ibiljbkambkbohapfhoonkcpcikdglop"];
chrome.cast.ApiBootstrap_.findInstalledExtension_ = function(callback) {
  __GCast_isChromeBrowser ? (window.navigator.presentation && (chrome.cast.ApiBootstrap_.extensionIds_ = chrome.cast.ApiBootstrap_.extensionIds_.concat(chrome.cast.ApiBootstrap_.MR_EXTENSION_IDS_)), chrome.cast.ApiBootstrap_.findInstalledExtensionHelper_(0, callback)) : callback(null);
};
chrome.cast.ApiBootstrap_.findInstalledExtensionHelper_ = function(index, callback) {
  index == chrome.cast.ApiBootstrap_.extensionIds_.length ? callback(null) : chrome.cast.ApiBootstrap_.isExtensionInstalled_(chrome.cast.ApiBootstrap_.extensionIds_[index], function(installed) {
    installed ? callback(chrome.cast.ApiBootstrap_.extensionIds_[index]) : chrome.cast.ApiBootstrap_.findInstalledExtensionHelper_(index + 1, callback);
  });
};
chrome.cast.ApiBootstrap_.getCastSenderUrl_ = function(extensionId) {
  return "chrome-extension://" + extensionId + "/cast_sender.js";
};
chrome.cast.ApiBootstrap_.isExtensionInstalled_ = function(extensionId, callback) {
  var xmlhttp = new XMLHttpRequest;
  xmlhttp.onreadystatechange = function() {
    4 == xmlhttp.readyState && 200 == xmlhttp.status && callback(!0);
  };
  xmlhttp.onerror = function() {
    callback(!1);
  };
  xmlhttp.open("GET", chrome.cast.ApiBootstrap_.getCastSenderUrl_(extensionId), !0); //extensionId
  xmlhttp.send();
};
chrome.cast.ApiBootstrap_.findInstalledExtension_(function(extensionId) {
  if (extensionId) {
    console.log("Found cast extension: " + extensionId);
    chrome.cast.extensionId = extensionId;
    var apiScript = document.createElement("script");
    apiScript.src = chrome.cast.ApiBootstrap_.getCastSenderUrl_(extensionId);
    (document.head || document.documentElement).appendChild(apiScript);
  } else {
    console.log("No cast extension found");
    var callback = window.__onGCastApiAvailable;
    callback && "function" == typeof callback && callback(!1, "No cast extension found");
  }
});
})();