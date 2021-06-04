<template>
  <div class="console">
    <div id="console-output" ref="THING">
    </div>
    <input class="hacker" type="text" placeholder="enter command" v-on:keyup.enter="sendCommand" />
  </div>
</template>

<script>
import * as mctext from '../mctext';

export default {
  name: "Console",
  data() {
    return {
      content: [],
      ws: null,
    };
  },
  mounted() {

    this.ws = new WebSocket("ws://localhost:4567/v1/ws/console");

    this.ws.onopen = function() {
      console.log("Opened connection");
    };

    var $vm = this;
    this.ws.onmessage = function(msg) {
      var parsed = JSON.parse(msg.data);

      // $vm.content.push(parsed);
      $vm.$refs.THING.append("[" + $vm.$moment(parsed.ts).format("YYYY-MM-DD hh:mm:ss") + "]: ");
      $vm.$refs.THING.appendChild(mctext.replaceColorCodes(document, window, parsed.msg));
      $vm.$refs.THING.appendChild(document.createElement("br"));
      window.scrollTo(0,document.body.scrollHeight);
    };
  },
  methods: {
    sendCommand(ev) {
      this.ws.send(ev.currentTarget.value);
      ev.currentTarget.value = "";
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.console {
  flex: 5 1 auto;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: flex-start;
}
#console-output {
  font-family: "Menlo", "Monaco", "Courier New", Courier, monospace;
  font-size: 14px;
  line-height: 1.4;
  flex: 5 1 auto;
  align-self: stretch;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
input {
  flex: 0 1 auto;
  align-self: stretch;
}
</style>
