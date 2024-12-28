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
#include <avr/wdt.h>
#include <ArduinoJson.h>

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
IPAddress ip(192, 168, 85, 35);
// CUSTOM GATEWAY (OPTIONAL)
IPAddress gateway(192, 168, 85, 203);
// CUSTOM DNS (OPTIONAL)
IPAddress dns(192, 168, 85, 203);

EthernetClient client;

// #################### REQUEST HTTP CLIENT SETTING ###################

// char serverAddress[] = "103.49.238.227";
int port = 3000;
IPAddress serverAddress(62, 77, 158, 139);
HttpClient httpClient(client, serverAddress, port);

// #################### END REQUEST HTTP CLIENT SETTING ###################

// ####################### KONFIGURASI TOKEN ##########################

String serverToken = "ef11b18d372b0704afb2a5bde75141e2";
// ####################### KONFIGURASI TOKEN ##########################
// LCD INITIALIZE
LiquidCrystal_I2C lcd(0x27, 16, 2);

int pinBuzzer = 2;
int ledYellow = 6;
int ledGreen = 5;
int ledRed = 5;

void setup() {
  Serial.begin(9600);
  while (!Serial)
    ;
  SPI.begin();
  mfrc522.PCD_Init();
  ShowReaderDetails();
  Serial.println(F("Scan PICC to see UID, type, and data blocks..."));

  pinMode(pin1, OUTPUT);
  pinMode(pin2, OUTPUT);
  digitalWrite(pin1, HIGH);
  digitalWrite(pin2, LOW);
  // start init lcd
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Hi :)");
  lcd.setCursor(0, 1);
  lcd.print("Stay Presence");
  // end lcd
  pinMode(pinBuzzer, OUTPUT);
  pinMode(ledYellow, OUTPUT);
  pinMode(ledGreen, OUTPUT);
  pinMode(ledRed, OUTPUT);
  delay(5000);
}  //setup


void loop() {
  // BEGIN WITH CUSTOM GATEWAY
  // Ethernet.begin(mac, ip ,gateway);
  Ethernet.maintain();
  if (Ethernet.begin(mac) == 0) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Searching...");
    lcd.setCursor(0, 1);
    lcd.print("Connection");
    // BEGIN WITH CUSTOM DNS AND GATEWAY
    Ethernet.begin(mac, ip, dns, gateway);
  }

  // printIpAddress();

  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
    Serial.print("RFID/NFC Tag Type: ");
    Serial.println(mfrc522.PICC_GetTypeName(piccType));
    Serial.print("UID:");
    String uuid = "";
    for (int i = 0; i < mfrc522.uid.size; i++) {
      uuid += mfrc522.uid.uidByte[i];
    }

    Serial.println(uuid);

    IPAddress localIP = Ethernet.localIP();
    String parsedIP = String(localIP[0]) + "." + String(localIP[1]) + "." + String(localIP[2]) + "." + String(localIP[3]);
    Serial.println(parsedIP);
    String jsonData = "{\"token\":\"" + serverToken + "\",\"ip\":\"" + parsedIP + "\",\"scan\":\"" + uuid + "\"}";
    Serial.println(jsonData);
    httpClient.beginRequest();
    httpClient.post("/events/scan");
    httpClient.sendHeader("Content-Type", "application/json");
    httpClient.sendHeader("Content-Length", jsonData.length());
    httpClient.beginBody();
    httpClient.print(jsonData);
    httpClient.setTimeout(1000);
    int statusCode = httpClient.responseStatusCode();
    Serial.print("Response Code: ");
    Serial.println(statusCode);
    String response = httpClient.responseBody();
    Serial.print("Response Body: ");
    Serial.println(response);

    Serial.println("Request succeeded:");
    digitalWrite(pinBuzzer, HIGH);
    digitalWrite(ledGreen, HIGH);
    delay(100);
    digitalWrite(pinBuzzer, LOW);
    digitalWrite(ledGreen, LOW);
    if (statusCode == 200) {
      parseJsonManuallyAndDisplay(response);
      delay(1000);
      resetLcd();
    }
    httpClient.endRequest();
    mfrc522.PICC_HaltA();
    // Stop encryption on PCD
    mfrc522.PCD_StopCrypto1();
  }
  // delay(1000);
  // resetLcd();
}  //loop



void printIpAddress() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connected IP :");
  lcd.setCursor(0, 1);
  lcd.print(Ethernet.localIP());
}

void parseJsonManuallyAndDisplay(String response) {
  lcd.clear();
  int dataIndex = response.indexOf("\"data\":");
  if (dataIndex != -1) {
    int messageIndex = response.indexOf("\"message\":", dataIndex);
    if (messageIndex != -1) {
      int start = messageIndex + 10;  // Move past "message":
      if (response[start] == '\"') {
        start++;  // Skip the opening quote
        int end = response.indexOf("\"", start);
        String messageValue = response.substring(start, end);

        // Display message on the second line of the LCD
        lcd.setCursor(0, 0);
        lcd.print(messageValue);
      }
    }
  }
  // Check for "siswa"
  int siswaIndex = response.indexOf("\"siswa\":", dataIndex);
  if (siswaIndex != -1) {
    int start = siswaIndex + 8;  // Move past "siswa":
    if (response[start] == '\"') {
      start++;  // Skip the opening quote
      int end = response.indexOf("\"", start);
      String siswaValue = response.substring(start, end);

      // Display siswa on the second line of the LCD
      lcd.setCursor(0, 0);
      lcd.print("Terimakasih");
      lcd.setCursor(0, 1);
      lcd.print(siswaValue);
    }
  }
}


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
