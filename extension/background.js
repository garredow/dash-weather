chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("index.html",
    { frame: "chrome",
      bounds: {
        width: 1000,
        height: 750
      },
      minWidth: 600,
      minHeight: 400
    }
  );
});