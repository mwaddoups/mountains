import { useCallback, useEffect, useState } from "react";
import api from "../../api";
import { Kit } from "../../models";
import Loading from "../Loading";
import { Button, FormInput, Section, Table, Td } from "../base/Base";

const descMap: Array<[keyof Kit, string]> = [
  ["text_id", "ID"],
  ["description", "Description"],
  ["brand", "Brand"],
  ["color", "Colour"],
  ["type", "Type"],
  ["purchased_on", "Purchased On"],
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

  const createNew = useCallback(() => {
    setLoading(true);
    api.post("kit/inventory/", {}).then((response) => {
      setKitList(kitList.concat([response.data]));
      setLoading(false);
    });
  }, [kitList]);

  return (
    <Section>
      <Loading loading={loading}>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                {descMap.map(([key, val], ix) => (
                  <th key={ix}>{val}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kitList.map((kitItem) => (
                <tr key={kitItem.id}>
                  {descMap.map(([key, val], ix) => (
                    <EditableCell
                      key={key}
                      kitId={kitItem.id}
                      field={key}
                      value={kitItem[key]}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Button onClick={createNew}>Add item</Button>
      </Loading>
    </Section>
  );
}

interface EditableCellParams {
  kitId: number;
  field: string;
  value: string | number | null;
}

function EditableCell({ field, kitId, value: initValue }: EditableCellParams) {
  const [editable, setEditable] = useState<boolean>(initValue ? false : true);
  const [value, setValue] = useState<string | number | null>(initValue);

  const updateValue = useCallback(
    (e) => {
      e.preventDefault();
      if (value) {
        api
          .patch(`kit/inventory/${kitId}/`, { [field]: value })
          .then((response) => {
            setEditable(false);
          });
      }
    },
    [kitId, setEditable, value, field]
  );

  const getInput = (value: number | string | null) => {
    if (typeof value === "number") {
      return (
        <FormInput
          type="number"
          value={value ? value : 0.0}
          onChange={(event) => setValue(event.target.value)}
          onBlur={updateValue}
        />
      );
    } else {
      return (
        <FormInput
          type="string"
          value={value ? value.toString() : ""}
          onChange={(event) => setValue(event.target.value)}
          onBlur={updateValue}
        />
      );
    }
  };

  if (editable) {
    return (
      <td className="px-2 py-1 text-center">
        <form onSubmit={updateValue}>{getInput(value)}</form>
      </td>
    );
  } else {
    return (
      <td onClick={() => setEditable(true)} className="px-2 py-1 text-center">
        {value}
      </td>
    );
  }
}
