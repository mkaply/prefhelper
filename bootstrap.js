const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function install(aData, aReason) {
}

function uninstall(aData, aReason) {
}

function startup(aData, aReason) {
  Services.obs.addObserver(observer, "chrome-document-global-created", false);
}

function shutdown(data, reason) {
  Services.obs.removeObserver(observer, "chrome-document-global-created", false);
}

var observer = {
  observe: function observe(subject, topic, data) {
    switch (topic) {
      case "chrome-document-global-created":
        var win = subject.QueryInterface(Components.interfaces.nsIDOMWindow);
        win.addEventListener("load", function(event) {
          win.removeEventListener("load", arguments.callee, false);
          var doc = event.target;
          var url = doc.location.href.split("?")[0].split("#")[0];
          switch (url) {
            case "chrome://browser/content/preferences/in-content/preferences.xul":
            case "about:preferences":
              var prefs = doc.querySelectorAll("*[preference]");
              [...prefs].forEach(function (pref) {
                pref.style.color = "blue";
                pref.addEventListener("click", function(event) {
                  if (event.button == 2) {
                    Services.prompt.alert(win, "Pref Helper", pref.getAttribute("preference"));
                  }
                }, false);
              });
              break;
          }
        }, false);
        break;
    }
  }
}
