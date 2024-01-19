/*******************************************************************************
 * Functions for lambizsoft
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// lambizsoft API url.
const LAMBIZSOFT_API_URL = "http://45.118.134.212"

namespace esp8266 {
    // Flag to indicate whether the lambizsoft message was sent successfully.
    let lambizsoftMessageSent = false



    /**
     * Return true if the lambizsoft message was sent successfully.
     */
    //% subcategory="lambizsoft"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_lambizsoft_message_sent
    //% block="lambizsoft message sent"
    export function islambizsoftMessageSent(): boolean {
        return lambizsoftMessageSent
    }



    /**
     * Send lambizsoft message.
     * @param apiKey lambizsoft API Key.
     * @param chatId The chat ID we want to send message to.
     */
    //% subcategory="lambizsoft"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_send_lambizsoft_message
    //% block="send message to lambizsoft:|API Key %apiKey|Chat ID %chatId|Message %message"
    export function sendlambizsoftMessage(apiKey: string, chatId: string, message: string) {

        // Reset the upload successful flag.
        lambizsoftMessageSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to lambizsoft. Return if failed.
        if (sendCommand("AT+CIPSTART=\"SSL\",\"" + LAMBIZSOFT_API_URL + "\",8080", "OK", 10000) == false) return

        // Construct the data to send.
        let data = "GET /" + formatUrl(apiKey) + "/hi?name=" + formatUrl(chatId) + "&value=" + formatUrl(message)
        data += " HTTP/1.1\r\n"
        data += "Host: " + LAMBIZSOFT_API_URL + "\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Validate the response from lambizsoft.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        lambizsoftMessageSent = true
        return
    }

}
