// src/TermsOfService.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./TermsOfService.css"

function TermsOfService() {

    const navigate = useNavigate();

    return (
        <div className="terms-of-service">
            <h1>Terms of Service</h1>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree with these terms, you are prohibited from using or accessing this site.</p>
            <h2>Modification of Terms</h2>
            <p>We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting on the website.</p>
            <h2>User Responsibilities</h2>
            <p>As a user, you agree to use the site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the site.</p>
            <h2>Privacy Policy</h2>
            <p>Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and safeguard your information.</p>
            <h2>Intellectual Property</h2>
            <p>All content included on this site, such as text, graphics, logos, images, and software, is the property of the site owner or its content suppliers and is protected by copyright laws.</p>
            <h2>Termination</h2>
            <p>We may terminate or suspend your access to our site immediately, without prior notice or liability, for any reason, including if you breach these terms.</p>
            <h2>Governing Law</h2>
            <p>These terms shall be governed and construed in accordance with the laws of Bosnia and Hercegovina, without regard to its conflict of law provisions.</p>
            <h2>Contact Information</h2>
            <p>For any questions about these terms, please contact us at fejzo999@gmail.com.</p>
        </div>
    );
}

export default TermsOfService;
