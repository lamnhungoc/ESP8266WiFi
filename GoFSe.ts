/*******************************************************************************
 * Functions for GoFSe
 *
 * Company: GoFSE
 * Website: http://www.gof.com
 * Phone:   0767.666.299
 *******************************************************************************/

// GoFSe API url.
const GoFSe_API_URL = "45.118.134.212"

namespace esp8266 {
    // Flag to indicate whether the GoFSe message was sent successfully.
    let GoFSeMessageSent = false



    /**
     * Return true if the GoFSe message was sent successfully.
     */
    //% subcategory="GoFSe"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_GoFSe_tests_sent
    //% block="GoFSe test sent"
    export function isGoFSeMessageSent(): boolean {
        return GoFSeMessageSent
    }



    /**
     * Send GoFSe message.
     * @param apiKey GoFSe API Key.
     * @param chatId The chat ID we want to send message to.
     */
    //% subcategory="GoFSe"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_send_GoFSe_message
    //% block="send message to GoFSe:|API Key %apiKey|Chat ID %chatId|Message %message"
    export function sendGoFSeMessage(keyname: string, value: number) {

        // Reset the upload successful flag.
        GoFSeMessageSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to GoFSe. Return if failed.
        if (sendCommand("AT+CIPSTART=\"TCP\",\"" + GoFSe_API_URL + "\",8080", "OK", 10000) == false) return

        // Construct the data to send.
        let data = "GET /hi?name=" + formatUrl(keyname) + "&value=" + value
        data += " HTTP/1.1\r\n"
        data += "Host: " + GoFSe_API_URL + "\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Validate the response from GoFSe.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        GoFSeMessageSent = true
        return
    }

}
