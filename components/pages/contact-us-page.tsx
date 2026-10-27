import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
export function ContactUsPage() {
    return (<div className="page-contact">
    <section className="page-title">
    <div className="eyebrow">
    <span></span>Direct Inquiry Hub</div>
    <h1>Contact Organising Committee</h1><p>Have questions about Oceania Youth Zonal 2027? Get in touch with our tournament operations team directly.</p><div>
    <div className="flexline">
    <a href="mailto:major_tournaments@hobsonsbaychess.com" className="action"><span>Email Organisers</span><span>✉️</span></a></div>
    </div>
    </section>
    <section className="contact-workspace">
    <div className="contact-form">
    <div>
    <span className="eyebrow">Send Message</span><h2>Inquiry Form</h2></div>
    <ContactForm /></div>
    <div className="contact-notes">
    <div>
    <div>
    <span className="eyebrow">Direct Details</span><h2>Committee Info</h2></div>
    <div>
    <div>
    <span className="eyebrow">Committee Name</span><span>IA Casey Goh (Event Director) &amp; HBCC Committee</span></div>
    <div>
    <span className="eyebrow">Official Email</span><a href="mailto:major_tournaments@hobsonsbaychess.com">major_tournaments@hobsonsbaychess.com</a></div>
    <div>
    <span className="eyebrow">Response Window</span><span>We aim to reply to all federation and player enquiries within 1 to 2 business days.</span></div>
    </div>
    </div>
    <div>
    <span className="eyebrow">Common Topics</span><div>
    <div className="flexline">
    <span>🌐</span><span>Player eligibility and federation matters</span></div>
    <div className="flexline">
    <span>✈️</span><span>Travel, accommodation, and venue planning</span></div>
    <div className="flexline">
    <span>📝</span><span>Registration timing and entry fee questions</span></div>
    <div className="flexline">
    <span>🤝</span><span>Volunteer, sponsor, and partner inquiries</span></div>
    </div>
    </div>
    </div>
    </section>
    </div>);
}
