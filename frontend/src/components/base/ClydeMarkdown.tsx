import React from "react";
import ReactMarkdown from "react-markdown";
import tw from "twin.macro";
import { Bolded, Heading, Italic, LI, OList, Paragraph, SmallHeading, SubHeading, UList, Image } from "./Base";

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
        h1: Heading,
        h2: SubHeading,
        h3: SmallHeading,
        strong: Bolded,
        em: Italic,
        a: Link,
        img: Image,
      }}>
      {children.toString()}
    </ReactMarkdown>
  ) : <></>
}