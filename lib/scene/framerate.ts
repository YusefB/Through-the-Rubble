export type FrameRateMonitorOptions = {
  windowMs: number
  onTier: (tier: number) => void
}

export type FrameRateMonitor = {
  start: () => void
  stop: () => void
}

const TIER_THRESHOLDS_MS = [16.7, 18.5, 25, 30, 40]

function tierForAvg(avgMs: number): number {
  for (let i = TIER_THRESHOLDS_MS.length - 1; i >= 0; i--) {
    if (avgMs >= TIER_THRESHOLDS_MS[i]!) return i
  }
  return 0
}

export function createFrameRateMonitor({
  windowMs,
  onTier,
}: FrameRateMonitorOptions): FrameRateMonitor {
  let running = false
  let lastTimestamp = 0
  let frameTimes: number[] = []
  let lastReportedTier = -1

  function frame(timestamp: number) {
    if (!running) return
    if (lastTimestamp !== 0) {
      const delta = timestamp - lastTimestamp
      frameTimes.push(delta)
      let totalMs = frameTimes.reduce((a, b) => a + b, 0)
      while (totalMs > windowMs && frameTimes.length > 1) {
        const removed = frameTimes.shift() ?? 0
        totalMs -= removed
      }
      if (frameTimes.length >= 30) {
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
        const tier = tierForAvg(avg)
        if (tier !== lastReportedTier) {
          lastReportedTier = tier
          onTier(tier)
        }
      }
    }
    lastTimestamp = timestamp
    requestAnimationFrame(frame)
  }

  return {
    start() {
      if (running) return
      running = true
      lastTimestamp = 0
      frameTimes = []
      lastReportedTier = -1
      requestAnimationFrame(frame)
    },
    stop() {
      running = false
    },
  }
}
