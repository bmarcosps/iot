const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const uuidv1 = require('uuid/v1');
const { spawn } = require('child_process');
const mqtt = require('mqtt');

// VARIAVEIS
const pythonExec = 'python3';
//const scriptPath = '/Users/matheus/Library/Mobile Documents/com~apple~CloudDocs/Development/Git/iot/Trabalho Final/Audio/speech.py';
const scriptPath = '/root/speech.py';
const portaTopic = 'DCC091PortaTopic1'; // A - Abrir, F - Fechar
const tempTopic  = 'DCC091TempTopic1'; // string com temperatura e humidade


const client  = mqtt.connect('mqtt://test.mosquitto.org');
const app = express();
app.use(fileUpload());
app.use(cors());

app.post('/upload', function(req, res) {
  if (!req.files || !req.files.audio)
    return res.status(400).send('No files were uploaded.');

  let audio = req.files.audio;
  let filePath = 'upload/'+uuidv1()+'.wav'

  audio.mv(filePath, function(err) {
    if (err)
      return res.status(500).send({'success': false, 'error': err});

    return proccessRequest(req, res, filePath)
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

// MQTT

var temperatura = 'O Node retornar essa informação... =/';

client.on('connect', function () {
  console.log('Mosquito Connected');
  client.subscribe(portaTopic);
  client.subscribe(tempTopic);
  client.publish(portaTopic, 'T');
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('MQTT ' + topic +': '+ message.toString());

  if(topic == tempTopic) {
    temperatura = message.toString();
  }
})

// Bot

const actions = [
  {
    triggers: ['abrir a porta', 'abrir porta', 'destrancar porta'],
    cb: function () {
      client.publish(portaTopic, 'A');

      return 'Ok! Destrancando a porta!';
    }
  },
  {
    triggers: ['fechar a porta', 'fechar porta', 'trancar porta'],
    cb: function () {
      client.publish(portaTopic, 'F');

      return 'Ok! Trancando a porta!';
    }
  },
  {
    triggers: ['qual a temperatura', 'temperatura', 'humidade'],
    cb: function () {
      client.publish(portaTopic, 'T');

      return 'Atualmente está: '+temperatura;
    }
  },
]

function getAction(message) {
  for(let i = 0; i < actions.length; i++) {
    for(let j = 0; j < actions[i].triggers.length; j++) {
      if (message.includes(actions[i].triggers[j]))
        return actions[i];
    }
  }

  return null;
}

function executeAction(req, res, message) {
  if (!message || message === '')
    res.send({'success': false, 'error': 'Mensagem vazia', 'bot': 'Ocorreu um erro no meu sistema! Tente novamente!'});

  let action = getAction(message);

  if (action == null)
    return res.send({'success': true, 'message': message, 'bot': 'Desculpe, não entendi o que deseja =/'});
  else
    return res.send({'success': true, 'message': message, 'bot': action.cb()});
}

function proccessRequest(req, res, filePath) {

  const pyProg = spawn(pythonExec, [scriptPath, filePath]);

  pyProg.stdout.on('data', function(data) {
    let message = (data.toString()).replace(/RESULTADO: \[\[ (.*?) \]\]/, '$1');
    return executeAction(req, res, message.trim());
  });

  pyProg.stderr.on('data', function(data) {
    res.send({'success': false, 'error': data.toString(), 'bot': 'Ocorreu um erro no meu sistema! Tente novamente!'});
  });

}