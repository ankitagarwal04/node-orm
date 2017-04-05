var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
  envs: ["browser", "mocha"],
  fix: true,
  rules: {
        semi: 2,
        quotes: [2, "double"]
    },
  useEslintrc: false
});

// lint myfile.js and all files in lib/
var report = cli.executeOnFiles(["*.js", "routes/"]);
// output fixes to disk
CLIEngine.outputFixes(report);