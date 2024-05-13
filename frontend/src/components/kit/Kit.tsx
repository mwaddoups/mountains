import { useAuth } from "../Layout";
import { Button, Section } from "../base/Base";
import Inventory from "./Inventory";
import { Link } from "react-router-dom";

export default function Kit() {
  const { currentUser } = useAuth();

  return (
    <Section>
      {currentUser?.is_site_admin && (
        <Link to="../new">
          <Button>Add kit item</Button>
        </Link>
      )}
      <Inventory />
    </Section>
  );
}
