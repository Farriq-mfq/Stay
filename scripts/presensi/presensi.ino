#include <ArduinoJson.h>
#include <ArduinoJson.hpp>

#include <WiFi.h>
#include <SocketIoClient.h>
#include <MFRC522.h>
#include <SPI.h>
#define SS_PIN 5
#define RST_PIN 22

MFRC522 rfid(SS_PIN, RST_PIN);
const char *ssid = "SULTHAN";
const char *password = "sulthan@faiq";
char host[] = "192.168.1.6";
int port = 3000;
char path[] = "/socket.io/?transport=websocket";
bool useSSL = false;
const char *sslFingerprint = "";
bool useAuth = false;

SocketIoClient webSocket;
WiFiClient client;


void onConnect(const char *payload, size_t length) {
  Serial.println("Connected to server");
}

void onDisconnect(const char *payload, size_t length) {
  Serial.println("Disconnected from server");
}

void onError(const char *payload, size_t length) {
  Serial.print("Error: ");
  Serial.println(payload);
}

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  // init rfid
  SPI.begin();
  rfid.PCD_Init();
  // end init rfid
  pinMode(LED_BUILTIN, OUTPUT);

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  webSocket.begin(host, port, path);

  webSocket.on("connect", onConnect);
  webSocket.on("disconnect", onDisconnect);
  webSocket.on("error", onError);
}

void loop() {
  webSocket.loop();
  handleRfid();
}

void handleRfid() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
    Serial.print("RFID/NFC Tag Type: ");
    Serial.println(rfid.PICC_GetTypeName(piccType));
    Serial.print("UID:");c:\Users\farriq\Documents\Projects\stay\scripts\arduino\presensi.ino
    String uuid = "";
    for (int i = 0; i < rfid.uid.size; i++) {
      uuid += rfid.uid.uidByte[i];
    }

    String ipAddress = WiFi.localIP().toString();

    StaticJsonDocument<200> doc;
    doc["ip"] = ipAddress;
    doc["token"] = "eyJhbGciOiJIUzI1NiJ9.ZTI0N2M4MTc4YzZjMTMyMzJjMmE0ODJlM2M0MWI5MzI.99FAEsYJxbyo6oXezezKDgvjY7XvHvh_BRPu5rVcDVs";
    doc["scan"] = uuid;

    char buffer[256];
    serializeJson(doc, buffer);

    webSocket.emit("SCAN", buffer);

    Serial.print(uuid);
    Serial.println();

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }
}
