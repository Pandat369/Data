  window.CP = window.CP || {};
  window.CP.PenTimer = {
    programNoLongerBeingMonitored: false,
    timeOfFirstCallToShouldStopLoop: 0,
    _loopExits: {},
    _loopTimers: {},
    START_MONITORING_AFTER: 2000,
    STOP_ALL_MONITORING_TIMEOUT: 5000,
    MAX_TIME_IN_LOOP_WO_EXIT: 2200,
  
    exitedLoop(loopId) {
      this._loopExits[loopId] = true;
    },
  
    shouldStopLoop(loopId) {
      if (this.programKilledSoStopMonitoring) return true;
      if (this.programNoLongerBeingMonitored || this._loopExits[loopId]) return false;
  
      const now = Date.now();
  
      if (this.timeOfFirstCallToShouldStopLoop === 0) {
        this.timeOfFirstCallToShouldStopLoop = now;
        return false;
      }
  
      const elapsed = now - this.timeOfFirstCallToShouldStopLoop;
  
      if (elapsed < this.START_MONITORING_AFTER) return false;
      if (elapsed > this.STOP_ALL_MONITORING_TIMEOUT) {
        this.programNoLongerBeingMonitored = true;
        return false;
      }
  
      if (!this._loopTimers[loopId]) {
        this._loopTimers[loopId] = now;
      } else if (now - this._loopTimers[loopId] > this.MAX_TIME_IN_LOOP_WO_EXIT) {
        throw new Error("Infinite loop detected in loop: " + loopId);
      }
  
      return false;
    },
  };
  
  window.CP.shouldStopExecution = function (loopId) {
    const shouldStop = window.CP.PenTimer.shouldStopLoop(loopId);
    if (shouldStop) {
      console.warn(" ");
    }
    return shouldStop;
  };
  
  window.CP.exitedLoop = function (loopId) {
    window.CP.PenTimer.exitedLoop(loopId);
  };
  