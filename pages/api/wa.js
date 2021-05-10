import { WAConnection } from '@adiwajshing/baileys'

export default (req, res) => {

  async function connectToWhatsApp() {
    const conn = new WAConnection()
    // called when WA sends chats
    // this can take up to a few minutes if you have thousands of chats!
    conn.on('chats-received', async ({ hasNewChats }) => {
      console.log(`you have ${conn.chats.length} chats, new chats available: ${hasNewChats}`)

      const unread = await conn.loadAllUnreadMessages()
      console.log("you have " + unread.length + " unread messages")
    })
    // called when WA sends chats
    // this can take up to a few minutes if you have thousands of contacts!
    conn.on('contacts-received', () => {
      console.log('you have ' + Object.keys(conn.contacts).length + ' contacts')
    })

    await conn.connect()
    conn.on('chat-update', chatUpdate => {
      // `chatUpdate` is a partial object, containing the updated properties of the chat
      // received a new message
      if (chatUpdate.messages && chatUpdate.count) {
        const message = chatUpdate.messages.all()[0]
        console.log(message)
      } else console.log(chatUpdate) // see updates (can be archived, pinned etc.)
    })
  }
  // run in main file
  connectToWhatsApp()
    .catch(err => console.log("unexpected error: " + err)) // catch 

  res.status(200).json({ name: 'John Doe' })
}
