import { MessageType } from "@adiwajshing/baileys";

import { STICKER_COMMAND } from "../constants/waCommands";
import resizeImage from "../helpers/resizeImage";

class WaService {
  constructor(connection) {
    if (!WaService._instance) {
      WaService._instance = this;
      this.connection = connection;
    }

    return WaService._instance;
  }

  async connectToWhatsApp() {
    this.connection.on("chat-update", async ({ messages, jid }) => {
      if (messages) {
        const waMessage = messages.all()[0];

        const {
          message: { imageMessage },
        } = waMessage;

        if (imageMessage) {
          const { caption } = imageMessage;

          if (caption === STICKER_COMMAND) {
            this._sendSticker(waMessage, jid);
          }
        }
      }
    });
  }

  async _sendSticker(waMessage, jid) {
    try {
      const buffer = await this.connection.downloadMediaMessage(waMessage);
      const bufferWebp = await resizeImage(buffer);
      await this.connection.sendMessage(jid, bufferWebp, MessageType.sticker);
    } catch (error) {
      console.log("unexpected error: " + error);
    }
  }
}

export default WaService;
