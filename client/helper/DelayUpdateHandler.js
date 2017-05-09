// Create a delay that can be restarted when updated another time.
class DelayUpdateHandler {
  constructor(timeDelay, onDelay) {
    this.timer = {};  // time out handler
    this.timeDelay = timeDelay; // The time in milliseconds before the time out
    this.onDelay = onDelay; // Function that is run when time out is done.
  }

  // Starts/Restarts timeout
  update() {
    // If the timer exists, cancel it.
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(this.onDelay, this.timeDelay);
  }
}
