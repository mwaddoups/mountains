import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import tw from "twin.macro";
import privacyPolicy from "./PrivacyPolicy.md";

const MainHeading = tw.h1`text-3xl mb-2`
const Paragraph = tw.p`whitespace-pre-line mb-2 text-sm`
const UList = tw.ul`list-disc ml-6 mb-2`
const OList = tw.ol`list-decimal ml-6 mb-2`
const LI = tw.li`text-sm`
const SubHeading = tw.h2`text-2xl mb-2 font-bold`
const SmallHeading = tw.h3`text-lg mb-2 font-bold`
const Bolded = tw.p`text-gray-700 font-bold italic`
const Italic = tw.p`text-gray-700 text-xs italic`

export default function Privacy() {
  const [policy, setPolicy] = useState('');
  window.scrollTo(0, 0);

  useEffect(() => {
    async function f() {
      let response = await fetch(privacyPolicy);
      let text = await response.text();
      return text;
    }
    f().then(text => setPolicy(text))
  }, [])

  return (
    <div className="m-4 p-4 shadow">
      <ReactMarkdown
        components={{
          p: Paragraph,
          ul: UList,
          ol: OList,
          li: LI,
          h1: MainHeading,
          h2: SubHeading,
          h3: SmallHeading,
          strong: Bolded,
          em: Italic,
        }}>
        {policy}
      </ReactMarkdown>
    </div>
  )
}

