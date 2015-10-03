Make your browser beep
======================

Step 1. Include beep.js
-----------------------
```html
<script type="text/javascript" src="beep.js"></script>
```

Step 2. Beep!
-------------
```html
<script type="text/javascript">
    new Beep(22050).play(1000, 1, [Beep.utils.amplify(8000)]);
</script>
```
    
You can also beep multiple beeps at the same time, all together:

```html
<script type="text/javascript">
    new Beep(22050).play(1000, 1, [Beep.utils.amplify(8000)]);
    new Beep(22050).play(500, 1, [Beep.utils.amplify(8000)]);
</script>
```

Or even use a callback, and sequence beeps one after another:

```html
<script type="text/javascript">
    new Beep(22050).play(500, 1, [Beep.utils.amplify(8000)], function() {
    	new Beep(22050).play(600, 1, [Beep.utils.amplify(8000)]);
    });
</script>
```

If you want a silence (pause), just use a frequency that humans can't hear:
```html
<script type="text/javascript">
    new Beep(22050).play(1, 0.1, [Beep.utils.amplify(8000)]); // this will be "silent" for 100 miliseconds
</script>
```

Step 3. That's all!
-------------------

Nothing here.

A little song example
=====================

Here's an example of how to beep a little song. You might know this song starting.

```javascript
function play(keys) {
  var key = keys.shift();
  if(typeof key == 'undefined') return; // song ended
  new Beep(22050).play(key[0], key[1], [Beep.utils.amplify(8000)], function() { play(keys); });
}
play([[660, 0.1], [660, 0.1], [660, 0.1], [510, 0.1], [660, 0.1], [770, 0.1], [1, 0.1], [380, 0.1]]);
```

API
===

Read the source for more detail.

Constructor
-----------

    new Beep(number:samplingrate) -> Beep

Makes `Beep`s.

Methods
-------

    #generate(number:samplingrate) -> [number:sample]

Generates a list of numbers representing samples of the sine wave.

    #encode(number:frequency, number:duration, [function:filters]) -> string:wavencode

Repeats the sine samples to fulfill a specified duration and encodes them to a WAV format.

    #play(number:frequency, number:duration, [function:filters] [, function:callback ])

Generates and encodes a sine wave and tries to `play` it with the `<audio>` element. Also, binds a callback function to the `onended` event of the `<audio>` element.
