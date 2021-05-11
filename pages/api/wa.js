import { WAConnection, MessageType, Presence } from '@adiwajshing/baileys'
const sharp = require('sharp')

async function resizeImage(img) {
  return await sharp(img)
    .resize(512, 512)
    .webp()
    .toBuffer()
}

export default (req, res) => {

  async function connectToWhatsApp() {
    const conn = new WAConnection()

    await conn.connect()

    conn.on('chat-update', async chatUpdate => {
      console.log(chatUpdate)

      if (chatUpdate.messages && chatUpdate.count) {

        const message = chatUpdate.messages.all()[0]
        console.log(message)

        const msgImage = message.message?.imageMessage

        if (msgImage) {
          const caption = msgImage.caption

          if (caption.search(/!sticker/) >= 0) {
            const buffer = await conn.downloadMediaMessage(message)
            const bufferWebp = await resizeImage(buffer)
            await conn.sendMessage(chatUpdate.jid, bufferWebp, MessageType.sticker)
          }
        }

      }
    })
  }
  // run in main file
  connectToWhatsApp()
    .catch(err => console.log("unexpected error: " + err)) // catch 

  res.status(200).json({ name: 'John Doe' })
}
