"use client";

import Navbar from "@/components/userNavbar";
import IntroNavbar from "@/components/introNavbar";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FooterS from "@/components/footerS";

function Page() {
  const { user } = useSelector((state: RootState) => state.user);
  const terms = [
    "1. Welcome to our Social Media Website.",
    "2. These Terms and Conditions govern your use of this Site.",
    "3. By accessing the Site, you agree to these Terms and Conditions.",
    "4. Please read them carefully before using our services.",
    "5. Use of the website is entirely at your own risk.",
    '6. The site is provided "as is" without any warranties.',
    "7. We do not guarantee any specific results from your usage.",
    "8. All content on the site is for general informational purposes only.",
    "9. No warranties are provided regarding the accuracy of the content.",
    "10. Your use signifies acceptance of these Terms and Conditions.",
    "11. This website is a platform for social networking and user interactions.",
    "12. Users are solely responsible for their own interactions on the site.",
    "13. Privacy protection is solely the user’s responsibility.",
    "14. We do not monitor private communications between users.",
    "15. Any personal information you disclose is at your own risk.",
    "16. You are advised to protect your personal data and online identity.",
    "17. We assume no liability for misuse of your personal data.",
    "18. Your use of the site indicates that you accept these terms.",
    "19. These Terms may be updated or modified at any time.",
    "20. Continued use of the site signifies that you accept any updates.",
    "21. No professional or legal advice is offered on this website.",
    "22. Content may be modified or removed at our discretion.",
    "23. We do not guarantee continuous availability of the site.",
    "24. Technical issues may lead to temporary service interruptions.",
    "25. We are not liable for any loss of data incurred while using the site.",
    "26. We do not oversee interactions between members of the community.",
    "27. All user conduct is solely your responsibility.",
    "28. We are not liable for defamatory or harmful posts by users.",
    "29. Users must respect the intellectual property rights of others.",
    "30. Ownership of user-generated content remains with the authors.",
    "31. Content posted on the site is managed entirely by its respective authors.",
    "32. The site does not exercise control over external links posted.",
    "33. We are not responsible for the content on any linked websites.",
    "34. Use of external links is entirely at your own discretion and risk.",
    '35. Our service is provided on an "as is" basis without guarantees.',
    "36. We offer no warranties regarding the protection of user privacy.",
    "37. You are encouraged to be cautious when sharing personal details.",
    "38. Communications on this platform may not be secure.",
    "39. Additional privacy safeguards are recommended for your protection.",
    "40. We explicitly disclaim any obligation for ensuring user privacy.",
    "41. All disputes will be subject to the applicable local laws.",
    "42. We reserve the right to update or modify these Terms at any time.",
    "43. Any updates will be posted on the website for your review.",
    "44. Your ongoing use of the site confirms your acceptance of any changes.",
    "45. The website is intended primarily for personal use.",
    "46. Commercial use of this website may require additional agreements.",
    "47. By using the site, you consent to the processing of your data as specified.",
    "48. Data processing policies are outlined in our Privacy Policy.",
    "49. Notably, the Privacy Policy does not override your responsibility for your own privacy.",
    "50. You acknowledge that privacy protection is managed entirely by you.",
    "51. The company does not actively secure your personal data.",
    "52. Users must take their own precautions to secure their information.",
    "53. We do not provide personalized security or privacy advice.",
    "54. Sharing any sensitive or personal information is entirely at your own risk.",
    "55. By using our service, you assume all risks associated with disclosure.",
    "56. We disclaim any liability for breaches of privacy that may occur.",
    "57. The company is not responsible for cases of identity theft linked to user activity.",
    "58. All safety measures related to data are voluntary and user-implemented.",
    "59. Users should secure their accounts with strong, unique passwords.",
    "60. While we encourage encryption, it is not enforced by the site.",
    "61. Inappropriate behavior may result in content removal or account suspension.",
    "62. Moderation is performed at our sole discretion without guarantee.",
    "63. We reserve the right to remove any content without prior notice.",
    "64. The site is not liable for the removal of user-generated content.",
    "65. All content is presented without prior screening or endorsement.",
    "66. We disclaim any liability for third-party actions or posts.",
    "67. External links are offered solely for user convenience.",
    "68. We do not monitor or endorse any third-party websites linked here.",
    "69. Use of any external links is governed by their own respective terms.",
    "70. We cannot be held liable for any damages from using external websites.",
    "71. Each user is responsible for the security of their personal devices.",
    "72. We do not guarantee that transmissions will be free of viruses or errors.",
    "73. The site is not responsible for any damages resulting from its use.",
    "74. The company assumes no responsibility for errors made by users.",
    "75. Users are advised to independently verify any information before acting upon it.",
    "76. All commercial deals and user transactions occur solely between users.",
    "77. We do not take responsibility for any transactions conducted on the site.",
    "78. Any payment or value exchange is managed entirely by the users involved.",
    "79. The site makes no warranties regarding user-to-user transactions.",
    "80. Refunds, compensations, or adjustments are not the company’s responsibility.",
    "81. Use of the website remains entirely at your personal discretion.",
    "82. Users agree to indemnify and hold the company harmless from any claims.",
    "83. This indemnification covers disputes arising from user interactions.",
    "84. Errors or omissions in content may occur without warning.",
    "85. This website may change at any time without prior notification.",
    "86. We do not guarantee that the content is complete or error-free.",
    "87. Feedback is welcome but does not constitute an offer to modify the Terms.",
    "88. The guidelines set out in these Terms are considered final and binding.",
    "89. No assurances are given regarding uninterrupted service availability.",
    "90. We are not accountable for any interruption to the services provided.",
    "91. Your use of this website indicates your free and informed consent to these terms.",
    "92. These Terms and Conditions are governed by the laws where the service operates.",
    "93. Any disputes will be resolved under the jurisdiction of the relevant authorities.",
    "94. Claims relating to content removal or account suspension are non-negotiable.",
    "95. You acknowledge that digital communications inherently carry risks.",
    "96. There is no guarantee of confidentiality in any communications on the site.",
    "97. The company is not responsible for any unauthorized data disclosures.",
    "98. Indemnification clauses extend to all users on this platform.",
    "99. These Terms constitute the entire agreement between you and the company.",
    "100. Your continued use of this website confirms your full acceptance and waiver of claims regarding liability.",
  ];

  return (
    <>
      {user ? <Navbar /> : <IntroNavbar />}
      <header className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg text-center p-6 mb-8">
          <h2 className="text-3xl font-semibold mb-2">
            Terms &amp; Conditions
          </h2>
          <p className="text-sm text-gray-500">Last updated: [2025]</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 space-y-2">
          {terms.map((term, index) => (
            <p key={index} className="text-gray-700 text-sm">
              {term}
            </p>
          ))}
        </div>
      </main>
      <FooterS />
    </>
  );
}

export default Page;
