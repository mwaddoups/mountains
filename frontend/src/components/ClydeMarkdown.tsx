import React from "react";
import ReactMarkdown from "react-markdown";
import tw from "twin.macro";

const MainHeading = tw.h1`text-3xl mb-2 font-bold tracking-tight`
const Paragraph = tw.p`mb-2 font-light text-sm`
const UList = tw.ul`list-disc ml-6 mb-2 text-sm font-light tracking-wide`
const OList = tw.ol`list-decimal ml-6 mb-2 text-sm font-light tracking-wide`
const LI = tw.li`font-light tracking-wide text-sm`
const SubHeading = tw.h2`text-2xl mb-2 font-bold tracking-tight`
const SmallHeading = tw.h3`text-lg mb-2 font-bold tracking-tight`
const Bolded = tw.p`text-gray-700 font-bold italic`
const Italic = tw.p`text-gray-700 text-xs italic`
const Link = tw.a`text-blue-700 hover:text-blue-400`

interface ClydeMarkdownProps {
  children: React.ReactNode
}

export default function ClydeMarkdown({ children }: ClydeMarkdownProps) {
  return children ? (
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
        a: Link,
      }}>
      {children.toString()}
    </ReactMarkdown>
  ) : <></>
}