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
	name: "CurrentlyElementL",
	kind: "FittableColumns",
	classes: "currently-element left",
	published: {
		icon: "na",
		desc: "0"
	},
	components:[
		{name: "icon", classes: "icon"},
		{name: "desc", classes: "desc", allowHtml: true}
	],
	updateIcon: function() {
		this.$.icon.applyStyle("background-image", "url('assets/icons/" + appPrefs.icons + "/icon24/" + this.icon + ".png')");
	},
	rendered: function() {
		this.inherited(arguments);

		this.$.icon.applyStyle("background-image", "url('assets/icons/" + appPrefs.icons + "/icon24/" + this.icon + ".png')");
		this.$.desc.setContent(this.desc);
	},
	descChanged: function() {
		this.$.desc.setContent(this.desc);
	}
});

enyo.kind({
	name: "CurrentlyElementR",
	kind: "FittableColumns",
	classes: "currently-element right",
	published: {
		icon: "na",
		desc: "0"
	},
	components:[
		{name: "desc", classes: "desc", allowHtml: true},
		{name: "icon", classes: "icon"}
	],
	updateIcon: function() {
		this.$.icon.applyStyle("background-image", "url('assets/icons/" + appPrefs.icons + "/icon24/" + this.icon + ".png')");
	},
	rendered: function() {
		this.inherited(arguments);

		this.$.icon.applyStyle("background-image", "url('assets/icons/" + appPrefs.icons + "/icon24/" + this.icon + ".png')");
		this.$.desc.setContent(this.desc);
	},
	descChanged: function() {
		this.$.desc.setContent(this.desc);
	}
});