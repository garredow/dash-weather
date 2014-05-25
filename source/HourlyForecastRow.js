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

enyo.kind({
	name: "HourlyForecastRow",
	kind: "FittableColumns",
	classes: "hour-box",
	published: {
		hour: "12:00",
		icon: "na",
		temp: "0&deg;",
		forecast: "Unknown",
		precip: "0%",
		cloud: "100%"
	},
	components:[
		{name: "icon", classes: "icon"},
		{kind: "FittableRows", classes: "detail-box", fit: true, components: [
			{name: "hour", classes: "hour", allowHtml: true},
			{name: "forecast", classes: "forecast", allowHtml: true}
		]},
		{kind: "FittableRows", classes: "detail-box2", components: [
			{name: "precip", classes: "precip", allowHtml: true},
			{name: "cloud", classes: "cloud", allowHtml: true}
		]}
	],
	rendered: function() {
		this.inherited(arguments);

		this.$.hour.setContent(this.hour);
		this.$.icon.applyStyle("background-image", "url('assets/icons/" + appPrefs.icons + "/icon64/" + this.icon + ".png')");
		this.$.forecast.setContent(this.temp + " " + this.forecast);
		this.$.precip.setContent(this.precip);
		this.$.precip.applyStyle("background-image", "url('assets/icons/" + appPrefs.icons + "/icon24/rain.png')");
		this.$.cloud.setContent(this.cloud);
		this.$.cloud.applyStyle("background-image", "url('assets/icons/" + appPrefs.icons + "/icon24/cloudy.png')");
	}
});