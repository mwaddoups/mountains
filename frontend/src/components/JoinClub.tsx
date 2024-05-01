import React, { useCallback, useEffect, useState } from "react";
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
  SmallRedButton,
  Bolded,
  CancelButton,
  Table,
  Td,
} from "./base/Base";
import { useAuth } from "./Layout";
import { useLocation } from "react-router-dom";
import DiscordSelector from "./members/DiscordSelector";

// partial but good enough
type StripeProduct = {
  id: string;
  name: string;
};

type StripePriceProduct = {
  id: string;
  nickname: string;
  product: StripeProduct | null;
  unit_amount: number;
  currency: string;
};

type MembershipPrice = {
  url: string;
  price_id: string;
  expiry_date: string;
};

export default function JoinClub() {
  const { currentUser } = useAuth();

  return (
    <>
      <Section>
        <Heading>Joining the Club</Heading>
        {/* <StrongParagraph>
          Please note: Membership is not required to come on your first few day
          walks! Our membership year ends on April 1, 2024, so is unlikely to be
          good value unless you want to join a members-only trip before then, or
          make use of our kit borrowing or Mountaineering Scotland membership.
          Otherwise we advise waiting until the end of March and purchasing a
          new full years membership then!
        </StrongParagraph> */}
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
          Our membership fees are sown in the table below. Our membership year
          runs until April 1, 2025 so the fee will cover you until then.
        </Paragraph>
        <div className="p-2">
          <Table>
            <tr className="border-solid border-b-2">
              <Td className="border-solid border-r-2"></Td>
              <Td>April</Td>
              <Td>May</Td>
              <Td>June</Td>
              <Td>July</Td>
              <Td>August</Td>
              <Td>September</Td>
              <Td>October</Td>
              <Td>November</Td>
              <Td>December</Td>
              <Td>January</Td>
              <Td>February</Td>
              <Td>March</Td>
            </tr>
            <tr>
              <Td className="border-solid border-r-2">Full</Td>
              <Td>£39</Td> <Td>£36</Td> <Td>£33.50</Td> <Td>£31</Td>
              <Td>£28.50</Td> <Td>£26</Td> <Td>£23.50</Td> <Td>£21</Td>
              <Td>£18.50</Td> <Td>£16</Td> <Td>£13.50</Td> <Td>£10</Td>
            </tr>
            <tr>
              <Td className="border-solid border-r-2">Concession</Td>
              <Td>£21</Td> <Td>£19.75</Td> <Td>£18.75</Td> <Td>£17.75</Td>
              <Td>£16.75</Td> <Td>£15.75</Td> <Td>£14.75</Td> <Td>£13.75</Td>
              <Td>£12.75</Td> <Td>£11.25</Td> <Td>£10.25</Td> <Td>£8.50</Td>
            </tr>
            <tr>
              <Td className="border-solid border-r-2">Non-MS</Td>
              <Td>£18</Td> <Td>£16.25</Td> <Td>£14.75</Td> <Td>£13.25</Td>{" "}
              <Td>£11.75</Td> <Td>£10.25</Td> <Td>£8.75</Td> <Td>£7.25</Td>{" "}
              <Td>£5.75</Td> <Td>£4.75</Td> <Td>£3.25</Td> <Td>£1.50</Td>
            </tr>
          </Table>
        </div>
        <Paragraph>
          If you are already a Mountaineering Scotland member please select the
          reduced rate option when choosing the membership type. Any other
          questions, contact our treasurer at treasurer@clydemc.org .
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
      {currentUser?.is_site_admin && <JoinAdminTools />}
    </>
  );
}

