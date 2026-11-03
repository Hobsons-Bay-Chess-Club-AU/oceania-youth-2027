"use client";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { RegistrationRoadmap } from "@/components/registration-roadmap";
import { RegistrationTimeline } from "@/components/registration-timeline";
import { useState } from "react";
const OFFICIAL_REGISTRATION_URL = siteConfig.links.registrations;
export function RegistrationPage() {
    const [isOfficialPlayer, setIsOfficialPlayer] = useState(false);
    const [isEarlyBird, setIsEarlyBird] = useState(true);
    const [divisionSelect, setDivisionSelect] = useState("U14 Open");
    // Official Fee Structure:
    // Registration Fee: $130 AUD (Waived for Official Federation Invited Players)
    // Entry Fee: Early Bird (before Aug 1, 2027) = $130 AUD, General = $170 AUD
    // Rapid & Blitz: $0 AUD (Included in Championship Package!)
    const registrationFee = isOfficialPlayer ? 0 : 130;
    const entryFee = isEarlyBird ? 130 : 170;
    const totalFee = registrationFee + entryFee;
    return (<div className="page-registration">
    <section className="page-title">
    <div className="eyebrow">
    <span></span>Official Player Entry Portal</div>
    <h1>Registration &amp; Fee Calculator</h1><p>Register for Oceania Youth 2027, calculate official entry fees, explore Pacific Island grants, and enter the First 300 Lucky Draw.</p><div>
    <div className="flexline">
    <a href={OFFICIAL_REGISTRATION_URL} target="_blank" rel="noreferrer" className="action"><span>Open Official Registration Portal</span><span>↗</span></a><a href="/OceaniaYouth%202027%20Tournament%20Pack.pdf" download="OceaniaYouth 2027 Tournament Pack.pdf" target="_blank" rel="noreferrer" className="action"><span>📥 Download Tournament Pack (PDF)</span></a></div>
    </div>
    </section>
    <RegistrationRoadmap/>
    <RegistrationTimeline/>
    <section className="support-split">
    <div><span className="eyebrow">Federation Support Programme</span><h2>Registration and federation support</h2><p>Explore official delegation packages, accommodation support, Pacific Island travel grants, visa assistance and special prizes.</p></div>
    <div><p>Support is subject to available funding, sponsorship and organiser capacity. Review the full eligibility requirements and payment conditions before applying.</p><Link href="/federation-support" className="action">View Federation Support →</Link></div>
    </section>
    <section className="entry-workspace">
    <div className="fee-calculator" data-calculator="true">
    <div>
    <span className="eyebrow">Official Tournament Fees</span><h2>Fee Structure Calculator</h2><p>One registration fee grants access to Classical, Rapid, and Blitz championships (3-in-1 Package).</p></div>
    <div>
    <div>
    <label htmlFor="field-1">Age Championship Category:</label><select id="field-1" value={divisionSelect} onChange={(e) => setDivisionSelect(e.target.value)}><option value="U8 Open">Under 8 Open &amp; Girls</option><option value="U10 Open">Under 10 Open &amp; Girls</option><option value="U12 Open">Under 12 Open &amp; Girls</option><option value="U14 Open">Under 14 Open &amp; Girls</option><option value="U16 Open">Under 16 Open &amp; Girls</option><option value="U18 Open">Under 18 Open &amp; Girls</option><option value="U20 Open">Under 20 Premier Championship</option></select></div>
    <div className="flexline">
    <div>
    <span>Federation Status</span><span>Official Nominated Federation Player (Waives $130 reg fee)</span></div>
    <input type="checkbox" className="check" aria-label="Official Nominated Federation Player" checked={isOfficialPlayer} onChange={(e) => setIsOfficialPlayer(e.target.checked)}/></div>
    <div className="flexline">
    <div>
    <span>Early Bird Rate</span><span>Register before 1 August 2027 (Save $40 AUD)</span></div>
    <input type="checkbox" className="check" aria-label="Early Bird Rate" checked={isEarlyBird} onChange={(e) => setIsEarlyBird(e.target.checked)}/></div>
    <div className="fee-breakdown">
    <div className="flexline">
    <span>Championship Registration Fee:</span><span data-registration-fee="true">${registrationFee} AUD</span></div>
    <div className="flexline">
    <span>Championship Entry Fee ({isEarlyBird ? "Early Bird" : "Standard"}):</span><span data-entry-fee="true">${entryFee} AUD</span></div>
    <div className="flexline">
    <span>Rapid &amp; Blitz Side Championships:</span><span>INCLUDED ($0 AUD)</span></div>
    </div>
    <div className="fee-total">
    <div>
    <span className="eyebrow">Total Official Payable Fee</span><span>Includes Classical, Rapid &amp; Blitz entries</span></div>
    <span data-total-fee="true">${totalFee} AUD</span></div>
    </div>
    </div>
    <div className="registration-panel">
    <div>
    <span className="eyebrow">Registration Open</span><h2>Register for Oceania Youth 2027</h2><p>Complete your player registration through the official Hobsons Bay Chess Club portal.</p></div>
    <a href={OFFICIAL_REGISTRATION_URL} target="_blank" rel="noreferrer" className="action"><span>Register Now</span><span>↗</span></a>
    <div>
    <p>Early Bird discount applies to payments received on or before 1 August 2027.</p>
    <p>Need help with your entry or visa assistance documents? <a href="/contact-us">Contact the organising committee →</a></p></div>
    </div>
    </section>
    <section className="entry-assistance">
    <div>
    <div className="flexline">
    <span className="eyebrow">🎁 Lucky Draw Alert</span><span>First 300 Players</span></div>
    <h3>First 300 Entry Lucky Draw</h3><p>The first 300 players who complete their registration automatically qualify for a special draw featuring:</p><ul>
    <li>
• 5x DGT Electronic Chess Clocks</li>
    <li>
• 1x ChessNut Go Smart Electronic Chess Board</li>
    </ul>
    </div>
    <div>
    <div className="flexline">
    <span className="eyebrow">✈️ Federation Support</span><span>$1,000 AUD Grant</span></div>
    <h3>Pacific Island Assistance Scheme</h3><p>First 3 Pacific Island federations (outside Australia &amp; New Zealand) registering 5+ players by <strong>1 March 2027</strong> receive a <strong>$1,000 AUD travel grant</strong>.</p><Link href="/federation-support#travel-assistance" className="action">Eligibility &amp; Conditions →</Link></div>
    </section>
    </div>);
}
