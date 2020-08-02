#include <ESP8266WiFi.h>
#include <SocketIoClient.h>
#include <string.h>
#include <Servo.h>
const char *ssid = "Cloud";
const char *password = "welcometolab";
int temp;
int pTemp = 0;
int fanSpeed = 150;
char* currDir = "";
int INA = 4;  //D2
int INB = 5;  //D1
int lampPin = 2;  //D4
int servoPin = 0;  //D3
int angle = 90;
SocketIoClient webSocket;
Servo servo;


void connectHandler(const char *payload, size_t length)
{
  Serial.print("I connected to the server ....");
  //webSocket.emit("message", "\"this is a plain string\"");
}

void messageHandler(const char *payload, size_t length)
{
  Serial.printf("got message: %s\n", payload);
   if(strcmp(payload, "lampOn") == 0) {
    digitalWrite(lampPin, HIGH);
  } else if(strcmp(payload, "lampOff") == 0) {
    digitalWrite(lampPin, LOW);
  } else if(strcmp(payload, "fanLeft") == 0) {
      currDir = "left";
      digitalWrite(INB,LOW);
      analogWrite(INA, fanSpeed);
  } else if(strcmp(payload, "fanRight") == 0) {
      currDir = "right";
      digitalWrite(INA,LOW);
      analogWrite(INB, fanSpeed);
  } else if(strcmp(payload, "fanSpeed_1") == 0) {
    fanSpeed = 50;
    setSpeed();
  } else if(strcmp(payload, "fanSpeed_2") == 0) {
    fanSpeed = 150;
    setSpeed();
  } else if(strcmp(payload, "fanSpeed_3") == 0) {
    fanSpeed = 255;
    setSpeed();
  } else if(strcmp(payload, "doorLeft") == 0) {
    angle += 70;
    if(angle < 170) servo.write(angle); 
  } else if(strcmp(payload, "doorRight") == 0) {
    angle -= 70;
    if(angle > 10) servo.write(angle); 
  }
}

void setSpeed() {
  if(strcmp(currDir, "left") == 0) analogWrite(INA, fanSpeed);
    else analogWrite(INB, fanSpeed);
}

void setup()
{

  pinMode(lampPin, OUTPUT);
  digitalWrite(lampPin, LOW);
  servo.attach(servoPin);
  servo.write(angle);

  Serial.begin(9600);
  Serial.println();
  Serial.print("Wifi connecting to ");
  Serial.println(ssid);
  //WiFi.hostname("arduinoAR");
  //WiFi.SSID("arduinoAR");
  //WiFi.softAP("aaa", "aaa");
  WiFi.begin(ssid, password);

  Serial.println();
  Serial.print("Connecting");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println();

  Serial.println("Wifi Connected Success!");
  Serial.print("NodeMCU IP Address : ");
  Serial.println(WiFi.localIP());

  webSocket.begin("192.168.137.79", 3030);
//    webSocket.begin("arduino-ar-project.glitch.me", 80);

  webSocket.on("message", messageHandler);
  webSocket.on("connect", connectHandler);
}

void loop()
{

  /*if(Serial.available() > 0) {
    char c[] = {(char)Serial.read()};
    Serial.println(c);
    webSocket.emit("plainString", c);
  }*/
  webSocket.loop();
  temp = analogRead(A0);
  temp = temp * 0.48828125;
  if(temp < pTemp) {
    webSocket.emit("message", "\"dec\"");
  } else if(temp > pTemp) {
    webSocket.emit("message", "\"inc\"");
  }
  pTemp = temp;
  Serial.println(temp);
  
  delay(500);
  

}
