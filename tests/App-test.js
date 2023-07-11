import React from "react";
import { render } from "@testing-library/react-native";
import App from "../App";

test("App renders correctly", () => {
  const { getByText } = render(<App />);
  expect(
    getByText("Open up App.tsx to start working on your app!")
  ).toBeTruthy();
});
