Make your browser beep
======================

Step 1. Include beep.js
-----------------------

    <script type="text/javascript" src="beep.js"></script>

Step 2. Beep!
-------------

    <script type="text/javascript">
        new Beep(22050).play(1000, 1, [Beep.utils.amplify(8000)]);
    </script>

Step 3. That's all!
-------------------

Nothing here.

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

    #play(number:frequency, number:duration, [function:filters])

Generates and encodes a sine wave and tries to `play` it with the `<audio>` element.