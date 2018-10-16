const classes = {};
classes.HelpError = class HelpError extends Error {
  constructor(message, command) {
    super(message);
    this.name = this.constructor.name;
    this.command = command;
  }

}; //

module.exports = classes;