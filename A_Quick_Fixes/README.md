# Bistro 92 - Quick Fixes

### Q1: Essential features for customer satisfaction and efficient order processing

1. **Instant Order Relay**

   - Orders placed via table devices are transmitted to the kitchen system without delay
   - Utilizes WebSockets for real-time order push notification
   - Eliminates delay between customer submission and kitchen receipt

2. **Real-Time Status Feedback**

   - Order status updates displayed on customer devices:
     - "Order Confirmed"
     - "Cooking"
     - "Ready to Serve"
   - Reduces customer anxiety about order status
   - Minimizes unnecessary calls for wait staff

3. **Order Customization Options**

   - Intuitive interface for customers to modify dishes (e.g., "no onions," "extra cheese")
   - Comprehensive customization capabilities directly from the table device
   - Reduces need for service staff intervention, supporting the self-service concept

### Q2: Design Principles for an Intuitive Interface

1. **Contextual State-Driven UI**

   - OLED display presents distinct visual states throughout the ordering process:
     - Menu Browsing
     - Item Selection
     - Quantity Confirmation
     - Order Pending
     - Order Complete
   - Intuitive error correction allows users to easily decrease quantity or remove items before checkout
   - Reduces stress for users who make mistakes during the ordering process

2. **Button Debounce and Double Confirmation**
   - Software debouncing prevents accidental multiple presses
   - Critical actions (such as final order submission) require deliberate interaction:
     - Long press or hold to confirm
   - Particularly beneficial for children and elderly users

### Q3: Security Vulnerabilities and Solutions

1. **Device Spoofing**

   - **Vulnerability**: Attackers could use laptops to impersonate smart pads and submit fraudulent orders
   - **Solution**: Unique ESP32 certificates with Mutual TLS Authentication to verify legitimate device identity
   - Each device possesses cryptographically secure credentials that cannot be easily replicated

2. **Man-in-the-Middle Attack**

   - **Vulnerability**: Wi-Fi packet interception allowing malicious modification of order content
   - **Solution**: End-to-end AES encryption at the device level
   - Data is encrypted before leaving the ESP32 and decrypted only in server memory, protecting the entire transmission path

3. **Order Denial Attack**
   - **Vulnerability**: Flooding the cloud server with garbage data to cause denial of service
   - **Solution**: API Gateway Rate Limiting (maximum 5 requests/second per device ID)
   - Suspicious activity triggers temporary device bans and administrator alerts
   - Prevents resource exhaustion while maintaining service for legitimate customers

### Q4: System Responsiveness During Peak Hours

1. **Edge Node Local Processing**

   - Raspberry Pi cluster installed on-premises functions as a local edge computing node
   - Smart devices communicate with the Edge Node over local Wi-Fi
   - Orders are aggregated and batched before cloud transmission
   - Dramatically reduces internet bandwidth requirements and dependency

2. **Scalable Asynchronous Cloud Architecture**

   - Backend built on non-blocking, asynchronous frameworks (Node.js, Go)
   - Automatic scaling of server instances based on load
   - Queue-driven microservices process orders efficiently without blocking
   - Ensures responsiveness even during peak hours

### Q5: Integrate existing inventory system with our new ordering system

1. **Middleware API Gateway for Inventory Synchronization**

   - Dedicated middleware microservice connects the smart ordering system to the legacy inventory
   - Smart pads never communicate directly with inventory system
   - Gateway handles inventory updates (e.g., ingredient deduction) upon order confirmation
   - Allows both systems to operate in parallel without interference
   - Preserves integrity of the original inventory system
