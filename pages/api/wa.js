import { WAConnection, MessageType } from '@adiwajshing/baileys'
const sharp = require('sharp')

export default (req, res) => {

  async function connectToWhatsApp() {
    const conn = new WAConnection()

    await conn.connect()
    conn.on('chat-update', async chatUpdate => {
      console.log(chatUpdate)

      if (chatUpdate.messages && chatUpdate.count) {

        const message = chatUpdate.messages.all()[0]
        console.log(message)

        const msgText = message.message?.extendedTextMessage?.text
        // const msgConversation = message.message?.conversation
        const msgImage = message.message?.imageMessage
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid

        if (msgText) {
          // !demote @userids
          if (msgText.search(/!demote/) >= 0) {
            await conn.groupDemoteAdmin(chatUpdate.jid, mentionedJid)
          }

          // !promote @userids
          if (msgText.search(/!promote/) >= 0) {
            await conn.groupMakeAdmin(chatUpdate.jid, mentionedJid)
          }
        }

        if (msgImage) {
          const caption = msgImage.caption
          if (caption.search(/!sticker/) >= 0) {

            const buffer = await conn.downloadMediaMessage(message)
            console.log(buffer)

            const bufferWebp = await sharp(buffer)
              .resize(512, 512)
              .webp()
              .toBuffer()

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
