# SomeFunTeachingTool
An example webapp used to teach Websockets, simple cryptography, and XSS/html injection.

To use it, make sure you have node installed, and the package "websocket". You can then run ws_server, and connect to your local machine with a browser on port 8080. Others on your network should be able to connect as well, if your firewall allows it.

The page currently supports XOR cryptography and Cesarean/Vigenère (ROT) ciphers. Cesarean is a ROT cipher with a single letter key, and Vigenère is a key of multiple letters.

The page is also vulnerable (by design) to Cross Site Scripting and HTML injection. Input is not checked before printing to the display.