function JoinClubForm() {
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [memberships, setMemberships] = useState<Array<StripePriceProduct>>([]);
  const [membershipPriceId, setMembershipPriceId] = useState<string | null>(
    null
  );
  const [mscot, setMscot] = useState("");

  const { currentUser } = useAuth();

  const location = useLocation();
  const query = new URLSearchParams(window.location.search);

  useEffect(() => {
    api.get("payments/membershipprice/").then((res) => {
      Promise.all(
        res.data.map(async (p: MembershipPrice) => {
          const res = await api.get(`payments/products/${p.price_id}/`);
          return res.data;
        })
      ).then((res) => {
        setMemberships(res);
        setMembershipPriceId(res[0].id);
      });
    });
  }, []);

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
        mscot,
        price_id: membershipPriceId,
        return_domain: window.location.origin + location.pathname,
      };

      api.post("payments/memberjoin/", userData).then((res) => {
        // Redirect to checkout
        window.location.assign(res.data);
      });
    },
    [dob, address, mobile, mscot, membershipPriceId, currentUser, location]
  );

  if (query.get("success")) {
    return (
      <>
        <Paragraph>Thank you for joining!</Paragraph>
        <Paragraph>
          Your membership on site should be confirmed shortly. Membership status
          on Discord should happen fairly automatically - if this hasn't
          happened in the next few hours let the treasurer know.
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
        value={membershipPriceId || ""}
        onChange={(e) => setMembershipPriceId(e.target.value as any)}
      >
        {memberships.map((m) => (
          <option key={m.id} value={m.id}>
            {m.product ? m.product.name : "<No product found>"} ({m.nickname})
            (£
            {(m.unit_amount / 100).toFixed(2)})
          </option>
        ))}
      </FormSelect>

      <FormLabel>
        If you are already a Mountaineering Scotland member, what is your
        membership number? (Not needed for renewals!)
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

      {currentUser && !currentUser.discord_id && (
        <div className="bg-red-100 rounded-xl p-4 m-4 w-full">
          <StrongParagraph className="text-red-400">
            Your account doesn't have a Discord username associated with it yet!
            We strongly suggest ensuring this is set before joining the club.
            You can set it below.
          </StrongParagraph>
          <DiscordSelector
            user={currentUser}
            refreshProfile={() => undefined}
          />
        </div>
      )}
      <FormButton type="submit">Submit</FormButton>
    </form>
  );
}

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

  const addPrice = useCallback(
    (priceId, dateStr) => {
      return () => {
        api
          .post("payments/membershipprice/", {
            price_id: priceId,
            expiry_date: dateStr,
          })
          .then((res) => loadMembershipPrice());
      };
    },
    [loadMembershipPrice]
  );

  const removePrice = useCallback(
    (priceId) => {
      return () => {
        const mp = membershipProducts.find((p) => p.price_id === priceId)?.url;
        if (mp) {
          api.delete(mp).then((res) => loadMembershipPrice());
        }
      };
    },
    [loadMembershipPrice, membershipProducts]
  );

  const isMemberProduct = (priceId: string) =>
    membershipProducts.map((p) => p.price_id).includes(priceId);

  const getProductName = (p: StripePriceProduct) =>
    `${p.product ? p.product.name : "<No product found>"} - (${p.nickname}) ${
      p.unit_amount / 100
    }${p.currency} (${p.id})`;

  if (!loaded) {
    return <Button onClick={loadData}>Load admin tools</Button>;
  } else {
    return (
      <Section>
        <SmallHeading>Admin Tools</SmallHeading>
        <Paragraph>
          In Stripe, you can set up products in the Product Catalog and attach
          prices to those products. For example, one product might be Membership
          2023/2024, and that can have prices for concession, regular, maybe
          some one-off. When someone joins they see a list of prices you select.{" "}
          <Bolded>
            Make sure every price has the right description and products have
            the right name.
          </Bolded>
        </Paragraph>
        <StrongParagraph>Select Membership Product / Prices</StrongParagraph>
        {products.map((p) => (
          <div key={p.id} className="flex items-center">
            {isMemberProduct(p.id) ? (
              <>
                <CancelButton className="mr-4 text-xs cursor-default">
                  Selected (
                  {
                    membershipProducts.find((mp) => mp.price_id === p.id)
                      ?.expiry_date
                  }
                  )
                </CancelButton>
                <SmallRedButton className="mr-4" onClick={removePrice(p.id)}>
                  Remove
                </SmallRedButton>
                <Paragraph className="mr-4">
                  <Bolded>{getProductName(p)}</Bolded>
                </Paragraph>
              </>
            ) : (
              <>
                <SmallButton
                  className="mr-4"
                  onClick={addPrice(p.id, "2024-03-31")}
                >
                  Add (2024-03-31)
                </SmallButton>
                <SmallButton
                  className="mr-4"
                  onClick={addPrice(p.id, "2025-03-31")}
                >
                  Add (2025-03-31)
                </SmallButton>
                <Paragraph className="mr-4">{getProductName(p)}</Paragraph>
              </>
            )}
          </div>
        ))}
      </Section>
    );
  }
}
