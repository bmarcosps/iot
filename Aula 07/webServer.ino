// bibliotecas do WiFi e servidor web
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
 
// credenciais da rede sem fio
const char* ssid = "iot";
const char* password = "netdascoisas#";

// porta 80 para HTTP
ESP8266WebServer server(80);

// conteudo da pagina web
String page = "";
String estado = "Desligado";

// pino de saída onde p LED esta ligado
int LEDPin = 13;

void setup(void){
  // conteudo da pagina web HTTP
  page = "<h1>NodeMCU Web Server</h1> <h3>DCC091 - IoT - 2018.1</h3> <p><a href=\"LEDOn\"><button>ON</button></a>&nbsp;<a href=\"LEDOff\"><button>OFF</button></a></p><h2>Estado do LED: ";
  //informando o pino de saida e deixando-o desligado
  pinMode(LEDPin, OUTPUT);
  digitalWrite(LEDPin, LOW);
   
  delay(1000);
  Serial.begin(115200);
  WiFi.begin(ssid, password); // conecta ao wifi
  Serial.println("");
 
  // esperando pela conexao
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Conectado na rede -> ");
  Serial.println(ssid);
  Serial.print("O IP do servidor web HTTP NodeMCU -> ");
  Serial.println(WiFi.localIP());
  
  server.on("/", [](){
    server.send(200, "text/html", page + estado + "</h2>");
  });
  server.on("/LEDOn", [](){
    estado = "Ligado"
    server.send(200, "text/html", page + estado + "</h2>");
    digitalWrite(LEDPin, HIGH);
    delay(1000);
  });
  server.on("/LEDOff", [](){
    estado = "Desligado"
    server.send(200, "text/html", page + estado + "</h2>");
    digitalWrite(LEDPin, LOW);
    delay(1000); 
  });
  server.begin();
  Serial.println("Servidor Web Iniciado!");
  Serial.println("Abra seu navegador e digite o endereco IP.");
}
 
void loop(void){
  // atende ao cliente http
  server.handleClient();
}
