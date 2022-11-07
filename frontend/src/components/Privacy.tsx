import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import ClydeMarkdown from "./ClydeMarkdown";
import privacyPolicy from "./PrivacyPolicy.md";

export default function Privacy() {
  const [policy, setPolicy] = useState('');

  useEffect(() => {
    async function f() {
      let response = await fetch(privacyPolicy);
      let text = await response.text();
      return text;
    }
    f().then(text => setPolicy(text))
    
    window.scrollTo(0, 0);
  }, [])

  return (
    <div className="m-4 p-4 shadow">
      <ClydeMarkdown>
        {policy}
      </ClydeMarkdown>
    </div>
  )
}

