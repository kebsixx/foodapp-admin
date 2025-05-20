import React from "react";
import Link from "next/link";

const PrivacyPolicy = () => {
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
          Kembali ke Beranda
        </Link>

        <div className="bg-white shadow-md rounded-lg p-8 border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8">Last updated: May 17, 2025</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg">
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use
              the Service and tells You about Your privacy rights and how the
              law protects You.
            </p>

            <p className="text-lg">
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy. This Privacy
              Policy has been created with the help of the{" "}
              <a
                href="https://www.termsfeed.com/privacy-policy-generator/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7FCD91] hover:text-[#6ab97c]">
                Privacy Policy Generator
              </a>
              .
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Interpretation and Definitions
            </h2>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Interpretation
            </h3>
            <p className="text-lg">
              The words of which the initial letter is capitalized have meanings
              defined under the following conditions. The following definitions
              shall have the same meaning regardless of whether they appear in
              singular or in plural.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Definitions
            </h3>
            <p className="text-lg">For the purposes of this Privacy Policy:</p>

            <ul className="list-disc pl-8 space-y-3 mt-4 text-lg">
              <li>
                <strong>Account</strong> means a unique account created for You
                to access our Service or parts of our Service.
              </li>
              <li>
                <strong>Affiliate</strong> means an entity that controls, is
                controlled by or is under common control with a party, where
                &quot;control&quot; means ownership of 50% or more of the
                shares, equity interest or other securities entitled to vote for
                election of directors or other managing authority.
              </li>
              <li>
                <strong>Application</strong> refers to Cerita Senja Cafe, the
                software program provided by the Company.
              </li>
              <li>
                <strong>Company</strong> (referred to as either &quot;the
                Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot;
                in this Agreement) refers to Cerita Senja Cafe.
              </li>
              <li>
                <strong>Country</strong> refers to: Indonesia
              </li>
              <li>
                <strong>Device</strong> means any device that can access the
                Service such as a computer, a cellphone or a digital tablet.
              </li>
              <li>
                <strong>Personal Data</strong> is any information that relates
                to an identified or identifiable individual.
              </li>
              <li>
                <strong>Service</strong> refers to the Application.
              </li>
              <li>
                <strong>Service Provider</strong> means any natural or legal
                person who processes the data on behalf of the Company. It
                refers to third-party companies or individuals employed by the
                Company to facilitate the Service, to provide the Service on
                behalf of the Company, to perform services related to the
                Service or to assist the Company in analyzing how the Service is
                used.
              </li>
              <li>
                <strong>Usage Data</strong> refers to data collected
                automatically, either generated by the use of the Service or
                from the Service infrastructure itself (for example, the
                duration of a page visit).
              </li>
              <li>
                <strong>You</strong> means the individual accessing or using the
                Service, or the company, or other legal entity on behalf of
                which such individual is accessing or using the Service, as
                applicable.
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Collecting and Using Your Personal Data
            </h2>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Types of Data Collected
            </h3>

            <h4 className="text-xl font-medium text-gray-900 mt-6 mb-3">
              Personal Data
            </h4>
            <p className="text-lg">
              While using Our Service, We may ask You to provide Us with certain
              personally identifiable information that can be used to contact or
              identify You. Personally identifiable information may include, but
              is not limited to:
            </p>

            <ul className="list-disc pl-8 space-y-3 mt-4 text-lg">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Usage Data</li>
            </ul>
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Contact Us
            </h2>
            <p className="text-lg">
              If you have any questions about this Privacy Policy, You can
              contact us:
            </p>

            <ul className="list-disc pl-8 space-y-3 mt-4 text-lg">
              <li>
                By email:{" "}
                <a
                  href="mailto:zieqanw@outlook.com"
                  className="text-[#7FCD91] hover:text-[#6ab97c]">
                  zieqanw@outlook.com
                </a>
              </li>
              <li>
                By visiting this page on our website:{" "}
                <a
                  href="https://ceritasenjacafe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7FCD91] hover:text-[#6ab97c]">
                  https://ceritasenjacafe.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
