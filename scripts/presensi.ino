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
int port = 4000;
char path[] = "/socket.io/?transport=websocket";
bool useSSL = false;
const char *sslFingerprint = "";
bool useAuth = false;

SocketIoClient webSocket;
WiFiClient client;
void setup()
{
  Serial.begin(115200);
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

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  webSocket.begin(host, port, path);
}

void loop()
{
  webSocket.loop();
  handleRfid();
}

void handleRfid()
{
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial())
  {
    MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
    Serial.print("RFID/NFC Tag Type: ");
    Serial.println(rfid.PICC_GetTypeName(piccType));
    Serial.print("UID:");
    String uuid = "";
    for (int i = 0; i < rfid.uid.size; i++)
    {
      uuid += rfid.uid.uidByte[i];
    }

    String ipAddress = WiFi.localIP().toString();

    StaticJsonDocument<200> doc;
    doc["ip"] = ipAddress;
    doc['token'] = 'xxxxx';
    doc["scan"] = uuid;

    String jsonString;
    serializeJson(doc, jsonString);

    webSocket.emit("SCAN", jsonString);

    Serial.print(uuid);
    Serial.println();

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }
}
