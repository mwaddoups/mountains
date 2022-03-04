import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import tw from "twin.macro";
import kitListURL from "./KitList.md";

const Section = tw.div`rounded shadow p-4 mb-4`

const MainHeading = tw.h1`text-3xl mb-2 font-bold tracking-tight`
const Paragraph = tw.p`mb-2 font-light`
const UList = tw.ul`list-disc ml-6 mb-2 font-light tracking-wide`
const OList = tw.ol`list-decimal ml-6 mb-2`
const LI = tw.li`font-light tracking-wide`
const SubHeading = tw.h2`text-2xl mb-2 font-bold tracking-tight`
const SmallHeading = tw.h3`text-lg mb-2 font-bold tracking-tight`
const Bolded = tw.p`text-gray-700 font-bold italic`
const Italic = tw.p`text-gray-700 text-xs italic`

export default function KitList() {
  const [kitList, setKitList] = useState('');

  useEffect(() => {
    async function f() {
      let response = await fetch(kitListURL);
      let text = await response.text();
      return text;
    }
    f().then(text => setKitList(text))
    
    window.scrollTo(0, 0);
  }, [])

  return (
    <Section>
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
        {kitList}
      </ReactMarkdown>
    </Section>
  )
}