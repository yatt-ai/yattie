import { reactive } from "vue";
import { io } from "socket.io-client";

export const socketState = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false,
});

socket.on("connect", () => {
  socketState.connected = true;
});

socket.on("disconnect", () => {
  socketState.connected = false;
});

socket.on("foo", (...args) => {
  socketState.fooEvents.push(args);
});

socket.on("bar", (...args) => {
  socketState.barEvents.push(args);
});
