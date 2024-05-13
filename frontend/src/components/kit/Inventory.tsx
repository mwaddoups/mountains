import { useEffect, useState } from "react";
import api from "../../api";
import { Kit } from "../../models";
import Loading from "../Loading";
import { Table, Td } from "../base/Base";

const descMap: Array<[keyof Kit, string]> = [
  ["id", "ID"],
  ["description", "Description"],
  ["brand", "Brand"],
  ["color", "Colour"],
  ["type", "Type"],
  ["purchased_on", "Purchased On"],
  ["added_on", "Added On"],
  ["seller", "Seller"],
  ["price", "Paid Price"],
  ["last_checked", "Last Checked"],
  ["last_condition", "Last Condition"],
  ["notes", "Notes"],
];

export default function Inventory() {
  const [kitList, setKitList] = useState<Array<Kit>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get("kit/inventory").then((response) => {
      setKitList(response.data);
      setLoading(false);
    });
  }, [setKitList]);

  // TODO: Add kit adding to bottom here

  return (
    <Loading loading={loading}>
      <Table>
        <thead>
          <tr>
            {descMap.map(([key, val], ix) => (
              <th key={ix}>{val}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kitList.map((k) => (
            <tr>
              {Object.values(k).map((val) => (
                <Td>{val}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Loading>
  );
}
