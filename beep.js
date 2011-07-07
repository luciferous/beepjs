(function(ns) {
var utils = {
    amplify: function(gain) {
        return function(sample) {
            return sample * gain; 
        };
    },
    ushort: function(sample) {
        return String.fromCharCode(255 & sample,
                                   255 & sample >> 8);
    },
    ulong: function(sample) {
        return String.fromCharCode(255 & sample,
                                   255 & sample >> 8,
                                   255 & sample >> 16,
                                   255 & sample >> 24);
    },
    gcd: function(a, b) {
        while (b) {
            var a_ = a;
            a = b, b = a_ % b;
        }
        return a;
    },
    lcm: function (a, b) {
        return Math.floor(a * b / utils.gcd(a, b));
    },
    compose: function(fns) {
        return function(a) {
            for (var i = 0; i < fns.length; i++) {
                a = fns[i](a);
            }
            return a;
        };
    },
    map: function(fn, items) {
        var result = [];
        for (var i = 0; i < items.length; i++) {
            result.push(fn(items[i]));
        }
        return result;
    }
};
function Beep(samplerate) {
    if (!(this instanceof Beep)) return new Beep(samplerate);
    if (typeof samplerate != "number" || samplerate < 1) return null;
    this.channels = 1;
    this.bitdepth = 16;
    this.samplerate = samplerate;
    this.sine = [];
    var factor = (2 * Math.PI) / parseFloat(samplerate);
    for (var n = 0; n < samplerate; n++) {
        this.sine.push(Math.sin(n * factor));
    }
}
Beep.prototype = {
    generate: function(freq) {
        var result = [];
        var sinelength = utils.lcm(this.samplerate, freq) / freq;
        for (var i = 0; i < sinelength; i++) {
            result.push(this.sine[(i * freq) % this.samplerate]);
        }
        return result;
    },
    encode: function(freq, duration, filters) {
        filters = filters || [];
        var format = utils.ushort;
        var applyfilters = utils.compose(filters);
        var samples = map(
            function(sample) { return format(applyfilters(sample)); },
            this.generate(freq)
        ).join("");
        var reps = Math.ceil(duration * this.samplerate / samples.length);
        var data = new Array(reps).join(samples);
        var fmtChunk = [
            ["f", "m", "t", " "].join(""),
            utils.ulong(Beep.PCM_CHUNK_SIZE),
            utils.ushort(Beep.LINEAR_QUANTIZATION),
            utils.ushort(this.channels),
            utils.ulong(this.samplerate),
            utils.ulong(this.samplerate * this.channels * this.bitdepth / 8),
            utils.ushort(this.bitdepth / 8),
            utils.ushort(this.bitdepth)
        ].join("");
        var dataChunk = [
            ["d", "a", "t", "a"].join(""),
            utils.ulong(data.length * this.channels * this.bitdepth / 8),
            data
        ].join("");
        var header = [
            ["R", "I", "F", "F"].join(""),
            utils.ulong(4 + (8 + fmtChunk.length) + (8 + dataChunk.length)),
            ["W", "A", "V", "E"].join("")
        ].join("");
        return [header, fmtChunk, dataChunk].join("");
    },
    play: function(freq, duration, filters) {
        filters = filters || [];
        var data = btoa(this.encode(freq, duration, filters));
        var audio = document.createElement("audio");
        audio.src = "data:audio/x-wav;base64," + data;
        audio.play();
    }
};
Beep.LINEAR_QUANTIZATION = 1;
Beep.PCM_CHUNK_SIZE = 16;
Beep.utils = utils;
ns.Beep = Beep;
})(window["NS_BEEP"] || window);