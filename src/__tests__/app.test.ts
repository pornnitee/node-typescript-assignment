import request from "supertest";
import { app } from "../index";

describe("GET /", () => {
  it("should return data with dynamic properties and valid values", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);

    const responseKeys = Object.keys(response.body);

    expect(responseKeys.length).toBeGreaterThan(0);

    responseKeys.forEach((key) => {
      const department = response.body[key];

      expect(department).toHaveProperty("male");
      expect(department).toHaveProperty("female");
      expect(department).toHaveProperty("ageRange");
      expect(department).toHaveProperty("hair");
      expect(department).toHaveProperty("addressUser");

      expect(department.male).toBeGreaterThanOrEqual(0);
      expect(department.female).toBeGreaterThanOrEqual(0);

      expect(department.ageRange).toMatch(/^\d{2}-\d{2}$/);

      expect(Object.keys(department.hair).length).toBeGreaterThan(0);
      expect(Object.keys(department.addressUser).length).toBeGreaterThan(0);
    });
  });
});
