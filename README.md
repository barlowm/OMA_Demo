# OMA
--- This repository has been archived ---

Sample OMA_DM Server that returns a Package #0


This has been tested using Node.JS version 5.7.0

**To install:**<br>
From a windows command line prompt run:<br>
- npm install

Once the node modules have been installed there are several GULP tasks which can be run from the command line prompt by typing "**gulp**":<br>
- **Lint** Perform lint check on source code (the result is in the reports folder, LintReport.html)<br>
- **Build** Remove all console logging and push modified source to dist folder<br>
- **Post** Prompt for info and issue POST passing binary data to OMA Server
this will prompt for a Ver# and OC# (done as a sanity check and test)<br>
- **Get** Issue a simple get to the OMA server

**Launch Server**<br>
To launch the server using the raw source, from a command line prompt type:<br>
- Node src\index.js<br>
Then from a separate command line window select either POST or GET from the gulp menu.

To launch the server using the Built source (which simply removes all console logs from the source), from a command line prompt type:<br>
- Node dist\index.js<br>
Then from a separate command line window select either POST or GET from the gulp menu.


**Note:**<br>
Default version # and option count values are stored in the config/default.json file as are any messages that are returned by the server.
