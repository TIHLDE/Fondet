import { HttpFunction } from "@google-cloud/functions-framework";
import { Request, Response } from "express";

export const getPerformance: HttpFunction = (req: Request, res: Response) => {
  res.status(200).send("hello world");
};
