// Create a delay that can be restarted when updated another time.
class DelayUpdateHandler {
  constructor(timeDelay, onDelay, onUpdate) {
    this.timer = {};  // timer handler
    this.timeDelay = timeDelay; // The time in milliseconds before the time out
    this.onUpdate = onUpdate; // Function that is run the moment it is updated
    this.onDelay = onDelay; // Function that is run when time out is done.

    this.update = this.update.bind(this);
  }

  // Starts/Restarts timeout
  update() {
    // If the timer exists, cancel it.
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    // If there is an on update function, call it
    if (this.onUpdate) {
      this.onUpdate();
    }

    // Start timer
    this.timer = window.setTimeout(this.onDelay, this.timeDelay);
  }
}
