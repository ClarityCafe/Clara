const jasmine = require("jasmine");
const fs = require("fs");
const Promise = require("bluebird");
const cp = require('child_process');
const path = require('path');
const logger = require(`${__dirname}/logger.js`);

jasmine.describe("loadCommandsTest", () => {
 
jasmine.it("expectations_vs_reality", () => {

    expect(awau).toBe("pass");
    expect(awoo).toBe("faille");
})