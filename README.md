# biblesearch-api-js

The American Bible Society has produced this javascript library to ease the use of the Bible Search api (http://bibles.org/pages/api) in web/cordova/phonegap applications.  The api (and this library) allow you to easily:

* search the Bible
* locate specific passages
* get information about specific books, chapters, and verses
* do all that in one or more versions
* store nothing locally

In addition ABS manages the version copyright requirements and keeping the textual data up to date with latest changes by the copyright owners/publishers.  Use of this library and the api is free to the public for non-commercial use.  See http://bibles.org/pages/api for additional information.

## Installation

To install this plugin in a cordova/phonegap app, follow the [Command-line Interface Guide](http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-line%20Interface).

    cordova plugin add https://github.com/americanbible/biblesearch-api-js.git

If you are not using the Cordova Command-line Interface, follow [Using Plugman to Manage Plugins](http://cordova.apache.org/docs/en/edge/guide_plugin_ref_plugman.md.html).

    plugman --platform ios --project platforms/ios/ --plugin https://github.com/americanbible/biblesearch-api-js.git

If you want to use this in a non-cordova web app then just include the script appropriately for your application.  It can be easily loaded via require.js with no problems, or just add it via a standard script tag wherever you want.  The script will create an object at plugins.absBiblesearch (which is normal for phonegap).

You will also need to get a free api key at http://bibles.org/pages/api/signup.

## Usage

In your javascript:

	var bsearch = plugins.absBiblesearch; // just to make access easier.
	bsearch.setKey(/*your API key goes here*/); // just do this once in your app initialization

	// at this point you are ready to make api calls.
	if (!bsearch.versionsByLanguage('eng-US', function(data) {
		// data will now contain a JSON object.  To see an example of the content see the api documentation.
        for (var i = 0; i < data.response.versions.length; i++) {
            var version = data.response.versions[i];
            alert(version.version + ': ' + version.name);
        }
    })) {
        alert('error: ' + bsearch.lastError());
    }

## API & Key

You can get additional details on the api at http://bibles.org/pages/api.

## Comments and Complaints

If you have any issues you can let us know by email at mbradshaw@americanbible.org.

## Changelog

v1.0.4 - Update for cordova v3 plugin architecture.
v1.0.3 - Fix asynchronous credential issue
