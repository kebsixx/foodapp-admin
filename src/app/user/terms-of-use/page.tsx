import React from "react";
import Link from "next/link";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center text-[#7FCD91] hover:text-[#6ab97c] mb-8 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white shadow-md rounded-lg p-8 border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Terms of Use
          </h1>
          <p className="text-gray-600 mb-8">Last updated: May 21, 2025</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg">
              This document is a legal agreement between you (the user) and us
              (Cerita Senja) when you use our application or website. By using
              this application, you agree to all the rules within it. If you do
              not agree, please do not use our application.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              What You Need to Know:
            </h2>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Our Services
            </h3>
            <p className="text-lg">
              This application is made for use in Indonesia. If you use it from
              abroad, you are responsible for complying with the rules there.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Copyright
            </h3>
            <ul className="list-disc pl-8 space-y-3 mt-4 text-lg">
              <li>
                Everything in the application (design, text, photos, etc.)
                belongs to us. You may use it for your personal or internal
                business use, but it may not be copied or sold without
                permission.
              </li>
              <li>
                If you send suggestions or comments (feedback), we have the
                right to use them.
              </li>
              <li>
                If you post content (e.g., reviews, if that feature is available
                later), you grant us permission to use it. You are fully
                responsible for what you post.
              </li>
              <li>
                If you see any content in the application that infringes
                copyright, please contact us immediately.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
              3. User Rules
            </h3>
            <ul className="list-disc pl-8 space-y-3 mt-4 text-lg">
              <li>
                Ensure all information you provide when registering an account
                is true and up-to-date.
              </li>
              <li>Keep your password confidential.</li>
              <li>
                Do not use the application for illegal, deceptive, or harmful
                activities.
              </li>
              <li>Do not attempt to hack or disrupt our application.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
              4. Products & Payments
            </h3>
            <ul className="list-disc pl-8 space-y-3 mt-4 text-lg">
              <li>
                We strive to display products as accurately as possible, but do
                not guarantee 100% exact matches. Prices and availability may
                change.
              </li>
              <li>
                Payments are made via **direct bank transfer** in **Rupiah
                (IDR)**. You will upload proof of transfer in the application.
              </li>
              <li>All sales are final; no refunds will be issued.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
              5. Our Responsibility
            </h3>
            <ul className="list-disc pl-8 space-y-3 mt-4 text-lg">
              <li>
                We provide services &quot;as is.&quot; We are not responsible
                for minor errors, personal damage, or problems caused by third
                parties (e.g., viruses).
              </li>
              <li>
                Our liability is limited to the lesser of the total amount you
                have paid us in the last 6 months, or **Rp 1,000,000**.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
              6. User Data
            </h3>
            <p className="text-lg">
              We will store the data you transmit for the purpose of managing
              the performance of the application, but you are responsible for
              the data you submit.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">
              7. Contact Us
            </h3>
            <p className="text-lg">
              If you have any complaints or questions, you can contact us via:
            </p>
            <ul className="list-disc pl-8 space-y-3 mt-4 text-lg">
              <li>
                Email:{" "}
                <a
                  href="mailto:cerita@senja.id"
                  className="text-[#7FCD91] hover:text-[#6ab97c]">
                  cerita@senja.id
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+6285175003172"
                  className="text-[#7FCD91] hover:text-[#6ab97c]">
                  085175003172
                </a>
              </li>
              <li>
                Address: Jl. Gubernur Sunandar Prijosoedarmo No.29, Sidoarjo,
                Jawa Timur 61262, Indonesia
              </li>
            </ul>

            <p className="text-lg mt-8">
              We reserve the right to change these Terms of Use at any time. By
              continuing to use the application, you are deemed to have accepted
              these changes.
            </p>
            <p className="text-lg">
              Thank you for using the Cerita Senja Cafe app!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
