// Make connection
// this 'socket' is a separate frontend socket variable
// and not connected to the one in server on the backend
var socket = io.connect('http://localhost:3000');