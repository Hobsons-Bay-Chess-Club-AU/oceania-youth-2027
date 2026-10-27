"use client";
import { FormEvent, useState } from "react";
import { siteConfig } from "@/lib/site-config";
type SubmitState = "idle" | "submitting" | "success" | "error";
function buildMailtoHref(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const organization = String(data.get("organization") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim() || "Contact enquiry";
    const message = String(data.get("message") ?? "").trim();
    const lines = [
        `Name: ${name}`,
        `Email: ${email}`,
        organization ? `Organisation: ${organization}` : "",
        "",
        message,
    ].filter(Boolean);
    return `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
export function ContactForm() {
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [statusMessage, setStatusMessage] = useState("");
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        if (String(formData.get("company") ?? "").trim()) {
            return;
        }
        if (!siteConfig.contact.formEndpoint) {
            window.location.href = buildMailtoHref(form);
            setSubmitState("success");
            setStatusMessage("Your message draft has been opened in your email app.");
            return;
        }
        try {
            setSubmitState("submitting");
            setStatusMessage("");
            const response = await fetch(siteConfig.contact.formEndpoint, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Unable to send message");
            }
            form.reset();
            setSubmitState("success");
            setStatusMessage("Thanks for reaching out. Your message has been sent successfully.");
        }
        catch {
            setSubmitState("error");
            setStatusMessage("We could not send your message right now. Please email the organising team directly.");
        }
    }
    return (<form className="inquiry-form" onSubmit={handleSubmit}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden"/>
      <input type="hidden" name="_subject" value="Oceania Youth Zonal 2027 contact enquiry"/>

      <div className="subgrid">
        <label>
          Full Name
          <input required type="text" name="name" placeholder="Your name" autoComplete="name"/>
        </label>

        <label>
          Email Address
          <input required type="email" name="email" placeholder="name@domain.com" autoComplete="email"/>
        </label>
      </div>

      <div className="subgrid">
        <label>
          Federation or Club
          <input type="text" name="organization" placeholder="e.g. Chess Victoria / NZCF" autoComplete="organization"/>
        </label>

        <label>
          Subject
          <input required type="text" name="subject" placeholder="Enquiry topic"/>
        </label>
      </div>

      <label>
        Message
        <textarea required name="message" rows={5} placeholder="Please describe your question..."/>
      </label>

      <div className="flexline">
        <p>
          Direct email:{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
        </p>
        <button type="submit" disabled={submitState === "submitting"}>
          {submitState === "submitting" ? "Sending..." : "Submit Inquiry"}
        </button>
      </div>

      {statusMessage && (<p role="status" className={`form-status ${submitState === "error" ? "error" : "success"}`}>
          {statusMessage}
        </p>)}
    </form>);
}
