import { WAConnection } from "@adiwajshing/baileys";

import WaService from "../../services/WaService";

export default async (req, res) => {
  const conn = new WAConnection();
  await conn.connect();

  const waService = new WaService(conn);

  waService.connectToWhatsApp();

  res.status(200).json({ status: "ok" });
};
