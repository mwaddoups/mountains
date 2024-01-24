import React, { useCallback, useState } from "react";
import api from "../api";
import { getName } from "../methods/user";
import {
  Heading,
  Section,
  Paragraph,
  FormLabel,
  FormInput,
  FormSelect,
  FormButton,
  StrongParagraph,
  Error,
  SmallHeading,
  Button,
  SmallButton,
} from "./base/Base";
import { useAuth } from "./Layout";
import { useLocation } from "react-router-dom";

export default function JoinClub() {
  const { currentUser } = useAuth();

  return (
    <>
      <Section>
        <Heading>Joining the Club</Heading>
        <StrongParagraph>
          Please note: Membership is not required to come on your first few day
          walks! Our membership year ends on April 1, 2024, so is unlikely to be
          good value unless you want to join a members-only trip before then, or
          make use of our kit borrowing or Mountaineering Scotland membership.
          Otherwise we advise waiting until the end of March and purchasing a
          new full years membership then!
        </StrongParagraph>
        <Paragraph>
          If you're new to the club you are welcome to come along for a trial
          walk or two before committing to membership - or catch us at one of
          the city events. You need to join the club in order to come on our
          walks and events.
        </Paragraph>
        <Paragraph>
          Membership helps fund the club and goes towards purchasing club kit
          (that you can borrow) and running costs. Our membership also includes
          Mountaineering Scotland membership, which has a host of benefits
          including discounts at outdoor stores, access to talks and training
          and mountaineering insurance.
        </Paragraph>
        <Paragraph>
          The cost is £39 for the year, or £21 for those that can't afford the
          full fee - this choice is up to you. Our membership year runs until
          April 1, 2024 so the fee will cover you until then. If you join after
          October we offer a reduced rate of £22 or £12 for concessions.
        </Paragraph>
        <Paragraph>
          If you are already a Mountaineering Scotland member get in touch with
          the treasurer (treasurer@clydemc.org) before paying as we should be
          able to offer a reduced rate.
        </Paragraph>
        <Paragraph>
          To join, just complete the form below and follow the instructions to
          make online payment.
        </Paragraph>
      </Section>
      <Section>
        <Heading> Join or Renew Now! </Heading>
        <JoinClubForm />
      </Section>
      {currentUser?.is_committee && <JoinAdminTools />}
    </>
  );
}

function JoinClubForm() {
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [membership, setMembership] = useState<"regular" | "concession">(
    "regular"
  );
  const [mscot, setMscot] = useState("");

  const { currentUser } = useAuth();

  const currentMonth = new Date().getMonth();

  const isHalfYearFee = currentMonth > 8 || currentMonth < 2;
  const regularFee = isHalfYearFee ? 22 : 39;
  const concessionFee = isHalfYearFee ? 12 : 21;
  const feeForThisUser = membership === "regular" ? regularFee : concessionFee;

  const location = useLocation();
  const query = new URLSearchParams(window.location.search);

  const handleJoin = useCallback(
    (event) => {
      event.preventDefault();
      const name = currentUser ? getName(currentUser) : "<Missing user>";
      const email = currentUser?.email;

      const userData = {
        name,
        email,
        dob,
        address,
        mobile,
        membership,
        mscot,
        amount: feeForThisUser,
        price_id: "price_1OcBydHeSU2riQUJflrmTETI",
        return_domain: window.location.origin + location.pathname,
      };

      api.post("payments/memberjoin/", userData).then((res) => {
        // Redirect to checkout
        window.location.assign(res.data);
      });
    },
    [
      dob,
      address,
      mobile,
      membership,
      mscot,
      currentUser,
      feeForThisUser,
      location,
    ]
  );

  if (query.get("success")) {
    return (
      <>
        <Paragraph>Thank you for joining!</Paragraph>
        <Paragraph>
          Your membership on site should be confirmed shortly. Membership status
          on Discord may take some time as our treasurer needs to set this
          manually.
        </Paragraph>
        <Paragraph>
          Any questions, get in touch at treasurer@clydemc.org.
        </Paragraph>
      </>
    );
  }

  return (
    <form className="ml-2 mt-2" onSubmit={handleJoin}>
      {query.get("canceled") && (
        <Error>Your payment failed! Please try again.</Error>
      )}
      <FormLabel>Date of Birth (DD/MM/YYYY)</FormLabel>
      <FormInput
        type="text"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <FormLabel>Address (inc. Postcode)</FormLabel>
      <FormInput
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <FormLabel>Mobile Number</FormLabel>
      <FormInput
        type="text"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <FormLabel>Membership Type</FormLabel>
      <FormSelect
        value={membership}
        onChange={(e) => setMembership(e.target.value as any)}
      >
        <option value="regular">Regular (£{regularFee})</option>
        <option value="concession">Concession (£{concessionFee})</option>
      </FormSelect>

      <FormLabel>
        If you are already a Mountaineering Scotland member, what is your
        membership number?
      </FormLabel>
      <FormInput
        type="text"
        value={mscot}
        onChange={(e) => setMscot(e.target.value)}
      />

      <FormLabel>
        By submitting this form, I agree to pay the membership dues to Clyde
        Mountaineering Club. I also consent to my personal information being
        passed to Mountaineering Scotland in order to set up my membership.
      </FormLabel>
      <FormButton type="submit">Submit</FormButton>
    </form>
  );
}

// partial but good enough
type StripeProduct = {
  id: string;
  name: string;
};

type StripePriceProduct = {
  id: string;
  product: StripeProduct;
  unit_amount: number;
  currency: string;
};

type MembershipPrice = {
  url: URL;
  price_id: string;
  type: string;
};

function JoinAdminTools() {
  const [products, setProducts] = useState<Array<StripePriceProduct>>([]);
  const [membershipProducts, setMembershipProducts] = useState<
    Array<MembershipPrice>
  >([]);
  const [loaded, setLoaded] = useState(false);

  const loadMembershipPrice = useCallback(() => {
    api
      .get("payments/membershipprice/")
      .then((res) => setMembershipProducts(res.data));
  }, []);

  const loadData = useCallback(() => {
    loadMembershipPrice();

    api.get("payments/products/").then((res) => {
      setProducts(res.data);
      setLoaded(true);
    });
  }, [loadMembershipPrice]);

  const setPrice = useCallback(
    (priceType, priceId) => {
      return () => {
        api
          .post("payments/membershipprice/", {
            price_id: priceId,
            type: priceType,
          })
          .then((res) => loadMembershipPrice());
      };
    },
    [loadMembershipPrice]
  );

  if (!loaded) {
    return <Button onClick={loadData}>Load admin tools</Button>;
  } else {
    return (
      <Section>
        <SmallHeading>Admin Tools</SmallHeading>
        <StrongParagraph>Membership Products</StrongParagraph>
        {membershipProducts.map((p) => (
          <div className="flex">
            <Paragraph>
              {p.price_id} {p.type} ({p.id})
            </Paragraph>
          </div>
        ))}
        <StrongParagraph>All Products</StrongParagraph>
        {products.map((p) => (
          <div className="flex items-center">
            <Paragraph className="mr-4">
              {p.product.name} - {p.unit_amount / 100}
              {p.currency} ({p.id})
            </Paragraph>
            <SmallButton className="mr-4" onClick={setPrice("regular", p.id)}>
              Regular
            </SmallButton>
            <SmallButton onClick={setPrice("concession", p.id)}>
              Concession
            </SmallButton>
          </div>
        ))}
      </Section>
    );
  }
}
