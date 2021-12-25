import { Request, Response } from "express";
import { HttpFunction } from "@google-cloud/functions-framework";
import axios from "axios";

export const getPerformance: HttpFunction = (_: Request, res: Response) => {
  Promise.all([
    axios
      .post("https://www.nordnet.no/api/2/login/anonymous")
      .then((login) =>
        axios.get(
          "https://www.nordnet.no/api/2/indicators/historical/returns/OSE:OSEBX",
          {
            headers: {
              Cookie: `NOW=${login.data.session_id}`,
            },
          }
        )
      )
      .catch((error) => Promise.reject(error)),
    axios.get(
      `https://www.shareville.no/api/v1/portfolios/${process.env.SHAREVILLE_ID}/performance`
    ),
  ])
    .then(([indexResponse, performanceResponse]) => {
      res.status(200).send([indexResponse.data, performanceResponse.data]);
    })
    .catch((error) => {
      // TODO: Log error
      console.log(error);
      res.sendStatus(500);
    });
};
