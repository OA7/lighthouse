/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const lighthouse = require('../lighthouse-core/index.js');
const RawProtocol = require('../lighthouse-core/gather/connections/raw.js');
const log = require('lighthouse-logger');
const {registerLocaleData, lookupLocale} = require('../lighthouse-core/lib/i18n/i18n.js');

/** @typedef {import('../lighthouse-core/gather/connections/connection.js')} Connection */

/**
 * Return a version of the default config, filtered to only run the specified
 * categories.
 * @param {Array<string>} categoryIDs
 * @return {LH.Config.Json}
 */
function getDefaultConfigForCategories(categoryIDs) {
  return {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: categoryIDs,
    },
  };
}

/**
 * @param {RawProtocol.Port} port
 * @returns {RawProtocol}
 */
function setUpWorkerConnection(port) {
  return new RawProtocol(port);
}

/** @param {(status: [string, string, string]) => void} listenCallback */
function listenForStatus(listenCallback) {
  log.events.addListener('status', listenCallback);
}

// For the bundle smoke test.
if (typeof module !== 'undefined' && module.exports) {
  // Ideally this could be exposed via browserify's `standalone`, but it doesn't
  // work for LH because of https://github.com/browserify/browserify/issues/968
  // Instead, since this file is only ever run in node for testing, expose a
  // bundle entry point as global.
  // @ts-ignore
  global.runBundledLighthouse = lighthouse;
}

// Expose only in DevTools' worker
// @ts-ignore
if (typeof self !== 'undefined') {
  // @ts-ignore
  self.setUpWorkerConnection = setUpWorkerConnection;
  // @ts-ignore
  self.runLighthouse = lighthouse;
  // @ts-ignore
  self.getDefaultConfigForCategories = getDefaultConfigForCategories;
  // @ts-ignore
  self.listenForStatus = listenForStatus;
  // @ts-ignore
  self.registerLocaleData = registerLocaleData;
  // @ts-ignore
  self.lookupLocale = lookupLocale;
}
