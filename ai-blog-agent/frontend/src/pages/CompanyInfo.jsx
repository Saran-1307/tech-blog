import React, { useState } from "react";

const CompanyInfo = () => {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms & Conditions" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 py-8 px-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Daily Scope
          </h1>
          <p className="text-slate-300 mt-2">
            Information, Policies, and Contact
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* ABOUT US TAB */}
          {activeTab === "about" && (
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <h2 className="text-2xl font-semibold text-gray-900">
                Cutting Through the Noise.
              </h2>
              <p>
                Welcome to Daily Scope, your curated lens on the world's most
                important stories.
              </p>
              <p>
                In today's fast-paced digital age, the sheer volume of news can
                be overwhelming. Daily Scope was built to solve that problem.
                Our mission is to filter through the daily noise and deliver
                concise, insightful, and high-quality coverage across
                Technology, World Events, Business, Sports, Health, and
                Entertainment. We believe that staying informed shouldn't feel
                like a chore, which is why we focus on clarity, context, and
                delivering the "why it matters" behind every headline.
              </p>
              <h3 className="text-xl font-medium text-gray-900 pt-4">
                Meet the Editor
              </h3>
              <p>
                Daily Scope is spearheaded by Lead Editor Alex Carter, an
                independent developer and tech enthusiast with a passion for
                digital media. By combining editorial judgment with modern
                curation tools, the goal is to create a reading experience that
                respects your time and intelligence.
              </p>
              <p className="font-medium text-gray-900 pt-2">
                Thank you for making Daily Scope a part of your daily routine.
              </p>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === "contact" && (
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <h2 className="text-2xl font-semibold text-gray-900">
                Get in Touch
              </h2>
              <p>
                We value feedback from our readers. Whether you have a question
                about our coverage, want to report a technical issue, or are
                interested in partnership opportunities, we would love to hear
                from you.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mt-4">
                <p className="font-medium text-lg text-gray-900">Email Us:</p>
                <a
                  href="mailto:hello@dailyscope.me"
                  className="text-blue-600 hover:underline text-lg block mb-4"
                >
                  hello@dailyscope.me
                </a>
                <p className="text-sm text-gray-500">
                  <strong>Response Time:</strong> We aim to respond to all
                  inquiries within 24-48 hours.
                </p>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY TAB */}
          {activeTab === "privacy" && (
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <h2 className="text-2xl font-semibold text-gray-900">
                Privacy Policy
              </h2>
              <p className="text-sm text-gray-500 italic">
                Effective Date: March 1, 2026
              </p>
              <p>
                At Daily Scope (accessible from dailyscope.me), one of our main
                priorities is the privacy of our visitors. This Privacy Policy
                document contains types of information that is collected and
                recorded by Daily Scope and how we use it.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 pt-2">
                Log Files
              </h3>
              <p>
                Daily Scope follows a standard procedure of using log files.
                These files log visitors when they visit websites. The
                information collected by log files includes internet protocol
                (IP) addresses, browser type, Internet Service Provider (ISP),
                date and time stamp, referring/exit pages, and possibly the
                number of clicks. These are not linked to any information that
                is personally identifiable. The purpose of the information is
                for analyzing trends, administering the site, tracking users'
                movement on the website, and gathering demographic information.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 pt-2">
                Google DoubleClick DART Cookie
              </h3>
              <p>
                Google is one of a third-party vendor on our site. It also uses
                cookies, known as DART cookies, to serve ads to our site
                visitors based upon their visit to our site and other sites on
                the internet. However, visitors may choose to decline the use of
                DART cookies by visiting the Google ad and content network
                Privacy Policy at the following URL:{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://policies.google.com/technologies/ads
                </a>
              </p>

              <h3 className="text-lg font-semibold text-gray-900 pt-2">
                Our Advertising Partners
              </h3>
              <p>
                Some of advertisers on our site may use cookies and web beacons.
                Our advertising partners include Google AdSense. Each of our
                advertising partners has their own Privacy Policy for their
                policies on user data.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 pt-2">
                Third-Party Privacy Policies
              </h3>
              <p>
                Daily Scope's Privacy Policy does not apply to other advertisers
                or websites. Thus, we are advising you to consult the respective
                Privacy Policies of these third-party ad servers for more
                detailed information. It may include their practices and
                instructions about how to opt-out of certain options.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 pt-2">
                Consent
              </h3>
              <p>
                By using our website, you hereby consent to our Privacy Policy
                and agree to its Terms and Conditions.
              </p>
            </div>
          )}

          {/* TERMS & CONDITIONS TAB */}
          {activeTab === "terms" && (
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <h2 className="text-2xl font-semibold text-gray-900">
                Terms and Conditions
              </h2>
              <p className="text-sm text-gray-500 italic">
                Effective Date: March 1, 2026
              </p>
              <p>Welcome to Daily Scope!</p>
              <p>
                These terms and conditions outline the rules and regulations for
                the use of Daily Scope's Website, located at dailyscope.me. By
                accessing this website, we assume you accept these terms and
                conditions. Do not continue to use Daily Scope if you do not
                agree to take all of the terms and conditions stated on this
                page.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 pt-2">
                License and Content Use
              </h3>
              <p>
                Unless otherwise stated, Daily Scope and/or its licensors own
                the intellectual property rights for all original material on
                Daily Scope. All intellectual property rights are reserved. As a
                news aggregator and curation platform, Daily Scope also
                references, links to, and provides commentary on third-party
                news sources. All rights to the original third-party content
                belong to their respective owners. We do not claim ownership of
                external syndicated content.
              </p>

              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <p className="font-semibold text-gray-900 mb-2">
                  You must not:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Republish original editorial content from Daily Scope
                    without proper attribution.
                  </li>
                  <li>Sell, rent, or sub-license material from Daily Scope.</li>
                  <li>
                    Reproduce, duplicate or copy material from Daily Scope for
                    commercial purposes.
                  </li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 pt-2">
                Disclaimer
              </h3>
              <p>
                To the maximum extent permitted by applicable law, we exclude
                all representations, warranties, and conditions relating to our
                website and the use of this website. We do not ensure that the
                information on this website is 100% correct, we do not warrant
                its completeness or accuracy; nor do we promise to ensure that
                the website remains available or that the material on the
                website is kept up to date.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
