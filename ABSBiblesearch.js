// Version 1.0.6
// Copyright 2013 American Bible Society
// Licensed under MIT.
// http://americanbible.github.io/biblesearch-api-js/
// https://github.com/americanbible/biblesearch-api-js
// http://bibles.org/pages/api

(function() {
  var _baseUrl = 'https://bibles.org/v2/';
  var _APIKey = '';
  var _lastError = '';
  var _fumsJs = '';
  var _fumsJsIncluded = false;
  var _fumsInterval = null;
  var _fumsInjectionSuppression = false;
  var _async = true;
  var _debug = false;

  function ABSBiblesearch() {}

  ABSBiblesearch.prototype.turnOnLogging = function() {
    _debug = true;
  };

  ABSBiblesearch.prototype.turnOffLogging = function() {
    _debug = false;
  };

  // ############################## KEY #################################
  /* Get your FREE API Key at http://bibles.org/pages/api/signup */
  ABSBiblesearch.prototype.setKey = function(key) {
    _APIKey = key;
  };

  ABSBiblesearch.prototype.getKey = function() {
    return _APIKey;
  };

  // ############################## ASYNC #################################
  /* We've found that using this inside an android simulator sometimes needs async turned off. */
  ABSBiblesearch.prototype.setAsync = function(async) {
    _async = async;
  };

  ABSBiblesearch.prototype.getAsync = function() {
    return _async;
  };

  // ############################## ERROR #################################
  ABSBiblesearch.prototype.lastError = function() {
    var e = _lastError;
    _lastError = '';
    return e;
  };

  // ################################## SEARCH ############################
  /*
        http://bibles.org/pages/api/documentation/search
        The BibleSearch API provides a general search endpoint. It accepts a query parameter that can be either a passage or a keyword and will automatically figure out what kind of query you've given it. If it's a keyword search, the results will be the same as a keyword search on the website: the parser performs stemming and also takes into account users' tags and 'Was this helpful?' votes.
    */
  ABSBiblesearch.prototype.search = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!options || !options.query) {
      _lastError = 'Please supply a query.';
      return false;
    }

    var url = _baseUrl + 'search.js?query=' + options.query;
    if (options.version) {
      url = url + '&version=' + options.version;
    }

    return this.json(url, callback);
  };

  // ##################################### VERSIONS #############################
  /*
        http://bibles.org/pages/api/documentation/versions
        Versions are the specific editions of the Bible such as the New International Version (NIV) or King James Version (KJV). Versions have many books.
    */
  ABSBiblesearch.prototype.versions = function(callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    return this.json(_baseUrl + 'versions.js', callback);
  };

  /*
        Returns a list of all books for the specified version. The available version IDs can be listed with the versions endpoint.
    */
  ABSBiblesearch.prototype.booksInVersion = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!options || !options.version || options.version === '') {
      _lastError = 'Must supply a version id.';
      return false;
    }

    var url = _baseUrl + 'versions/' + options.version + '/books.js';
    if (options.testament) {
      url = url + '?testament=' + options.testament;
    }
    return this.json(url, callback);
  };

  /*
        Returns a list of all versions specified by the language parameter. Use an ISO 639-2 abbreviation as the language parameter.
    */
  ABSBiblesearch.prototype.versionsByLanguage = function(language, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (language === null || language === '') {
      _lastError = 'Must supply a language.';
      return false;
    }

    return this.json(_baseUrl + 'versions.js?language=' + language, callback);
  };

  /*
        Returns information about a specific version. The available version IDs can be listed with the versions endpoint.
    */
  ABSBiblesearch.prototype.versionInformation = function(version, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (version === null || version === '') {
      _lastError = 'Must supply a version id.';
      return false;
    }

    return this.json(_baseUrl + 'versions/' + version + '.js', callback);
  };

  // ############################ BOOKS #############################
  /*
      http://bibles.org/pages/api/documentation/books
      These are the books of the Bible. Books belong to versions and to bookgroups, and books have many chapters.

        Returns the specified book resource in the specified version if one is given. The available version IDs can be listed with the versions endpoint. The book name should be specified with the OSIS normative abbreviation for the book.
    */
  ABSBiblesearch.prototype.book = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!options || !options.version || options.version === '') {
      _lastError = 'Must supply a version id.';
      return false;
    }

    if (!options || !options.book || options.book === '') {
      _lastError = 'Must supply a book id.';
      return false;
    }

    var url = _baseUrl + 'books/' + options.version + ':' + options.book + '.js';
    return this.json(url, callback);
  };

  /*
        Returns a list of all chapters for the specified book resource in the specified version. The available version IDs can be listed with the versions endpoint. The book ID is specified with the OSIS normative abbreviation for the book.
    */
  ABSBiblesearch.prototype.chaptersInBook = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!options || !options.version || options.version === '') {
      _lastError = 'Must supply a version id.';
      return false;
    }

    if (!options || !options.book || options.book === '') {
      _lastError = 'Must supply a book id.';
      return false;
    }

    var url = _baseUrl + 'books/' + options.version + ':' + options.book + '/chapters.js';
    return this.json(url, callback);
  };

  // ################################# CHAPTER #####################################
  /*
        http://bibles.org/pages/api/documentation/chapters
        Chapters are the sub-sections of a selected book. Chapters belong to books and have many verses.

        Returns the chapter specified by version, book, and chapter number. The available version IDs can be listed with the versions endpoint. The book ID is specified with the OSIS normative abbreviation for the book. The chapter number is a number that is a valid chapter in the book and version.  If you'd like to get crossreferences and footnotes set options.marginalia = true.
    */
  ABSBiblesearch.prototype.chapter = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!options || !options.version || options.version === '') {
      _lastError = 'Must supply a version id.';
      return false;
    }

    if (!options || !options.book || options.book === '') {
      _lastError = 'Must supply a book id.';
      return false;
    }

    if (!options || !options.chapter || options.chapter === '') {
      _lastError = 'Must supply a chapter number.';
      return false;
    }

    var url = _baseUrl + 'chapters/' + options.version + ':' + options.book + '.' + options.chapter + '.js';

    if (options && options.marginalia) {
      url += '?include_marginalia=' + options.marginalia;
    }

    return this.json(url, callback);
  };

  /*
        Returns a list of all verses for the chapter resource specified by version, book, and chapter number. The available version IDs can be listed with the versions endpoint. The book ID is specified with the OSIS normative abbreviation for the book. The chapter number is a number that is a valid chapter in the book and version.
    */
  ABSBiblesearch.prototype.chapterVerseList = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!options || !options.version || options.version === '') {
      _lastError = 'Must supply a version id.';
      return false;
    }

    if (!options || !options.book || options.book === '') {
      _lastError = 'Must supply a book id.';
      return false;
    }

    if (!options || !options.chapter || options.chapter === '') {
      _lastError = 'Must supply a chapter number.';
      return false;
    }

    var url = _baseUrl + 'chapters/' + options.version + ':' + options.book + '.' + options.chapter + '/verses.js';
    if (options.start || options.end) {
      url = url + '?';
    }
    if (options.start && options.start !== '') {
      url = url + 'start=' + options.start + '&';
    }
    if (options.end && options.end !== '') {
      url = url + 'end=' + options.end;
    }
    return this.json(url, callback);
  };

  // ################################# VERSES #####################################
  /*
        http://bibles.org/pages/api/documentation/verses
        Verses are the smallest unit of organization within the ABS Bible texts. Verses belong to chapters.

        You may append a number of optional parameters to filter the verses returned.  Only keyword is required.

        keyword: the words(s) you are searching for. This parameter must be provided.
        precision: may be “all” to return search results with all keywords or “any” to return search results where any keywords appear
        exclude: any keywords that should not appear in the search results
        spelling: may be “yes” to search for keywords like the terms you submitted if your keywords return no results
        version: may be one or several of the version “version” values
        language: may be one or several of version “language” values
        testament: may be one or several of the book “testament” values
        book: may be one or several of the book “abbreviation” values
        sort_order: may be either “canonical” or “relevance”
        offset: may be an integer to request records returned after this number of records. That is, if the offset is 1000, the records returned will start with the one thousand first record.
        limit: may be an integer to request a maximum number of records be returned. If provided, limit must be less than or equal to 500.
    */
  ABSBiblesearch.prototype.versesByKeyword = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!options || !options.keyword || options.keyword === '') {
      _lastError = 'Must supply a keyword.';
      return false;
    }

    var url = _baseUrl + 'verses.js?';
    for (var key in options) {
      url = url + key + '=' + options[key] + '&';
    }
    url = url.substring(0, url.length - 1);
    return this.json(url, callback);
  };

  /*
        Returns the specific verse resource with given version, book, chapter number, and verse number. The available version IDs can be listed with the versions endpoint. The book ID is specified with the OSIS normative abbreviation for the book. The chapter number is a number that is a valid chapter in the book and version. The verse number is a number that is a valid verse in the chapter and version.
    */
  ABSBiblesearch.prototype.versesByRef = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!options || !options.version || options.version === '') {
      _lastError = 'Must supply a version.';
      return false;
    }

    if (!options || !options.book || options.book === '') {
      _lastError = 'Must supply a book.';
      return false;
    }

    if (!options || !options.chapter || options.chapter === '') {
      _lastError = 'Must supply a chapter.';
      return false;
    }

    if (!options || !options.verse || options.verse === '') {
      _lastError = 'Must supply a verse.';
      return false;
    }

    var url = _baseUrl + 'verses/' + options.version + ':' + options.book + '.' + options.chapter + '.' + options.verse + '.js';
    return this.json(url, callback);
  };

  // ################################# PASSAGES #####################################
  /*
        http://bibles.org/pages/api/documentation/passages
        Returns a structured response containing a collection of references to passages specified by the q[] querystring parameter. One or more Bible versions may be specified by the version parameter. Misspelled book names or abbreviations will be corrected if possible.

        Multiple passage specifiers can be included in a comma-separated list. Examples: 'John+3', 'John+3-5', 'John+3:12', 'John+3:12-15', 'John+3,Luke+2'.

        The available version IDs can be listed with the versions endpoint. Multiple version IDs can be included in a comma-separated list. Examples: 'KJV', 'GNT,CEV'.

        It's important to note that the response only contains references to the passage(s), and a preview of the first three verses of the passage(s) themselves. To fetch the full Bible text of each passage you will need to use the verse api.
    */
  ABSBiblesearch.prototype.passages = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!options || !options.passages || options.passages === '') {
      _lastError = 'Must supply a passage.';
      return false;
    }

    var url = _baseUrl;
    if (options.version && options.version !== '') {
      url = url + options.version + '/';
    }
    url = url + 'passages.js?q[]=' + options.passages;
    return this.json(url, callback);
  };

  // ################################# BOOKGROUPS #####################################
  /*
        http://bibles.org/pages/api/documentation/bookgroups
        By convention, books of the Bible are often organized into groups, such as the Pentateuch or Gospels. Which books belong in a grouping can vary for different versions of the Bible, and may contain a different sequence than appear in a complete book list. Book groups have many books.
    */
  ABSBiblesearch.prototype.bookgroups = function(options, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    var url = _baseUrl + 'bookgroups';
    if (options && options.id && options.id !== '') {
      url = url + '/' + options.id;
    }
    url = url + '.js';
    return this.json(url, callback);
  };

  // ################################# FOLLOW #####################################
  /*
        On occasion you need to do a follow up json call with a specific url path that is given in a
        previous API call.
    */
  ABSBiblesearch.prototype.follow = function(path, callback) {
    if (_APIKey === '') {
      _lastError = 'API Key must be specified.';
      return false;
    }

    if (!path || path === '') {
      _lastError = 'No path specified';
      return false;
    }

    if (path.substr(0, 1) === '/') {
      path = path.substr(1);
    }
    var url = _baseUrl + path;
    return this.json(url, callback);
  };

  /*
    Ignore anything below this line.
    */

  // ################################# UTILS ######################################
  ABSBiblesearch.prototype.networkIsUp = function() {
    // If cordova environment has connection information available, make sure we're online.
    if (navigator.connection && (navigator.connection.type === 'unknown' || navigator.connection.type === 'none')) {
      if (_debug) {
        console.log('ABS - Network down');
      }
      return false;
    } else {
      if (_debug) {
        console.log('ABS - Network up');
      }
      return true;
    }
  };

  // ##################### TIMEOUT FUNCTION ###########################
  ABSBiblesearch.prototype.timeout = function() {
    console.log('ABS Biblesearch timeout');
  };

  // ###################### JSON ###########################
  ABSBiblesearch.prototype.json = function(url, callback, timeout) {
    if (_debug) {
      console.log('ABS json - url: ' + url);
    }

    callback = callback || function() {};

    if (!this.networkIsUp()) {
      if (_debug) {
        console.log('ABS json failed.  No network.');
      }
      _lastError = 'Network is not up.';
      return false;
    }

    var _xhr = new XMLHttpRequest();
    _xhr.onreadystatechange = function() {
      if (_debug) {
        console.log('ABS state: ' + _xhr.readyState);
      }
      if (_debug && _xhr.readyState === 4) {
        console.log('ABS status: ' + _xhr.status);
      }
      if (_xhr.readyState === 4 && _xhr.status === 200) {
        if (_debug) {
          console.log('ABS responseText: ' + _xhr.responseText);
        }
        var obj = window.plugins.absBiblesearch.parseJSON(_xhr.responseText + '');

        //FUMS - Fair Use Management.  See http://bibles.org/pages/api/documentation/fums
        window.plugins.absBiblesearch.setFumsJs(obj.response.meta.fums_js_include);
        window.plugins.absBiblesearch.addFums(obj.response.meta.fums_js);

        callback(obj);
      }
    };

    // This makes browser + ios happy when the api causes a 302 redirect.
    url = url.replace('//', '//' + _APIKey + ':x@');
    _xhr.open('GET', url, _async);
    // It seems that to make everyone happy you have to treat credentials in a slightly different fashion.  Thanks Android.
    if (navigator.userAgent.match(/Android/)) {
      _xhr.setRequestHeader('Authorization', 'Basic ' + btoa(_APIKey + ':x'));
    }
    _xhr.timeout = 10000;
    _xhr.ontimeout = timeout ? timeout : this.timeout;
    _xhr.send(null);

    return true;
  };

  ABSBiblesearch.prototype.parseJSON = function(data) {
    if (!data || typeof data !== 'string') {
      return null;
    }

    // Adapted from jQuery 1.8.2
    var rtrim = new RegExp('^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$', 'g');
    data = (data + '').replace(rtrim, '');

    return JSON.parse(data);
  };

  // ###################### FUMS #####################
  ABSBiblesearch.prototype.getFumsJs = function() {
    return _fumsJs;
  };

  ABSBiblesearch.prototype.setFumsJs = function(value) {
    _fumsJs = value;
  };

  // Mostly just for testing purposes
  ABSBiblesearch.prototype.getFumsJsIncluded = function() {
    return _fumsJsIncluded;
  };

  // Mostly just for testing purposes
  ABSBiblesearch.prototype.setFumsJsIncluded = function(value) {
    _fumsJsIncluded = value;
  };

  // Mostly just for testing purposes
  ABSBiblesearch.prototype.getFumsInterval = function() {
    return _fumsInterval;
  };

  // Mostly just for testing purposes
  ABSBiblesearch.prototype.setFumsInterval = function(value) {
    if (value === null && _fumsInterval !== null) {
      clearInterval(_fumsInterval);
    }
    _fumsInterval = value;
  };

  ABSBiblesearch.prototype.suppressFumsInjection = function(flag) {
    if (flag === null) {
      flag = true;
    }
    _fumsInjectionSuppression = flag;
  };

  ABSBiblesearch.prototype.injectFumsJs = function() {
    if (_fumsInjectionSuppression) {
      return false;
    }

    if (!_fumsJsIncluded && this.networkIsUp()) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.src = 'http://' + _fumsJs;
      script.id = 'FumsJs';
      head.insertBefore(script, head.firstChild);
      _fumsJsIncluded = true;
    }
    return _fumsJsIncluded;
  };

  // Store each FUMS item in localstorage for persistence.
  ABSBiblesearch.prototype.addFums = function(data) {
    // If only the fums id has been passed in, wrap it in the needed javascript.
    if (data.indexOf('var') !== 0) {
      data = 'var _BAPI=_BAPI||{};if(typeof(_BAPI.t)!=\'undefined\'){ _BAPI.t(\'' + data + '\'); }';
    }

    var _fums;
    if (localStorage.getItem('absFums') === null) {
      _fums = [];
    } else {
      _fums = JSON.parse(window.localStorage.getItem('absFums'));
    }
    _fums.push(data);
    window.localStorage.setItem('absFums', JSON.stringify(_fums));

    // Fire off the flush
    return window.plugins.absBiblesearch.flushFums();
  };

  // Shift off the first item in the fums array
  ABSBiblesearch.prototype.getFums = function() {
    var _fums;
    if (localStorage.getItem('absFums') === null) {
      return null;
    } else {
      _fums = JSON.parse(window.localStorage.getItem('absFums'));
    }

    var val = _fums.shift();
    if (_fums.length === 0) {
      window.localStorage.removeItem('absFums');
    } else {
      window.localStorage.setItem('absFums', JSON.stringify(_fums));
    }

    return val;
  };

  // Push all fums items into the DOM.
  ABSBiblesearch.prototype.flushFums = function() {
    if (!this.networkIsUp()) {
      _fumsInterval = setInterval(window.plugins.absBiblesearch.flushFums, 2 * 60 * 1000); // check back in 2 minutes.
      _lastError = 'Network is not up.';
      return false;
    }

    // If we're here because of a checkback, then clear the interval.
    if (_fumsInterval !== null) {
      clearInterval(_fumsInterval);
      _fumsInterval = null;
    }

    if (!this.injectFumsJs()) {
      _lastError = 'Fums js could not be injected.  This must happen first.';
      return false;
    }

    // We're ready.  Get the fums array from local storage.
    var _fums;
    if (localStorage.getItem('absFums') === null) {
      // There's nothing to push.  We're done.
      return true;
    } else {
      _fums = JSON.parse(window.localStorage.getItem('absFums'));
    }

    // For each fums item, push it into the DOM.
    for (i = 0; i < _fums.length; i++) {
      var script = document.createElement('script');
      script.innerHTML = _fums[i];
      document.body.appendChild(script);
    }

    // take _fums out of localstorage.
    window.localStorage.removeItem('absFums');
    return true;
  };

  // ################## INSTALL ############################
  if (!window.plugins) {
    window.plugins = {};
  }
  window.plugins.absBiblesearch = new ABSBiblesearch();

  return window.plugins.absBiblesearch;

})();