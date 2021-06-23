import React from "react";
import AuthSubmissionBtn from "../AuthSubmissionBtn";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

test("Makes sure Login button has Log In text in it", () => {
    const { getByTestId } = render(<AuthSubmissionBtn value="Log In" type="login" inProgress={false} loading={false} />);
    const loginBtn = getByTestId("login-sub-btn");
    expect(loginBtn.value).toBe("Log In");
});