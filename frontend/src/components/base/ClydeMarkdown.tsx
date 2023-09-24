import React from "react";
import ReactMarkdown from "react-markdown";
import { Bolded, Heading, Italic, LI, OList, Paragraph, SmallHeading, SubHeading, UList, Image, Link } from "./Base";

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