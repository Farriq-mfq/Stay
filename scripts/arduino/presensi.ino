// CATATAN RFID RC522
// #################### RFID CONNECTED PIN ##########################
// GND -> GND
// 3V -> 3V
// MOSI -> 11
// MISO -> 12
// SS / SDA -> 7
// SCK -> 13
// RST -> 9
// SOLVE : 28 JUNI 2024
// #################### END CONNECTED PIN ##########################

#include <Ethernet.h>
#include <SPI.h>
#include <MFRC522.h>
#include <String.h>
#include <ArduinoHttpClient.h>
int pin1 = 4;
int pin2 = 2;

#define RST_PIN 9  //
#define SS_PIN 7   //
String uID;
MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
// ########################### SETTING IP GATEWAY #####################
IPAddress ip(192, 168, 1, 6);

EthernetClient client;

// #################### REQUEST HTTP CLIENT SETTING ###################

char serverAddress[] = "192.168.1.5";
int port = 3000;
HttpClient httpClient = HttpClient(client, serverAddress, port);

// #################### END REQUEST HTTP CLIENT SETTING ###################

// ####################### KONFIGURASI TOKEN ##########################

String serverToken = "eyJhbGciOiJIUzI1NiJ9.NDI0NTVhNWYwMTE3YmIzMjY1N2NkNTE1MGRjMGFlM2E.LYf22KZ1pCJPvnj6eCwy5HZhw3h2txy35Dveh56fcv8";
// ####################### KONFIGURASI TOKEN ##########################

void setup() {
  Serial.begin(9600);
  while (!Serial)
    ;
  SPI.begin();
  mfrc522.PCD_Init();
  ShowReaderDetails();
  Serial.println(F("Scan PICC to see UID, type, and data blocks..."));
  Ethernet.begin(mac, ip);
  Serial.println(Ethernet.localIP());
  pinMode(pin1, OUTPUT);
  pinMode(pin2, OUTPUT);
  digitalWrite(pin1, HIGH);
  digitalWrite(pin2, LOW);
  delay(5000);
}  //setup

void loop() {
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
    Serial.print("RFID/NFC Tag Type: ");
    Serial.println(mfrc522.PICC_GetTypeName(piccType));
    Serial.print("UID:");
    String uuid = "";
    for (int i = 0; i < mfrc522.uid.size; i++) {
      uuid += mfrc522.uid.uidByte[i];
    }
    IPAddress localIP = Ethernet.localIP();
    String parsedIP = String(localIP[0]) + "." + String(localIP[1]) + "." + String(localIP[2]) + "." + String(localIP[3]);
    String jsonData = "{\"token\":\"" + serverToken + "\",\"ip\":\"" + parsedIP + "\",\"scan\":\"" + uuid + "\"}";
    httpClient.beginRequest();
    httpClient.post("/events/scan");
    httpClient.sendHeader("Content-Type", "application/json");
    httpClient.sendHeader("Content-Length", jsonData.length());
    httpClient.beginBody();
    httpClient.print(jsonData);
    httpClient.endRequest();
    // print uuid
    Serial.print(uuid);
    Serial.println();
    // Response
    int statusCode = httpClient.responseStatusCode();
    String response = httpClient.responseBody();

    Serial.print("Status code: ");
    Serial.println(statusCode);
    Serial.print("Response: ");
    Serial.println(response);
  }
  delay(1000);
}  //loop

void ShowReaderDetails() {
  // Get the MFRC522 software version
  byte v = mfrc522.PCD_ReadRegister(mfrc522.VersionReg);
  Serial.print(F("MFRC522 Software Version: 0x"));
  Serial.print(v, HEX);
  if (v == 0x91)
    Serial.print(F(" = v1.0"));
  else if (v == 0x92)
    Serial.print(F(" = v2.0"));
  else
    Serial.print(F(" (unknown)"));
  Serial.println("");
  // When 0x00 or 0xFF is returned, communication probably failed
  if ((v == 0x00) || (v == 0xFF)) {
    Serial.println(F("WARNING: Communication failure, is the MFRC522 properly connected?"));
  }
}
