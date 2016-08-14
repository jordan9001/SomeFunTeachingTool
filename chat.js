
// Get our DOM things
var chat_box = document.getElementById('chat-box');
var chat_input = document.getElementById('chat-input');
var encryption_type = document.getElementById('encrypt-type');
var encryption_key = document.getElementById('encrypt-key');
var decryption_type = document.getElementById('decrypt-type');
var decryption_key = document.getElementById('decrypt-key');

// Set up the websocket
var ws_host = "ws://"+ window.location.host;
var websocket_connection = new WebSocket(ws_host, "whitehead-protocol");

var messages_recieved = [];

// Recieve Messages
websocket_connection.onmessage = function (evt) {
  messages_recieved.push(evt.data);
  refresh_display();
};

function refresh_display() {
  output = ""
  for (var i=0; i<messages_recieved.length; i++) {
    output += '<p>'+ decrypt(messages_recieved[i]) +'</p>';
  }
  chat_box.innerHTML = output;
  chat_box.scrollTop = chat_box.scrollHeight;
}

// Send Messages
function send_message() {
  var input = chat_input.value;
  chat_input.value = '';
  var output = encrypt(input);
  websocket_connection.send(output);
}

// encryption and decryption

function encrypt(plain_text) {
  if (encryption_key.value.length > 0) {
    if (encryption_type.value == "XOR") {
      return xor_encrypt(plain_text, encryption_key.value);
    } else {
      return rot_encrypt(plain_text, encryption_key.value); 
    }
  }
  return plain_text;
}

function decrypt(cipher_text) {
  if (decryption_key.value.length > 0) {
    if (decryption_type.value == "XOR") {
      return xor_decrypt(cipher_text, decryption_key.value);
    } else {
      return rot_decrypt(cipher_text, decryption_key.value); 
    }
  }
  return cipher_text;
}

function xor_encrypt(text, key) {
  output = [];
  for (var i=0; i<text.length; i++) {
    // turn the character into a number
    var char_code = text.charCodeAt(i);
    var key_code = key.charCodeAt(i % key.length);
    // Do encryption math
    char_code = char_code ^ key_code;
    // add the number as a hex number to the array
    output.push(char_code.toString(16));
  }
  // turn the array into a string separated by spaces
  return output.join(' ');
}

function xor_decrypt(text, key) {
  output = "";
  input = text.split(' ');
  for (var i=0; i<input.length; i++) {
    // turn the hex number into a number
    var num = parseInt(input[i], 16);
    var key_code = key.charCodeAt(i % key.length);
    // do encryption math
    num = num ^ key_code;
    // turn the resulting number into a character
    var character = String.fromCharCode(num);
    output += character;
  }
  return output;
}

function rot_encrypt(text, key) {
  key = key.toLowerCase();
  text = text.toLowerCase();
  output = [];
  for (var i=0; i<text.length; i++) {
    if (/[a-z]/.test(text.charAt(i))) {
      // turn the character into a number
      var char_code = text.charCodeAt(i) - 'a'.charCodeAt(0);
      var key_code = (key.charCodeAt(i % key.length) - 'a'.charCodeAt(0)) % 26;
      // Do encryption math
      char_code = ((char_code + key_code) % 26) + 'a'.charCodeAt(0);
      // add the number as a hex number to the array
      output.push(char_code.toString(16));
    } else {
      output.push(text.charCodeAt(i).toString(16));
    }
  }
  // turn the array into a string separated by spaces
  return output.join(' ');
}

function rot_decrypt(text, key) {
  key = key.toLowerCase();
  output = "";
  input = text.split(' ');
  for (var i=0; i<input.length; i++) {
    if (/[a-z]/.test(String.fromCharCode(parseInt(input[i],16)))) {
      // turn the hex number into a number
      var num = parseInt(input[i], 16) - 'a'.charCodeAt(0);
      var key_code = (key.charCodeAt(i % key.length) - 'a'.charCodeAt(0)) % 26;
      // do encryption math
      num = (((num - key_code) + 26) % 26) + 'a'.charCodeAt(0);
      // turn the resulting number into a character
      var character = String.fromCharCode(num);
      output += character;
    } else {
      output += String.fromCharCode(parseInt(input[i],16));
    }
  }
  return output;
}

