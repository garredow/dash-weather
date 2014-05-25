/*
	Copyright 2013 Garrett G Downs Jr

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

var appPrefs = {
	units: "optAuto",
	hours: "opt12hour",
	icons: "optIconsColor",
	theme: "optThemeDefault",
	animations: true,
	loc: "gps",
	firstUse: true,
	locs: [
		{displayName: "Current Location", coords: "gps", active: true}
	]
};

enyo.kind({
	name: "DashWeatherPlus",
	kind: "FittableRows",
	classes: "main",
	fit: true,
	components:[
		{kind: "FittableRows", fit: true, components: [
			{name: "tapScroller", classes: "tap-scroller", components: [
				{name: "tapScrollUp", classes: "up", ontap: "scrollIt"},
				{name: "tapScrollDown", classes: "down", ontap: "scrollIt"}
			]},
			{kind: "FittableColumns", classes: "header", components: [
				{name: "iconMain", classes: "icon", ontap: "refreshData"},
				{name: "currentTemp", classes: "temp", content: "00&deg;", allowHtml: true},
				{kind: "FittableRows", fit: true, classes: "status-box", components: [
					{name: "statusLine1", classes: "line1", content: "Dash Weather+", allowHtml: true},
					{name: "statusLine2", classes: "line2", content: "Getting location...", allowHtml: true}
				]},
				{classes: "header-blur"}
			]},
			{kind: "mochi.Panels", fit: true, classes: "tabs-container",  onTransitionStart: "panelChanged", narrowFit: true, index: 1, components: [
				{name: "tabNow", classes: "panel-container"},
				{name: "tabCurrently", kind: "FittableRows", classes: "panel-container", components: [
					{kind: "mochi.Header", classes: "tab-header", content: "Currently"},
					{name: "currentlyContainer", kind: "enyo.Scroller", strategyKind: "TranslateScrollStrategy", thumb: false, horizontal: "hidden", components: [
						{name: "weatherAlerts", kind: "FittableRows", showing: false},
						{name: "helpSettings", kind: "FittableRows", classes: "help-box", ontap: "closeHelpBox", components: [
							{classes: "title", content: "Did you know?"},
							{classes: "desc", content: "The Settings menu is the rightmost panel. Swipe left a few times to get to it."}
						]},
						{name: "warnCallLimit", kind: "FittableRows", classes: "help-box", ontap: "closeHelpBox", components: [
							{classes: "title", content: "Notice"},
							{classes: "desc", content: "Daily call limit reached; reverting to demo mode. Thanks for trying the live demo!"}
						]},
						{name: "sysWarning", classes: "system-warning"},
						{classes: "c-title", content: "Your Hour"},
						{name: "yourHour", classes: "c-desc"},
						{classes: "c-title", content: "Your Day"},
						{name: "yourDay", classes: "c-desc"},
						{classes: "c-title", content: "Your Week"},
						{name: "yourWeek", classes: "c-desc"},
						{classes: "c-title", content: "Right Now"},
						{name: "helpIcons", kind: "FittableRows", classes: "help-box", ontap: "closeHelpBox", components: [
							{classes: "title", content: "What are these icons?"},
							{kind: "FittableColumns", components: [
								{kind: "FittableRows", style: "width: 50%;", components: [
									{content: "- Precip Intensity"},
									{content: "- Cloud Cover"},
									{content: "- Wind"},
									{content: "- Visibility"}
								]},
								{kind: "FittableRows", style: "width: 50%; text-align: right;", components: [
									{content: "Sunrise -"},
									{content: "Sunset -"},
									{content: "Humidity -"},
									{content: "Pressure -"}
								]}
							]}
						]},
						{kind: "FittableColumns", components: [
							{kind: "FittableRows", classes: "currently-col", components: [
								{name: "elePrecip", kind: "CurrentlyElementL", icon: "rain", desc:"Precipitation"},
								{name: "eleCloud", kind: "CurrentlyElementL", icon: "cloudy", desc:"Cloud cover"},
								{name: "eleWind", kind: "CurrentlyElementL", icon: "wind", desc:"Wind"},
								{name: "eleVis", kind: "CurrentlyElementL", icon: "fog", desc:"Visibility"}
							]},
							{kind: "FittableRows", classes: "currently-col", components: [
								{name: "eleSun", kind: "CurrentlyElementR", icon: "clear-day", desc:"Sunrise"},
								{name: "eleMoon", kind: "CurrentlyElementR", icon: "clear-night", desc:"Sunset"},
								{name: "eleHumid", kind: "CurrentlyElementR", icon: "fog", desc:"Humidity"},
								{name: "eleBaro", kind: "CurrentlyElementR", icon: "temp", desc:"Barometer"}
							]}
						]},
						{classes: "powered-by", content: "Powered by Forecast.io", ontap: "openWeb"}
					]}
				]},
				{name: "tabHourly", kind: "FittableRows", classes: "panel-container", components: [
					{kind: "mochi.Header", classes: "tab-header", content: "Hourly"},
					{name: "hourlyContainer", kind: "enyo.Scroller", strategyKind: "TranslateScrollStrategy", thumb: false, horizontal: "hidden", fit: true, components: [
						{content: "Loading..."}
					]}
				]},
				{name: "tabDaily", kind: "FittableRows", classes: "panel-container", components: [
					{kind: "mochi.Header", classes: "tab-header", content: "Daily"},
					{name: "dailyContainer", kind: "enyo.Scroller", strategyKind: "TranslateScrollStrategy", thumb: false, horizontal: "hidden", fit: true, components: [
						{content: "Loading"}
					]}
				]},
				{name: "tabMenu", kind: "FittableRows", classes: "panel-container menu", components: [
					{kind: "mochi.Header", classes: "tab-header", content: "Menu"},
					{name: "menuContainer", kind: "enyo.Scroller", strategyKind: "TranslateScrollStrategy", thumb: false, horizontal: "hidden", fit: true, components: [
						{classes: "c-title", content: "Locations"},
						{name: "locationList", components: [
							// Locations get populated here
						]},
						{name: "prefLocRow", kind: "FittableColumns", classes: "settings-row", showing: false, components: [
							{kind: "mochi.InputDecorator", alwaysLooksFocused: true, components: [
							    {name: "prefLocInp", kind: "mochi.Input", placeholder: "\"City, State\" or Zip", style: "width: 200px;", fit: true},
							    {kind: "Image", src: "assets/search-input-search.png"}
							]}
						]},
						{kind: "mochi.Button", classes: "settings-button", content: "Add Location", ontap: "addLocation"},
						{style: "height: 25px;"},
						{classes: "c-title", content: "Settings"},
						{kind: "FittableColumns", classes: "settings-row", components: [
							{content: "Units", classes: "label", fit: true},
							{kind: "onyx.PickerDecorator", components: [
								{name: "prefUnitsButton", kind: "onyx.PickerButton", content: "Units", classes: "custom-picker"},
								{name: "prefUnitsPick", kind: "onyx.Picker", components: [
									{content: "Auto", name: "optAuto", active: true},
									{content: "Imperial", name: "optImperial"},
									{content: "Metric", name: "optMetric"}
								]}
							]}
						]},
						{kind: "FittableColumns", classes: "settings-row", components: [
							{content: "Time", classes: "label", fit: true},
							{kind: "onyx.PickerDecorator", components: [
								{name: "prefTimeButton", kind: "onyx.PickerButton", content: "Time", classes: "custom-picker"},
								{name: "prefTimePick", kind: "onyx.Picker", components: [
									{content: "12 hour", name: "opt12hour", active: true},
									{content: "24 hour", name: "opt24hour"}
								]}
							]}
						]},
						{kind: "FittableColumns", classes: "settings-row", components: [
							{content: "Icon Pack", classes: "label", fit: true},
							{kind: "onyx.PickerDecorator", components: [
								{name: "prefIconsButton", kind: "onyx.PickerButton", content: "Default", classes: "custom-picker"},
								{name: "prefIconsPick", kind: "onyx.Picker", components: [
									{content: "White", name: "optIconsWhite", active: true},
									{content: "Color", name: "optIconsColor"}
								]}
							]}
						]},
						{kind: "FittableColumns", classes: "settings-row", style: "display: none;", components: [
							{content: "Fancy Animations", classes: "label", fit: true},
							{name: "prefFancyAnimations", kind: "mochi.ToggleButton", onChange: "toggleChanged", value: true, colorActive: "#69cdff", colorInactive: "#777"},
						]},
						{kind: "FittableColumns", classes: "settings-row", style: "display: none;", components: [
							{content: "Theme", classes: "label", fit: true},
							{kind: "onyx.PickerDecorator", components: [
								{name: "prefThemeButton", kind: "onyx.PickerButton", content: "Default", classes: "custom-picker"},
								{name: "prefThemePick", kind: "onyx.Picker", components: [
									{content: "Default", name: "optThemeDefault", active: true},
									{content: "Light", name: "optThemeLight"},
									{content: "Holo Dark", name: "optThemeHoloDark"},
									{content: "Mochi", name: "optMochi"}
								]}
							]}
						]},
						{style: "height: 20px;"},
						{kind: "mochi.Button", classes: "settings-button", content: "Save and Apply", ontap: "saveAppPrefs"},
						{name: "btnLaunchWidget", kind: "mochi.Button", classes: "settings-button", content: "Launch Widget", showing: false, ontap: "launchWidget"},
						// {classes: "c-title", style: "margin-top: 20px;", content: "App"},
						// {kind: "onyx.WebAppButton", classes: "onyx-dark settings-button"},
						{kind: "mochi.Button", classes: "settings-button", content: "Show Help Boxes", ontap: "showHelpBoxes"},
						{style: "height:100px;"} // TODO: Fix for scroller
					]}
				]}
			]},
			{kind: "TabIndicator"},
			{kind: "FittableColumns", classes: "tab-bar", style: "display:none;", components: [
				// {name: "tabbarMenu", classes: "tab", content: "Menu", ontap: "switchTab"},
				{name: "tabbarCurrently", classes: "tab", content: "Currently", ontap: "switchTab"},
				{name: "tabbarHourly", classes: "tab", content: "Hourly", ontap: "switchTab"},
				{name: "tabbarDaily", classes: "tab", content: "Daily", ontap: "switchTab"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);

		if (enyo.platform.firefoxOS) {
			console.log("FirefoxOS detected.");
		}
		else if (enyo.platform.chrome) {
			console.log("Chrome detected.");
		}
		else if (enyo.platform.firefox) {
			console.log("Firefox detected.");
		}
		else if (enyo.platform.webos) {
			console.log("Platform: " + "webOS detected.");
			PalmSystem.stageReady();
			this.$.btnLaunchWidget.setShowing(true);
		}
		else {
			console.log("Unknown platform.");
			console.log(enyo.platform);
		}
	},
	rendered: function() {
		this.inherited(arguments);

		if (dwpDemoMode)
			console.log("Dash Weather+ is in DEMO MODE");

		this.requestRefresh = false;

		this.loadAppPrefs();

		this.$.panels.getAnimator().setDuration(300);
		this.refreshData();
	},
	openWeb: function() {
		window.open("http://forecast.io");
	},
	openAlert: function(sender) {
		window.open(sender.uri);
	},
	isChromeApp: function() { // TODO: Find a better way to determine if running as a Chrome packaged app.
		// this.log(chrome.storage);

		if (chrome.storage) {
			this.log("true");
			return true;
		} else {
			this.log("false");
			return false;
		}
	},
	saveAppPrefs: function(sender, refresh) {
		console.log("Saving app prefs...");

		// If prefUnitsPick or prefGpsPick is different, we need to call forecast.io for updated data
		var requestRefresh = false;
		if (refresh === true || (appPrefs.units != this.$.prefUnitsPick.getSelected().name)) {
			requestRefresh = true;
		}

		// Getting appPrefs updated and ready to be stored
		appPrefs.units = this.$.prefUnitsPick.getSelected().name;
		appPrefs.hours = this.$.prefTimePick.getSelected().name;
		appPrefs.icons = this.$.prefIconsPick.getSelected().name;
		appPrefs.theme = this.$.prefThemePick.getSelected().name;
		appPrefs.animations = this.$.prefFancyAnimations.getValue();

		var prefs = enyo.json.stringify(appPrefs);
		if(this.isChromeApp()) {
			chrome.storage.local.set({'appPrefs': prefs}, enyo.bind(this, function() {
				console.log('appPrefs saved');
			}));
		}
		else {
			window.localStorage.appPrefs = prefs;
		}

		if (sender && sender.content == "Save and Apply") {
			if (requestRefresh)
				this.refreshData();
			else
				this.gotWeatherData({}, this.lastWeatherResponse);

			this.applyTheme(appPrefs.theme);
		}
	},
	loadAppPrefs: function() {
		console.log("Loading app prefs...");

		if(this.isChromeApp()) {
			chrome.storage.local.get("appPrefs", enyo.bind(this, function(response){
				if(response.appPrefs)
					appPrefs = enyo.json.parse(response.appPrefs);
				this.gotAppPrefs();
			}));
		}
		else {
			if (window.localStorage.appPrefs) {
				appPrefs = enyo.json.parse(window.localStorage.appPrefs);
			}
			this.gotAppPrefs();
		}
	},
	gotAppPrefs: function() {
		this.$.prefUnitsPick.setSelected(this.$[appPrefs.units]);
		this.$.prefTimePick.setSelected(this.$[appPrefs.hours]);
		this.$.prefIconsPick.setSelected(this.$[appPrefs.icons]);
		this.$.prefThemePick.setSelected(this.$[appPrefs.theme]);
		this.$.prefFancyAnimations.setValue(appPrefs.animations);

		this.applyTheme(appPrefs.theme);

		if (appPrefs.firstUse === true) {
			this.showHelpBoxes();
			appPrefs.firstUse = false;
			this.saveAppPrefs();
		}

		this.populateLocations();
	},
	populateLocations: function() {
		this.$.locationList.destroyClientControls();
		for (i=0; i<appPrefs.locs.length; i++) {
			var classes;
			if (appPrefs.locs[i].active)
				classes = "location-row active";
			else
				classes = "location-row";

			this.$.locationList.createComponent({index: i, classes: classes, coords: appPrefs.locs[i].coords, content: appPrefs.locs[i].displayName, ontap: "selectLocation", onhold: "removeLocation", owner: this});
		}
		this.$.locationList.render();
	},
	selectLocation: function(sender) {
		for (i=0; i<appPrefs.locs.length; i++) {
			if (i == sender.index)
				appPrefs.locs[i].active = true;
			else
				appPrefs.locs[i].active = false;
		}

		appPrefs.loc = sender.coords;
		this.populateLocations();
		this.saveAppPrefs({content: "Save and Apply"}, true);
	},
	removeLocation: function(sender, event) {
		if (sender.index != 0) {
			appPrefs.locs.splice(sender.index, 1);
			this.saveAppPrefs();
			this.populateLocations();
		}
	},
	addLocation: function() {
		var inputShowing = this.$.prefLocRow.getShowing();
		if (!inputShowing) {
			this.$.prefLocRow.setShowing(true);
		}
		else {
			var query = this.$.prefLocInp.getValue();
			var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&sensor=true";
			var request = new enyo.Ajax({url: url});
			request.response(this, function(sender, response) {
				// console.log(response);
				if (response.status == "OK") {
					// Break down the response into a nice name
					var city, state, country = "";
					var results = response.results[0].address_components;
					for (i=0; i<results.length; i++) {
						if (results[i].types[0] == "locality" || results[i].types[0] == "administrative_area_level_3")
							city = results[i].short_name;
						else if (results[i].types[0] == "administrative_area_level_1")
							state = results[i].short_name;
						else if (results[i].types[0] == "country")
							country = results[i].short_name;
					}

					// Grab the gps coords
					var coords = response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng;

					// Add the new location to the list
					appPrefs.locs.push({displayName: city+", "+state, coords: coords, active: false});

					this.populateLocations();
					this.saveAppPrefs();
				}
				else {
					this.$.statusLine2.setContent("Error: Location not found");
				}
			});
			request.go();
			this.$.prefLocRow.setShowing(false);
		}
		// this.$.prefLocRow.applyStyle("display", "block");
	},
	applyTheme: function(theme) {
		var head = document.getElementsByTagName("head")[0];

		// Remove any other theme stylesheets
		// console.log("Removing old theme sheets...");
		var themeList = ["optThemeLight", "optThemeHoloDark", "optMochi"];
		var appsheets = document.getElementsByTagName("link");
		for (i=0; i < appsheets.length; i++) {
			var sheet = appsheets[i];
			for (a=0; a<themeList.length; a++) {
				var findTheme = sheet.href.search(themeList[a]);
				if (findTheme > -1) {
					console.log("Removing theme: " + themeList[a]);
					head.removeChild(sheet);
				}
			}
		}

		if (theme != "optThemeDefault") {
			// Add the new theme stylesheet
			console.log("Adding new theme stylesheet: " + theme);
			var e = document.createElement("link");
			e.setAttribute("rel",	"stylesheet");
			e.setAttribute("type",	"text/css");
			e.setAttribute("href",	"assets/" + theme + ".css");

			head.appendChild(e);
		}
	},
	refreshData: function() {
		this.getLocation();
	},
	getLocation: function() {
		// appPrefs.loc = 19040;
		// console.log("Demo Mode: " + dwpDemoMode);
		if (dwpDemoMode) {
			var url = "assets/demo.json";
			var request = new enyo.Ajax({
					url: url
				});
			request.response(this, "gotWeatherData");
			request.go();
		}
		else {
			this.$.statusLine2.setContent("Requesting location...");
			if (appPrefs.loc != "gps") {
				var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + appPrefs.loc + "&sensor=true";
				var request = new enyo.Ajax({url: url});
				request.response(this, function(sender, response) {
					// console.log(response);
					if (response.status == "OK") {
						var location = response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng;
						this.getWeatherData(location);
					}
					else {
						this.$.statusLine2.setContent("Error: Location not found");
					}
				});
				request.go();
			}
			else {
				navigator.geolocation.getCurrentPosition(enyo.bind(this, function(position) {
					var location = position.coords.latitude + "," + position.coords.longitude;
					// console.log("GPS location: " + location);
					this.getWeatherData(location);
				}));
			}
		}
	},
	switchTab: function(sender, event) {
		if (sender.name == "tabbarMenu")
			this.$.panels.setIndex(0);
		else if (sender.name == "tabbarCurrently")
			this.$.panels.setIndex(1);
		else if (sender.name == "tabbarHourly")
			this.$.panels.setIndex(2);
		else
			this.$.panels.setIndex(3);
	},
	panelChanged: function(sender, event) {
		if (event.fromIndex == 3)
			this.$.prefLocRow.setShowing(false);

		if (!appPrefs.animations) {
			this.log("No fancy animations.");
			return;
		}

		switch (event.toIndex) {
			case 1:
				this.$.tabCurrently.addRemoveClass("blur-panel", false);
				this.$.tabHourly.addRemoveClass("blur-panel", false);
				this.$.tabDaily.addRemoveClass("blur-panel", false);
				this.$.currentlyContainer.addRemoveClass("blur-panel-content", false);
				this.$.hourlyContainer.addRemoveClass("blur-panel-content", false);
				this.$.dailyContainer.addRemoveClass("blur-panel-content", false);
				break;
			case 2:
				this.$.tabCurrently.addRemoveClass("blur-panel", true);
				this.$.tabHourly.addRemoveClass("blur-panel", false);
				this.$.tabDaily.addRemoveClass("blur-panel", false);
				this.$.currentlyContainer.addRemoveClass("blur-panel-content", true);
				this.$.hourlyContainer.addRemoveClass("blur-panel-content", false);
				this.$.dailyContainer.addRemoveClass("blur-panel-content", false);
				break;
			case 3:
				this.$.tabCurrently.addRemoveClass("blur-panel", true);
				this.$.tabHourly.addRemoveClass("blur-panel", true);
				this.$.tabDaily.addRemoveClass("blur-panel", false);
				this.$.currentlyContainer.addRemoveClass("blur-panel-content", true);
				this.$.hourlyContainer.addRemoveClass("blur-panel-content", true);
				this.$.dailyContainer.addRemoveClass("blur-panel-content", false);
				break;
			case 4:
				this.$.tabCurrently.addRemoveClass("blur-panel", true);
				this.$.tabHourly.addRemoveClass("blur-panel", true);
				this.$.tabDaily.addRemoveClass("blur-panel", true);
				this.$.currentlyContainer.addRemoveClass("blur-panel-content", true);
				this.$.hourlyContainer.addRemoveClass("blur-panel-content", true);
				this.$.dailyContainer.addRemoveClass("blur-panel-content", true);
				break;
		}


		// var newPanel = event.toIndex - 1;
		// this.$.tabIndicator.setPosition(newPanel);
		
	},
	getWeatherData: function(location) {
		this.$.statusLine2.setContent("Getting forecast...");

		var myLoc = location || dwpDemoLoc;
		var units;
		switch (appPrefs.units) {
			case "optImperial":
				units = "us";
				break;
			case "optMetric":
				units = "si";
				break;
			default:
				units = "auto";
				break;
		};

		var url = "https://api.forecast.io/forecast/"+dwpApiKey+"/"+myLoc+"?&units="+units;

		if(this.isChromeApp()) {
			var request = new enyo.Ajax({
				url: url
			});
		}
		else {
			var request = new enyo.JsonpRequest({
				url: url
			});
		}
		
		request.response(this, "gotWeatherData");
		request.go();
	},
	gotWeatherData: function(sender, response) {
		this.log(response);
		this.lastWeatherResponse = response;
		this.$.sysWarning.setContent("");

		this.applyStyle("background-image", "url('assets/backgrounds/" + response.currently.icon + ".jpg')");

		// ---------- Set up the widget header ----------

		this.$.iconMain.applyStyle("background-image", "url('assets/icons/" + appPrefs.icons + "/icon64/" + response.currently.icon + ".png')");

		// Get current temperature
		var temp = parseInt(response.currently.temperature, 10) + "&deg;";
		this.$.currentTemp.setContent(temp);

		// Use Google to get the city and state name
		var location = response.latitude + "," + response.longitude;
		this.getCityState(location);

		// Get the current conditions
		this.$.statusLine2.setContent(response.currently.summary);

		// ---------- Set up the 'Currently' tab ----------

		this.$.elePrecip.updateIcon();
		this.$.eleCloud.updateIcon();
		this.$.eleWind.updateIcon();
		this.$.eleVis.updateIcon();
		this.$.eleSun.updateIcon();
		this.$.eleMoon.updateIcon();
		this.$.eleHumid.updateIcon();
		this.$.eleBaro.updateIcon();

		// Check for severe weather alerts
		var alert;
		var hasAlerts = false;
		try {
			alert = response.alerts;
			if (alert.length > 0)
				hasAlerts = true;
		}
		catch (err) {
			// Do nothing
		}

		this.$.weatherAlerts.destroyClientControls();
		if (hasAlerts) {
			for(var i=0; i<alert.length; i++) {
				this.$.weatherAlerts.createComponent({classes: "alert", content: alert[i].title, uri: alert[i].uri, ontap: "openAlert", owner: this});
			}
			this.$.weatherAlerts.setShowing(true);
			this.$.weatherAlerts.render();
		}
		else {
			this.$.weatherAlerts.setShowing(false);
		}

		// Depending on the quality of the API in your area, some info in the response may not be included.
		var description;
		try {
			description = response.minutely.summary;
		}
		catch (err) {
			description = "Unable to retrieve this information.";
		}
		this.$.yourHour.setContent(description);

		try {
			description = response.hourly.summary;
		}
		catch (err) {
			description = "Unable to retrieve this information.";
		}
		this.$.yourDay.setContent(description);

		try {
			description = response.daily.summary;
		}
		catch (err) {
			description = "Unable to retrieve this information.";
		}
		this.$.yourWeek.setContent(description);

		var now = response.currently;

		// Get precipitation intesnity
		var precip = now.precipIntensity;
		if (precip === 0)
			precip = "None";
		else if (precip < 0.002)
			precip = "Sprinkling";
		else if (precip < 0.017)
			precip = "Light";
		else if (precip < 0.1)
			precip = "Moderate";
		else
			precip = "Heavy";
		this.$.elePrecip.setDesc(precip);

		// Get cloud cover
		var clouds = parseInt(now.cloudCover * 100) + "<span class='label-units'>%</span>";
		this.$.eleCloud.setDesc(clouds);

		// Get wind speed and direction
		var wind;
		var windSpeed = parseInt(now.windSpeed);
		var windBearing;

		if(now.windBearing === 0)
			windBearing = "Var";
		else if (now.windBearing >= 338 || now.windBearing <= 22)
			windBearing = "N";
		else if (now.windBearing >= 23 && now.windBearing <= 67)
			windBearing = "NE";
		else if (now.windBearing >= 68 && now.windBearing <= 112)
			windBearing = "E";
		else if (now.windBearing >= 113 && now.windBearing <= 157)
			windBearing = "SE";
		else if (now.windBearing >= 158 && now.windBearing <= 202)
			windBearing = "S";
		else if (now.windBearing >= 203 && now.windBearing <= 247)
			windBearing = "SW";
		else if (now.windBearing >= 248 && now.windBearing <= 292)
			windBearing = "W";
		else if (now.windBearing >= 293 && now.windBearing <= 337)
			windBearing = "NW";
		else
			windBearing = "?";

		if (response.flags.units == "us") {
			wind = windBearing + " at " + windSpeed + "<span class='label-units'>mph</span>";
		}
		else {
			wind = windBearing + " at " + windSpeed + "<span class='label-units'>m/s</span>";
		}

		this.$.eleWind.setDesc(wind);

		// Get visibility
		var vis = now.visibility;

		if (response.flags.units == "us") {
			vis += "<span class='label-units'>mi</span>";
		}
		else {
			vis += "<span class='label-units'>km</span>";
		}

		this.$.eleVis.setDesc(vis);

		// Get sunrise time
		var sunrise = new Date(response.daily.data[0].sunriseTime * 1000);
		sunrise = this.formatTime(sunrise.getHours(), sunrise.getMinutes());
		this.$.eleSun.setDesc(sunrise);

		// Get sunset time
		var sunset = new Date(response.daily.data[0].sunsetTime * 1000);
		sunset = this.formatTime(sunset.getHours(), sunset.getMinutes());
		this.$.eleMoon.setDesc(sunset);

		// Get humidity
		var humid = parseInt(now.humidity * 100, 10) + "<span class='label-units'>%</span>";
		this.$.eleHumid.setDesc(humid);

		// Get barometric pressure
		var pressure = parseInt(now.pressure, 10) + "<span class='label-units'>mb</span>";
		this.$.eleBaro.setDesc(pressure);

		// ---------- Set up the 'Hourly' tab ----------

		this.$.hourlyContainer.destroyClientControls();
		var hourly = response.hourly.data;
		for (i=0; i<12; i++) {
			// Get the hour
			var time = hourly[i].time * 1000;
			var hour = new Date(time).getHours();
			hour = this.formatTime(hour);

			// Get the icon
			var icon = hourly[i].icon;

			// Get the temperature
			var temp = parseInt(hourly[i].temperature, 10);
			temp += "&deg;";

			// Get the forecast
			var forecast = hourly[i].summary;

			// Get the precipitation
			var precip = "0";
			if (hourly[i].precipIntensity !== 0) {
				precip = parseInt(hourly[i].precipProbability * 100, 10) + "<span class='label-units'>%</span>";
			}

			// Get cloud cover
			var cloud = parseInt(hourly[i].cloudCover * 100, 10) + "<span class='label-units'>%</span>";

			// Create a new HourlyForecast row
			this.$.hourlyContainer.createComponent({kind: "HourlyForecastRow", hour: hour, icon: icon, temp: temp, forecast: forecast, precip: precip, cloud: cloud});
		}

		this.$.hourlyContainer.createComponent({style: "height: 100px;"}); // TODO: Temp fix for scroller

		// ---------- Set up the 'Daily' tab ----------

		this.$.dailyContainer.destroyClientControls();
		var daily = response.daily.data;
		for (i=0; i<daily.length; i++) {
			// Get the icon
			var icon = daily[i].icon;

			// Get the high and low temperatures
			var high = parseInt(daily[i].temperatureMax, 10) + "&deg;";
			var low = parseInt(daily[i].temperatureMin, 10) + "&deg;";

			// Get the date and properly format it
			var d = new Date(daily[i].time * 1000);
			var day = d.getDay();
			var month = d.getMonth();
			var datenum = d.getDate();

			var d_names = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
			var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

			var date = d_names[day] + ", " + m_names[month] + " " + datenum;

			// Get the forecast
			var forecast = daily[i].summary;

			// Create a new DailyForecast row
			this.$.dailyContainer.createComponent({kind: "DailyForecastRow", icon: icon, high: high, low: low, date: date, forecast: forecast});
		}

		this.$.dailyContainer.createComponent({style: "height: 100px;"}); // TODO: Temp fix for scroller

		// Make it so
		this.$.hourlyContainer.render();
		this.$.dailyContainer.render();
		// this.$.hourlyContainer.resized();
		// this.$.panels.resized();
	},
	getCityState: function(location) {
		var request = new enyo.Ajax({url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+ location + "&sensor=true"});
		request.response(this, function(sender, response) {
			this.gotCityState(response);
		});
		request.go();
	},
	gotCityState: function(response) {
		var results = response.results[0].address_components;
		// console.log(results);

		var city = "";
		var state = "";

		for (i=0; i<results.length; i++) {
			// console.log(results[i].types[0] + ": " + results[i].short_name + " / " + results[i].long_name);
			if (results[i].types[0] == "locality" || results[i].types[0] == "administrative_area_level_3")
				city = results[i].short_name;
			else if (results[i].types[0] == "administrative_area_level_1")
				state = results[i].short_name;
		}

		this.$.statusLine1.setContent(city + ", " + state);
	},
	formatTime: function(h,m) {
		// This does stuff...
		var ampm, time;

		if(!m)
			m = 0;

		if (m < 10)
			m = "0" + m;

		if (appPrefs.hours == "opt24hour") {
			time = h + ":" + m;
		}
		else {
			if (h >= 12)
				ampm = "pm";
			else
				ampm = "am";

			if (h > 12)
				h -= 12;
			else if (h === 0)
				h = 12;

			time = h + ":" + m + "<span class='label-units'>" + ampm + "</span>";
		}

		return(time);
	},
	showHelpBoxes: function() {
		this.$.helpSettings.applyStyle("display", "block");
		this.$.helpIcons.applyStyle("display", "block");
	},
	closeHelpBox: function(sender) {
		this.$[sender.name].applyStyle("display", "none");
	},
	// webOS widget stuff
	launchWidget: function() {
		window.open("widget.html", "dwpWidget", 'attributes={"window": "dashboard", "dashHeight": 320}');
	},
	scrollIt: function(sender, event) {
		var tab = this.$.panels.getActive();
		var pos = tab.getScrollTop();
		var newPos = pos;
		if (sender.name == "tapScrollUp") {
			newPos -= 100;
			tab.scrollTo(0, newPos);
		}
		else {
			newPos += 100;
			tab.scrollTo(0, newPos);
		}
	}
});