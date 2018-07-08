<template>
  <div id="app" class="container-fluid" style="padding:0;">
    <div class="panel panel-default">
          <div class="panel-body msg_container_base">
            <div v-for="message in messages" :key="message.id">
              <template v-if="message.bot">
                <div class="row msg_container base_receive">
                  <div class="col-md-10 col-xs-10">
                    <div class="messages msg_receive">
                      <p>{{message.msg}}</p>
                      <p class="sender">Hodor</p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row msg_container base_sent">
                  <div class="col-md-10 col-xs-10">
                    <div class="messages msg_sent">
                      <p>{{message.msg}}</p>
                      <p class="sender">Você</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="panel-footer">
            <template v-if="state === 0">
              <button type="button" class="btn btn-primary" v-on:click.prevent="startRecord">Gravar</button>
            </template>
            <template v-else-if="state === 1">
              <span>Gravando...</span>
              <button type="button" class="btn btn-danger" v-on:click.prevent="stopRecord">Parar Gravação</button>
            </template>
            <template v-else-if="state === 2">
              <p>Processando...</p>
            </template>
            <template v-else>
              <p>{{error}}</p>
            </template>
          </div>
        </div>
  </div>
</template>

<script>
import MediaRecorder from 'audio-recorder-polyfill'
window.MediaRecorder = MediaRecorder

export default {
  name: 'app',

  data () {
    return {
      id: 1,
      messages: [{
        id: 0,
        msg: 'Seja bem vindo! O que você deseja?',
        bot: true
      }],
      state: 0, // 0: Idle, 1:Gravando, 2: Processando, 3:error
      recorder: undefined,
      error: undefined
    }
  },

  methods: {
    startRecord () {
      this.state = 1
      let vm = this
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        vm.recorder = new MediaRecorder(stream)

        vm.recorder.addEventListener('dataavailable', e => {
          window.console.log('ACABOUU')
          vm.uploadAudio(e.data)
        })

        window.console.log("Começou")
        vm.recorder.start()
      }).catch(function(err) {
        this.state = 3
        this.error = err
      })
    },
    stopRecord () {
      window.console.log("Chamou Parar")
      this.state = 2;
      this.recorder.stop()
      this.recorder.stream.getTracks().forEach(i => i.stop())
    },
    uploadAudio (audio) {
      let form = new FormData()
      form.append('audio', audio, 'audio')

      let vm = this;
      this.axios.post('http://matheusmarques.com:3000/upload', form).then(response => {
        window.console.log(response.data)
        // Message
        if(response.data.message) {
          vm.messages.push({
            id: vm.id++,
            msg: response.data.message,
            bot: false
          })
        }
        //Bot
        if(response.data.bot) {
          vm.messages.push({
            id: vm.id++,
            msg: response.data.bot,
            bot: true
          })
        }

        this.state = 0
      }).catch(function() {
        vm.messages.push({
          id: vm.id++,
          msg: 'Algo de errado aconteceu =/ Tente novamente!',
          bot: true
        })
        this.state = 0
      })
    }
  },

}
</script>

<style>
  .col-md-10, .col-xs-10{
    padding:0;
  }
  .panel{
    margin-bottom: 0px;
  }
  .chat-window > div > .panel{
    border-radius: 5px 5px 0 0;
  }

  .msg_container_base{
    background: #e5e5e5;
    margin: 0;
    padding: 0 10px 10px;
    height:500px;
    overflow-x:hidden;
  }

  .top-bar {
    background: #666;
    color: white;
    padding: 10px;
    position: relative;
    overflow: hidden;
  }
  .messages {
    background: white;
    padding: 10px;
    border-radius: 2px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    max-width:100%;
  }
  .msg_sent{
    padding-bottom:20px !important;
    background-color: rgba(96, 147, 179, 0.37);
  }
  .messages > p {
    font-size: 13px;
    margin: 0 0 0.2rem 0;
  }
  .messages > .sender {
    font-size: 11px;
    color: #ccc;
  }
  .msg_container {
    padding: 10px;
    overflow: hidden;
    display: flex;
  }
  img {
    display: block;
    width: 100%;
  }

  .msg_sent > .sender{
    float: right;
    color: #000;
  }

  .msg_container_base::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
  }

  .msg_container_base::-webkit-scrollbar
  {
    width: 12px;
    background-color: #F5F5F5;
  }

  .msg_container_base::-webkit-scrollbar-thumb
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }

  .panel-footer {
    height: 42px;
    display: block;
    position: absolute;
  }

</style>
