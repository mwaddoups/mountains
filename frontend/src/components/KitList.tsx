import React, { useEffect, useState } from "react";
import { Section } from "./Base";
import ClydeMarkdown from "./ClydeMarkdown";
import kitListURL from "./KitList.md";


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