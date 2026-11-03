import { useTensionStore } from "@/store/useTensionStore";

let ctx: AudioContext | null = null;

/** Returns an audio context only when the user turned sound on. */
function audio(): AudioContext | null {
  if (typeof window === "undefined" || !useTensionStore.getState().soundOn) return null;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Feedback echo: the over-the-top reverb of old Dhallywood dubbing. */
function echoBus(ac: AudioContext, time = 0.18, feedback = 0.45): AudioNode {
  const input = ac.createGain();
  const delay = ac.createDelay(1);
  const fb = ac.createGain();
  delay.delayTime.value = time;
  fb.gain.value = feedback;
  input.connect(ac.destination);
  input.connect(delay).connect(fb).connect(delay);
  delay.connect(ac.destination);
  return input;
}

function tone(freq: number, duration = 0.12, type: OscillatorType = "square", volume = 0.04, delay = 0, out?: AudioNode, slideTo?: number) {
  const ac = audio();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(out ?? ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Filtered white-noise burst; sweeping the filter gives whooshes and hits. */
function noise(duration: number, volume: number, from: number, to: number, delay = 0, out?: AudioNode) {
  const ac = audio();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * duration), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(from, start);
  filter.frequency.exponentialRampToValueAtTime(to, start + duration);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter).connect(gain).connect(out ?? ac.destination);
  src.start(start);
}

// Optional user-supplied clips in /public/sounds/<name>.mp3 replace the synth versions.
const clipAvailable = new Map<string, Promise<boolean>>();

function playClip(name: string, fallback: () => void) {
  if (!audio()) return;
  let check = clipAvailable.get(name);
  if (!check) {
    check = fetch(`/sounds/${name}.mp3`, { method: "HEAD" })
      .then((r) => r.ok && (r.headers.get("content-type") ?? "").startsWith("audio"))
      .catch(() => false);
    clipAvailable.set(name, check);
  }
  void check.then((ok) => {
    if (!ok) return fallback();
    const el = new Audio(`/sounds/${name}.mp3`);
    el.volume = 0.8;
    el.play().catch(fallback);
  });
}

const synth = {
  /** "Dhan... dhan... DHAAAN" — the dramatic zoom-in sting, with echo. */
  drama: () => {
    const ac = audio();
    if (!ac) return;
    const bus = echoBus(ac, 0.22, 0.5);
    [0, 0.32].forEach((d) => {
      tone(98, 0.28, "sawtooth", 0.09, d, bus);
      tone(147, 0.28, "square", 0.04, d, bus);
      noise(0.2, 0.25, 300, 120, d, bus);
    });
    tone(73, 1.2, "sawtooth", 0.12, 0.66, bus);
    tone(110, 1.2, "square", 0.05, 0.66, bus);
    tone(880, 1.0, "triangle", 0.03, 0.66, bus, 830);
    noise(0.5, 0.35, 500, 80, 0.66, bus);
  },
  /** Movie fight punch. */
  dhishum: () => {
    const ac = audio();
    if (!ac) return;
    const bus = echoBus(ac, 0.12, 0.3);
    noise(0.12, 0.6, 2500, 400, 0, bus);
    tone(160, 0.25, "sine", 0.35, 0, bus, 45);
  },
  whoosh: () => noise(0.45, 0.22, 300, 3500),
  /** Ringing metal hit. */
  clang: () => {
    const ac = audio();
    if (!ac) return;
    const bus = echoBus(ac, 0.09, 0.35);
    [523, 1187, 1873, 2650].forEach((f, i) => tone(f, 1.1 - i * 0.2, "triangle", 0.06, 0, bus));
    noise(0.06, 0.5, 6000, 2000, 0, bus);
  },
  /** Short dry snap. */
  crack: () => {
    noise(0.05, 0.8, 3000, 900);
    noise(0.04, 0.6, 2200, 700, 0.06);
  },
  slap: () => {
    noise(0.08, 0.7, 4000, 1500);
    tone(220, 0.08, "triangle", 0.1);
  },
};

export const sfx = {
  pop: () => tone(660, 0.08, "triangle", 0.06),
  tick: () => tone(1200, 0.03, "square", 0.025),
  thud: () => {
    tone(90, 0.25, "sine", 0.2);
    tone(60, 0.3, "triangle", 0.12, 0.02);
  },
  siren: (cycles = 3) => {
    for (let i = 0; i < cycles; i++) {
      tone(880, 0.22, "sawtooth", 0.03, i * 0.45);
      tone(620, 0.22, "sawtooth", 0.03, i * 0.45 + 0.22);
    }
  },
  win: () => playClip("win", () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, "triangle", 0.05, i * 0.1))),
  fail: () => playClip("fail", () => [400, 320, 240].forEach((f, i) => tone(f, 0.2, "sawtooth", 0.04, i * 0.18))),
  drama: () => playClip("drama", synth.drama),
  dhishum: () => playClip("dhishum", synth.dhishum),
  whoosh: () => playClip("whoosh", synth.whoosh),
  slap: () => playClip("slap", synth.slap),
  clang: () => playClip("clang", synth.clang),
  crack: () => playClip("crack", synth.crack),
};
