import { NextApiRequest, NextApiResponse } from "next";
import { getAccounts, createAccount } from "../../queries/accounts";
import { accountSchema } from "../../validators/account";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "GET") {
    const { kindeId } = req.query;
    const accounts = await getAccounts(kindeId as string);
    return res.status(200).json(accounts);
  }

  if (method === "POST") {
    try {
      const validatedData = accountSchema.parse(req.body);
      const account = await createAccount(validatedData);
      return res.status(201).json(account);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
