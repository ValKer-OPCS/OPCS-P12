/* eslint-disable @typescript-eslint/no-explicit-any */


import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

describe("ContactForm - Jest full test suite", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    ) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form", () => {
    render(<ContactForm />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders all input fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accepte que/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: /Envoyer le message/i })
    ).toBeInTheDocument();
  });

  it("allows typing into fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/Nom/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, "Valentin");
    await user.type(emailInput, "test@example.com");
    await user.type(messageInput, "Hello world");

    expect(nameInput).toHaveValue("Valentin");
    expect(emailInput).toHaveValue("test@example.com");
    expect(messageInput).toHaveValue("Hello world");
  });

  it("submits the form and calls fetch", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nom/i), "Valentin");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello world");
    await user.click(screen.getByLabelText(/j.?accepte/i));

    await user.click(screen.getByRole("button", { name: /Envoyer le message/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("shows success message after successful submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nom/i), "Valentin");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello");
    await user.click(screen.getByLabelText(/j.?accepte/i));

    await user.click(screen.getByRole("button", { name: /Envoyer le message/i }));

    expect(await screen.findByText(/message envoyé/i)).toBeInTheDocument();
  });

  it("resets fields after successful submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/Nom/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, "Valentin");
    await user.type(emailInput, "test@example.com");
    await user.type(messageInput, "Hello");
    await user.click(screen.getByLabelText(/j.?accepte/i));

    await user.click(screen.getByRole("button", { name: /Envoyer le message/i }));

    await waitFor(() => {
      expect(nameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
      expect(messageInput).toHaveValue("");
    });
  });

  it("shows error message when fetch fails", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 500
    })
  ) as any;

  const user = userEvent.setup();
  render(<ContactForm />);

  await user.type(screen.getByLabelText(/Nom/i), "Valentin");
  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.type(screen.getByLabelText(/message/i), "Hello");
  await user.click(screen.getByLabelText(/j.?accepte/i));

  await user.click(screen.getByRole("button", { name: /Envoyer le message/i }));

  expect(
    await screen.findByText(/Une erreur interne/i)
  ).toBeInTheDocument();
});


  it("disables the submit button while submitting", async () => {
    let resolveFetch!: (value: any) => void;

    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    ) as any;

    const user = userEvent.setup();
    jest.spyOn(console, "error").mockImplementation(() => { });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nom/i), "Valentin");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello");
    await user.click(screen.getByLabelText(/j.?accepte/i));

    const button = screen.getByRole("button", { name: /Envoyer le message/i });

    await user.click(button);

    expect(button).toBeDisabled();

    resolveFetch({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("requires GDPR consent before submitting", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Nom/i), "Valentin");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello");

    const button = screen.getByRole("button", { name: /Envoyer le message/i });

    await user.click(button);

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
