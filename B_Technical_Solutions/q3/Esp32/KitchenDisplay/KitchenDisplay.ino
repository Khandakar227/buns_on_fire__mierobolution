#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>

using namespace websockets;

// WiFi credentials
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// WebSocket server (ngrok tunnelling URL)
const char* websockets_server_host = "60a2-103-162-187-38.ngrok-free.app"; 
const uint16_t websockets_server_port = 443; 

WebsocketsClient client;

// OLED settings
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Function to show order on OLED
void displayOrder(String orderId, String tableId, String itemsSummary) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);

  display.setCursor(0,0);
  display.print("Order: ");
  display.println(orderId);

  display.print("Table: ");
  display.println(tableId);

  display.println("Items:");
  display.println(itemsSummary);

  display.display();
}

void onMessageCallback(WebsocketsMessage message) {
  Serial.print("Got Message: ");
  Serial.println(message.data());

  // Parse JSON
  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc, message.data());
  
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return;
  }

  String eventName = doc["eventName"];
  if (eventName != "kitchen display") {
    Serial.println("Not a kitchen display event, ignoring...");
    return;
  }

  String orderId = String(doc["order_id"].as<int>());
  String tableId = String(doc["table_id"].as<int>());
  
  String itemsSummary = "";
  JsonArray items = doc["items"];
  for(JsonObject item : items) {
    String itemName = item["item_name"];
    int quantity = item["quantity"];
    itemsSummary += String(itemId) + ". " + String(itemName) + " x" + String(quantity) + "\n";
  }

  // Print to Serial
  Serial.println("Displaying on OLED...");
  Serial.println("Order ID: " + orderId);
  Serial.println("Table ID: " + tableId);
  Serial.println("Items: ");
  Serial.println(itemsSummary);

  // Display on OLED
  displayOrder(orderId, tableId, itemsSummary);
}

void onEventsCallback(WebsocketsEvent event, String data) {
  if(event == WebsocketsEvent::ConnectionOpened) {
      Serial.println("Connection Opened");
  } else if(event == WebsocketsEvent::ConnectionClosed) {
      Serial.println("Connection Closed");
  } else if(event == WebsocketsEvent::GotPing) {
      Serial.println("Got a Ping!");
  } else if(event == WebsocketsEvent::GotPong) {
      Serial.println("Got a Pong!");
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to WiFi.");

  // OLED setup
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3C for most OLEDs
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  display.println("Waiting for order...");
  display.display();

  // WebSocket setup
  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);

  // Connect with SSL
  client.connect(websockets_server_host, websockets_server_port, "/");

  client.send("Hello Server!");
}

void loop() {
  client.poll();
}
