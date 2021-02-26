"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the MSM ${chalk.red("mephisto")} generator!`));
    this.answers = await this.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Project Name:",
        default: this.appname.replace(/\s/g, "-")
      },
      {
        type: "input",
        name: "stackName",
        message: "Stack Name:",
        default: this.appname.replace(/\s/g, "")
      },
      {
        type: "input",
        name: "initialVersion",
        message: "Initial Version:",
        default: "0.0.1"
      },
      {
        type: "input",
        name: "description",
        message: "Project Description:",
        default: `The ${this.appname} stack`
      },
      {
        type: "input",
        name: "author",
        message: "Author:",
        default: ""
      },
      {
        type: "list",
        name: "vertical",
        message: "Which Vertical is this for?:",
        choices: ["Insurance", "Money", "HomeServices", "Group", "MSE"]
      },
      {
        type: "input",
        name: "contactEmail",
        message: "Leave a contact address for your team:"
      },
      {
        type: "list",
        name: "awsRegion",
        message: "Which AWS region will this stack libe in?:",
        choices: ["eu-west-1", "eu-west-2"],
        default: "eu-west-1"
      },
      {
        type: "list",
        name: "runtime",
        message: "Which Node runtime will your Lambdas use?:",
        choices: ["nodejs12.x"],
        default: "nodejs12.x"
      },
      {
        type: "list",
        name: "language",
        message: "Which language do you wish to use?:",
        choices: ["JavaScript", "TypeScript"]
      },
      {
        type: "input",
        name: "timeout",
        message: "What is the timeout for your Lambda in seconds:",
        default: 3
      },
      {
        type: "input",
        name: "lambdaName",
        message: "Lambda Name:'",
        default: this.appname.replace(/\s/g, "")
      },
      {
        type: "input",
        name: "baseDomain",
        message: "What is the base domain",
        default: "tranmere-web.com"
      },
      {
        type: "input",
        name: "uriStem",
        message: `What is the uri stem for the lambda(s) e.g. http://some-domain/${this.appname.replace(
          /\s/g,
          "-"
        )}:`,
        default: `${this.appname.replace(/\s/g, "-")}`
      },
      {
        type: "list",
        name: "httpMethod",
        message: "What is the Http method?:",
        choices: ["get", "post", "put"]
      }
    ]);
  }

  writing() {
    if (this.answers.language === "JavaScript") {
      this.sourceRoot(this.sourceRoot() + "/javascript");
    } else {
      this.sourceRoot(this.sourceRoot() + "/typescript");
      this.answers.runtime = "NODEJS_12_X";
    }

    this.fs.copyTpl(this.templatePath(), this.destinationPath(), this.answers);
    const mv = (from, to) => {
      this.fs.move(this.destinationPath(from), this.destinationPath(to));
    };

    mv("_package.json", "package.json");
    mv("_gitignore", ".gitignore");

    if (this.answers.language === "JavaScript") {
      mv("_eslintignore", ".eslintignore");
      mv("src/lambdaName.js", `src/${this.answers.lambdaName}.js`);
      mv("github/workflows/main.yml", ".github/workflows/main.yml");
      mv("github/workflows/sit1.yml", ".github/workflows/sit1.yml");
      mv(
        "tests/unit/lambdaName.test.js",
        `tests/unit/${this.answers.lambdaName}.test.js`
      );
    } else {
      mv("bin/_stack.ts", `bin/${this.answers.stackName}.ts`);
      mv("lib/_stack-stack.ts", `lib/${this.answers.stackName}-stack.ts`);
      mv("src/lambdaName.ts", `src/${this.answers.lambdaName}.ts`);
      mv(
        "test/unit/lambdaName.test.ts",
        `test/unit/${this.answers.lambdaName}.test.ts`
      );
    }
  }

  install() {
    this.installDependencies({
      npm: { "save-dev": true },
      bower: false
    }).then(() => {
      "Project creation complete! Happy FaaSing!";
    });
  }
};
