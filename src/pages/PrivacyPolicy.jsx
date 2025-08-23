import React from "react";

export default function PrivacyPolicy() {
  return (
    <section className="py-28 px-4 bg-gradient-to-br from-[#f5f9ff] to-[#e6f0ff] text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 text-[#012A56]">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-base sm:text-lg leading-relaxed text-gray-700">
          <p>
            At <strong>QuickmySlot Technologies</strong>, we are committed to
            protecting your privacy and ensuring that your personal information
            is handled in a safe and responsible manner. This Privacy Policy
            explains how we collect, use, disclose, and protect your information
            when you visit our website or use our services.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56] mb-2">
              1. Information We Collect
            </h2>
            <p>We may collect the following types of information:</p>

            <h3 className="font-medium text-[#012A56] mt-4">
              a. Personal Information
            </h3>
            <ul className="list-disc ml-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Company name</li>
              <li>IP address</li>
              <li>Any other information voluntarily provided by you</li>
            </ul>

            <h3 className="font-medium text-[#012A56] mt-4">
              b. Non-Personal Information
            </h3>
            <ul className="list-disc ml-6">
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Time and date of access</li>
              <li>Pages visited</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56]">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc ml-6">
              <li>To provide and maintain our services</li>
              <li>To improve user experience and website functionality</li>
              <li>
                To communicate with you (e.g., send updates, respond to
                inquiries)
              </li>
              <li>
                To send newsletters or marketing communications (if opted-in)
              </li>
              <li>To analyze website traffic and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56]">
              3. Sharing Your Information
            </h2>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. However, we may share your data with:
            </p>
            <ul className="list-disc ml-6">
              <li>
                Trusted third-party service providers who assist us in operating
                our website or conducting business
              </li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56]">
              4. Cookies and Tracking Technologies
            </h2>
            <p>
              Our website may use cookies and similar technologies to enhance
              your browsing experience. Cookies help us understand user behavior
              and preferences. You can modify your browser settings to decline
              cookies if you prefer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56]">
              5. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your
              personal data from unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet
              is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56]">
              6. Your Rights
            </h2>
            <ul className="list-disc ml-6">
              <li>Access the personal data we hold about you</li>
              <li>Request corrections or updates to your information</li>
              <li>Withdraw your consent (where applicable)</li>
              <li>
                Request deletion of your data (subject to legal obligations)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56]">
              7. Third-Party Links
            </h2>
            <p>
              Our website may contain links to other sites. We are not
              responsible for the privacy practices of those sites. We encourage
              you to read their privacy policies when you leave our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56]">
              8. Children’s Privacy
            </h2>
            <p>
              Our services are not intended for individuals under the age of 13.
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56]">
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We encourage
              you to review it periodically. Changes will be posted on this page
              with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#012A56]">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or your
              personal data, please contact us at:
            </p>
            <p className="mt-2">
              <strong>QuickmySlot Technologies</strong>
              <br />
              Email:{" "}
              <a
                href="mailto:support@QuickmySlottech.com"
                className="text-blue-600 underline"
              >
                support@QuickmySlottech.com
              </a>
              <br />
              Phone: +91-9782488408, +91-7976114618
              <br />
              Address: 109-A Bajrangdeep colony, Jagatpura, Jaipur, 302022
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
