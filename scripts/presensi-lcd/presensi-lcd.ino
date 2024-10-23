// CATATAN RFID RC522
// #################### RFID CONNECTED PIN ##########################
// GND -> GND
// 3V -> 3V
// MOSI -> 11
// MISO -> 12
// SS / SDA -> 7
// SCK -> 13
// RST -> 9
// CC : FARRIQMFQ
// #################### END CONNECTED PIN ##########################

#include <Ethernet.h>
#include <SPI.h>
#include <MFRC522.h>
#include <String.h>
#include <ArduinoHttpClient.h>
#include <LiquidCrystal_I2C.h>

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

char serverAddress[] = "192.168.1.3";
int port = 3000;
HttpClient httpClient = HttpClient(client, serverAddress, port);

// #################### END REQUEST HTTP CLIENT SETTING ###################

// ####################### KONFIGURASI TOKEN ##########################

String serverToken = "eyJhbGciOiJIUzI1NiJ9.ZjRlMGYxNmJlYzYzNGZhZDM4N2U2MzA5ZThkYjdlODY.Bd0xUT16D5aOZINL_NkHhWNXqBcevsPRUoYxIZ11x3c";
// ####################### KONFIGURASI TOKEN ##########################
// LCD INITIALIZE
LiquidCrystal_I2C lcd(0x27, 16, 2);

int pinBuzzer = 2;

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
  // start init lcd
  lcd.init();
  lcd.backlight();
  // end lcd
  lcd.setCursor(0, 0);
  lcd.print("Welcome :) ");
  lcd.setCursor(0, 1);
  lcd.print("IP: ");
  lcd.setCursor(3, 1);
  lcd.print(Ethernet.localIP());
  pinMode(pinBuzzer, OUTPUT);
  //
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

    digitalWrite(pinBuzzer, HIGH);
    delay(300);
    digitalWrite(pinBuzzer, LOW);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("ID : ");
    lcd.setCursor(5, 0);
    lcd.print(uuid);
    delay(1000);
    lcd.clear();
    lcd.print("Waiting...");


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
  resetLcd();
}  //loop

void resetLcd() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Scan your card : ");
}

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
