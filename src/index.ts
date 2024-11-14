import express, { Request, Response } from "express";
import axios from "axios";

export const app = express();
const PORT = 3000;

app.get("/", async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://dummyjson.com/users");
    const { users } = response.data;
    const groupedItems = users.reduce((accumulator: any, user: any) => {
      const { department } = user.company;
      if (!accumulator[department]) {
        accumulator[department] = {
          male: 0,
          female: 0,
          ageRange: "",
          hair: {},
          addressUser: {},
        };
      }

      accumulator[department][user.gender] =
        (accumulator[department][user.gender] || 0) + 1;

      accumulator[department]["hair"][user.hair.color] =
        (accumulator[department]["hair"][user.hair.color] || 0) + 1;

      accumulator[department]["addressUser"][user.firstName + user.lastName] =
        user.address.postalCode;

      const currentAge = accumulator[department]["ageRange"];
      const mergedAgeRange = [
        ...currentAge
          .split("-")
          .filter((str: string) => str !== "" && Number(str)),
        user.age,
      ];
      accumulator[department]["ageRange"] = `${Math.min(
        ...mergedAgeRange
      )}-${Math.max(...mergedAgeRange)}`;
      return accumulator;
    }, {});

    app.set("json spaces", 2);
    res.json(groupedItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}
