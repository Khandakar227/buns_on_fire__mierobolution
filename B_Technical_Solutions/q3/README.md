## API Routes
### Order:
**Method**: `POST` \
**url**: `http://localhost:3000/api/v1/order` \
**Request body**:
```json
{
	"table_id": 3,
	"items": [
		{"item_id": 1, "quantity": 2},
		{"item_id": 3, "quantity": 2}
	]
}
```


## Setup
1. Go to `server`. Run `npm i` and `npm run dev`.
2. Open a new terminal. Install ngrok to run it on cloud simulator. `npm i -g ngrok`
3. Go to `ngrok.com` create an account and copy the `auth token`. Add this command in your terminal:
```bash
ngrok config add-authtoken $YOUR_AUTHTOKEN
```
4. run `ngrok http 3000`. Copy the generated url.

## Hardware Code
1. Modify the web server url with the ngrok generated url.
2. Upload the `Esp32/KitchenDisplay.ino` to Esp32.