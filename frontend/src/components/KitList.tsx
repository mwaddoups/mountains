import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import ClydeMarkdown from "./ClydeMarkdown";
import kitListURL from "./KitList.md";

const Section = tw.div`rounded shadow p-4 mb-4`

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
      <ClydeMarkdown>
        {kitList}
      </ClydeMarkdown>
    </Section>
  )
}