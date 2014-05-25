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

/*
var appPrefs = {
	units: "optAuto",
	hours: "opt12hour",
	icons: "optIconsColor",
	theme: "optThemeDefault",
	loc: "gps",
	firstUse: true,
	locs: [
		{displayName: "Current Location", coords: "gps", active: true}
	]
};
*/

enyo.kind({
	name: "DashWeatherPlusWidget",
	kind: "FittableRows",
	classes: "main",
	fit: true,
	components:[
		{kind: "FittableColumns", classes: "header", components: [
			{name: "iconMain", classes: "icon", ontap: "refreshData"},
			{name: "currentTemp", classes: "temp", content: "00&deg;", allowHtml: true},
			{kind: "FittableRows", fit: true, classes: "status-box", components: [
				{name: "statusLine1", classes: "line1", content: "Dash Weather+", allowHtml: true},
				{name: "statusLine2", classes: "line2", content: "Getting location...", allowHtml: true}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.applyTheme(appPrefs.theme);
	},
	rendered: function() {
		this.inherited(arguments);
		this.refreshData();
	},
	openWeb: function() {
		window.open("http://forecast.io");
	},
	applyTheme: function(theme) {
		var head = document.getElementsByTagName("head")[0];

		// Remove any other theme stylesheets
		// console.log("Removing old theme sheets...");
		var themeList = ["optThemeLight", "optThemeHoloDark"];
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
		var request = new enyo.JsonpRequest({
			url: url
		});
		request.response(this, "gotWeatherData");
		request.go();
	},
	gotWeatherData: function(sender, response) {
		this.$.iconMain.applyStyle("background-image", "url('assets/icons/" + appPrefs.icons + "/icon64/" + response.currently.icon + ".png')");

		var temp = parseInt(response.currently.temperature, 10) + "&deg;";
		this.$.currentTemp.setContent(temp);

		var location = response.latitude + "," + response.longitude;
		this.getCityState(location);

		this.$.statusLine2.setContent(response.currently.summary);
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
			if (results[i].types[0] == "locality" || results[i].types[0] == "administrative_area_level_3")
				city = results[i].short_name;
			else if (results[i].types[0] == "administrative_area_level_1")
				state = results[i].short_name;
		}

		this.$.statusLine1.setContent(city + ", " + state);
	}
});