# biblesearch-api-js

The American Bible Society has produced this javascript library to ease the use of the Bible Search api located at http://bibles.org/pages/api.  The api (and this library) allow you to easily: 

* search the Bible
* locate specific passages
* get information about specific books, chapters, and verses
* do all that in specific versions or all versions

In addition ABS manages the version copyright requirements and keeping the textual data up to date with latest changes by the copyright owners/publishers.  Use of this library and the api is free to the public for non-commercial use.  See http://bibles.org/pages/api for additional information.

## Installation

This plugin is compatible with the new cordova plugin package management initiative (http://shazronatadobe.wordpress.com/2012/11/07/cordova-plugins-put-them-in-your-own-repo-2/).  If you have pluginstall (https://github.com/alunny/pluginstall) then install the plugin via that tool.  If you don't then follow these steps.

* Move the ABSBiblesearch.js file into your project.  You can keep this wherever you typically store your plugin js files.
* Add a script reference to the js file
* Add two hosts to your External Hosts white list to allow communication with the api.
 * *.bibles.org
 *	*.cloudfront.net
* Get an API key.  The key is free.  http://bibles.org/pages/api/signup

Unlike most plugins there is no native code, so you don't have to add this plugin to the phonegap plugin list or move code around.  

## Usage

