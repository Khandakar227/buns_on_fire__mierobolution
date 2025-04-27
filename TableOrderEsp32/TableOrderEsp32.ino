#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// API Endpoints (Ngrok tunnelled urls)
const char* MENU_ITEMS_API = "https://60a2-103-162-187-38.ngrok-free.app/api/v1/menu_items";
const char* ORDER_API = "https://60a2-103-162-187-38.ngrok-free.app/api/v1/order";

// OLED setup
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Pins
#define BUTTON_MENU   15
#define BUTTON_SELECT 2
#define BUTTON_UP     0
#define BUTTON_DOWN   4
#define LED_PIN       5

// Application variables
struct MenuItem {
  String name;
  float price;
  String category;
  int item_id;
};

std::vector<MenuItem> menuItems;
std::vector<std::pair<int, int>> cart; // item_id, quantity

int selectedIndex = 0;
int quantity = 1;
bool inQuantitySelection = false;

const int table_id = 3;

unsigned long lastButtonPress = 0;
const unsigned long debounceDelay = 200; // 200 ms debounce

// ========== Setup Functions ==========
void setup() {
  Serial.begin(115200);

  pinMode(BUTTON_MENU, INPUT_PULLUP);
  pinMode(BUTTON_SELECT, INPUT_PULLUP);
  pinMode(BUTTON_UP, INPUT_PULLUP);
  pinMode(BUTTON_DOWN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    while (true);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Connecting WiFi...");
  display.display();

  connectWiFi();
  fetchMenuItems();
  showMainMenu();
}

// Connect to WiFi
void connectWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

// Fetch menu items
void fetchMenuItems() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(MENU_ITEMS_API);
    int httpResponseCode = http.GET();

    if (httpResponseCode == 200) {
      String payload = http.getString();
      DynamicJsonDocument doc(4096);
      deserializeJson(doc, payload);

      for (auto item : doc.as<JsonArray>()) {
        MenuItem menuItem;
        menuItem.name = item["name"].as<String>();
        menuItem.price = item["price"].as<float>();
        menuItem.category = item["category"].as<String>();
        menuItem.item_id = item["item_id"].as<int>();
        menuItems.push_back(menuItem);
      }
    }
    http.end();
  }
}

// Post order to server
void postOrder() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(ORDER_API);
    http.addHeader("Content-Type", "application/json");

    DynamicJsonDocument orderDoc(2048);
    orderDoc["table_id"] = table_id;
    JsonArray items = orderDoc.createNestedArray("items");
    for (auto& entry : cart) {
      JsonObject item = items.createNestedObject();
      item["item_id"] = entry.first;
      item["quantity"] = entry.second;
    }

    String requestBody;
    serializeJson(orderDoc, requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode == 200 || httpResponseCode == 201) {
      Serial.println("Order placed successfully!");
      digitalWrite(LED_PIN, HIGH);
      delay(1000);
      digitalWrite(LED_PIN, LOW);
    } else {
      Serial.print("Order failed: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}

// ========== Display Functions ==========

void showMainMenu() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("== Menu ==");

  int start = selectedIndex;
  if (selectedIndex >= 5) {
    start = selectedIndex - 4; // Scroll menu
  }

  for (int i = start; i < menuItems.size() && i < start + 5; i++) {
    if (i == selectedIndex) display.print("> ");
    else display.print("  ");
    display.println(menuItems[i].name);
  }
  display.display();
}

void showQuantitySelection() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Set Quantity:");
  display.setCursor(0, 20);
  display.setTextSize(2);
  display.print(quantity);
  display.setTextSize(1);
  display.display();
}

void showOrderPlaced() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Order Placed!");
  display.display();
  delay(1500);
}

// ========== Button Handling ==========

bool buttonPressed(int pin) {
  if (digitalRead(pin) == LOW && millis() - lastButtonPress > debounceDelay) {
    lastButtonPress = millis();
    return true;
  }
  return false;
}

void loop() {
  if (buttonPressed(BUTTON_MENU)) {
    cart.clear();
    selectedIndex = 0;
    inQuantitySelection = false;
    quantity = 1;
    showMainMenu();
  }

  if (inQuantitySelection) {
    if (buttonPressed(BUTTON_UP)) {
      quantity++;
      if (quantity > 99) quantity = 99;
      showQuantitySelection();
    }
    if (buttonPressed(BUTTON_DOWN)) {
      quantity--;
      if (quantity < 1) quantity = 1;
      showQuantitySelection();
    }
    if (buttonPressed(BUTTON_SELECT)) {
      cart.push_back({menuItems[selectedIndex].item_id, quantity});
      inQuantitySelection = false;
      quantity = 1;
      showMainMenu();
    }
  } else {
    if (buttonPressed(BUTTON_UP)) {
      selectedIndex--;
      if (selectedIndex < 0) selectedIndex = menuItems.size() - 1;
      showMainMenu();
    }
    if (buttonPressed(BUTTON_DOWN)) {
      selectedIndex++;
      if (selectedIndex >= menuItems.size()) selectedIndex = 0;
      showMainMenu();
    }
    if (buttonPressed(BUTTON_SELECT)) {
      inQuantitySelection = true;
      quantity = 1;
      showQuantitySelection();
    }
  }

  // Long Press to place order
  static unsigned long selectButtonPressStart = 0;
  if (digitalRead(BUTTON_SELECT) == LOW) {
    if (selectButtonPressStart == 0) {
      selectButtonPressStart = millis();
    } else if (millis() - selectButtonPressStart > 1500) { // Long press for 1.5s
      postOrder();
      cart.clear();
      showOrderPlaced();
      selectedIndex = 0;
      inQuantitySelection = false;
      showMainMenu();
      selectButtonPressStart = 0;
      delay(500);
    }
  } else {
    selectButtonPressStart = 0;
  }
}
