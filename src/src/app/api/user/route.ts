import type { NextApiRequest, NextApiResponse } from "next";

import { userService } from "@/lib/user-service";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;
  const user = await userService.getUserByEmail(email as string);
  res.status(200).json(user);
}