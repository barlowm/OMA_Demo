const gulp = require("gulp");
const request = require("request");
const inquirer = require("inquirer");
const config = require("config");
const fs = require("fs-extra");

const src = ["src/**/*.js","!node_modules/**"];
const compiled = ["dist/*.js", "!node_modules/**"];


 // Include gulp plugins - See http://andy-carter.com/blog/automatically-load-gulp-plugins-with-gulp-load-plugins
const plugins = require("gulp-load-plugins")();
// const concat = require("gulp-concat-util");




const Validate = function(variable, type, max) {
    if (/^\d*$/.test(variable)) {
        if (variable >= 0 && variable <= max) {
            return true;
        }
        else {
            console.log(`\n -- INValid ${type} # Entered - ${variable} (number must be between 0 and ${max}, inclusive)`);
        }
    }
    else {
        console.log(`\n -- INValid ${type} # Entered - ${variable} (must be a number between 0 and ${max}, inclusive)`);
    }
    return false;
}

const questions = [
  {
    type: "input",
    name: "ver",
    message: "What version (0-15)",
    validate: function(value) {
        return Validate(value, "Version", 15);
    }
  },
  {
    type: "input",
    name: "oc",
    message: "What OC (0-31)",
    validate: function(value) {
        return Validate(value, "OC", 31);
    }
  }
];

const Primary = function(done) {
    inquirer.prompt(questions).then(function (answers) {
        var Version = answers.ver;   // Version = 4 bits from 0 - 15, 10 = 1010
        var OC = answers.oc;         // OC = 5 bits from 0 - 31 so take OC #, shift 1 bit right then + (Version << 4) and then MSB of next byte
        var LSB = OC & 1;
        var Byte1 = (Version << 4) | (OC >>> 1);
        var Byte2 = LSB << 7;
        var theData = new Buffer([Byte1, Byte2]);
        var thePort = config.get("OMA_DM.port");
        var theRoute = config.get("OMA_DM.baseRoute");
        var URL = `http://localhost:${thePort}${theRoute}`;

        request.post({
            headers: {"content-type" : "application/octet-stream"},
            url:     URL,
            body:    theData
        }, function(error, response, body){
            console.log(`Sent header binary string to server ${Byte1.toString(2)} ${Byte2.toString(2)}`);
            if (response) {
                console.log(`Received from server - Status Code ${response.statusCode}; Message ${body}`);
            }
            else if ("ECONNREFUSED" === error.code) {
                console.log("No Response from Server");
            }else {
                console.log(error.code);
            }
        });
        done();
    });
}

const get = function(done) {
    inquirer.prompt(questions).then(function (answers) {
        var Version = answers.ver;   // Version = 4 bits from 0 - 15, 10 = 1010
        var OC = answers.oc;         // OC = 5 bits from 0 - 31 so take OC #, shift 1 bit right then + (Version << 4) and then MSB of next byte
        var LSB = OC & 1;
        var Byte1 = (Version << 4) | (OC >>> 1);
        var Byte2 = LSB << 7;
        var theData = new Buffer([Byte1, Byte2]);
        request.get({
            headers: {"content-type" : "application/octet-stream"},
            url:     "http://localhost:3000"
        }, function(error, response, body){
            console.log(`Sent header binary string to server ${theData}`);
            console.log(`Received from server - Status Code ${response.statusCode}; Message ${body}`);
        });
        done();
    });
}

const lint = function() {
    fs.ensureDirSync("reports");
    return gulp.src(src)
    .pipe(plugins.eslint({
        config: ".eslintrc"
    }))
    .pipe(plugins.eslint.format("html", fs.createWriteStream("reports/LintReport.html")));
}

const logging = function() {
  return gulp.src(src)
    .pipe(plugins.removeLogging({
    }))
    .pipe(gulp.dest("dist/"));
}

gulp.task("primary", (done) => {Primary(done)});
gulp.task("get", (done) => {get(done)});
gulp.task("lint", (done) => {lint(done)});
gulp.task("remove_logging", (done) => {logging(done)});

gulp.task("default", (done) => {
    var promptData = {
        "type" : "list",
        "name" : "action",
        "message" : "Select the action to perform",
        "default" : 0,
        "choices" : [
            "Default - Prompt for info and issue POST passing binary data to OMA Server",
            "Lint - Perform lint check on source code",
            "Build - Remove all console logging and push modified source to dist folder",
            "Get - Issue a simple getto the OMA server"
        ],
        filter: function(answer) {
            return answer.substring(0,1);
        }
    };
    inquirer.prompt(promptData).then(function(answer, done) {
            switch(answer.action) {
                case "D":
                    console.log("Running D");
                    Primary(done);
                    break
                case "L":
                    lint(done);
                    break
                case "B":
                    logging(done);
                    break
                case "G":
                    console.log("Running G");
                    get(done);
                    break
            }
            done();
    })
});