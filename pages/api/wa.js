import { WAConnection, MessageType } from '@adiwajshing/baileys'
import * as WSF from 'wa-sticker-formatter'

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
        const msgConversation = message.message?.conversation
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

        if (msgConversation) {

          // !sticker
          if (msgConversation.search(/!sticker/) >= 0) {
            const sticker = new WSF.Sticker('https://pbs.twimg.com/profile_images/1390666848983830528/icRjjnBn_400x400.jpg', {})
            await sticker.build()
            const sticBuffer = await sticker.get()
            await conn.sendMessage(chatUpdate.jid, sticBuffer, MessageType.sticker)
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
