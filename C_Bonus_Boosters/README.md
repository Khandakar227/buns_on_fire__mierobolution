# Q5
## Reliable Communication Protocols
Instead of basic HTTP requests (which can fail), we can use MQTT (Message Queue Telemetry Transport). MQTT is lightweight, fast, reliable — perfect for ESP32.
- If the server is handling many orders, MQTT brokers will queue and deliver messages properly without overwhelming ESP32s.

## Authorization Tokens hardcoded in ESP32s
- Integrating Public Key Private key (RSA) Encryption to send order request. The public key is sent over request headers. The server will hold the private key. This will prevent unauthorized user to send false or fake order. 

## Database Transaction Management
- ACID Transactions can help creating and updating by preventing data loss such as double booking and miscalculations.

## Asynchronous & Non-blocking Code
Node js is non blocking and event driven, can handle many requests at once.

##  Queue System for Orders
- RabbitMQ, Kafka or Redis Pub/Sub can queue orders when traffic is too high. This can help handling burst load smoothly.

## Scaling: Horizontal over Vertical
- Load balancers such as `Nginx` can be used for scalability.

## Caching for Read-Heavy Data
- Data can be cached in device, so that frequent queries are not needed. As menu doesn't change very frequently for a restaurant.

## Implement rate limiting
- Using express-rate-limit to protect APIs.

## Over-the-Air (OTA) Updates
- A feature to update firmware remotely without pulling down devices.

## Replace Esp32 with Raspberry Pi 4/5
- Esp32 can process around 30–50 messages per second (optimized code with C++, around 100 bytes each) which may not enough for large scale.
- Full Linux, multi-core CPU, GBs of RAM, can run Node.js, Python, etc.
- This will enable complex UI/UX (touch, animations, fancy order sorting)
- Multiple parallel MQTT/WebSocket subscriptions


It is highly unlikely for a Restaurant management system to reach a heavy load of 10k - 100k users/sec. But if it ever happens it can still be prevented following these strategies.
