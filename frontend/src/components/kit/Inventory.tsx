import { useCallback, useEffect, useState } from "react";
import api from "../../api";
import { Kit } from "../../models";
import Loading from "../Loading";
import {
  Button,
  FormInput,
  Heading,
  Section,
  SmallButton,
  Paragraph,
} from "../base/Base";
import { Trash } from "react-bootstrap-icons";
import { useAuth } from "../Layout";
import dateFormat from "dateformat";

const descMap: Array<[keyof Kit, string, string]> = [
  ["text_id", "ID", "string"],
  ["description", "Description", "string"],
  ["brand", "Brand", "string"],
  ["color", "Colour", "string"],
  ["type", "Type", "string"],
  ["purchased_on", "Purchased On", "date"],
  ["seller", "Seller", "string"],
  ["price", "Paid Price", "number"],
  ["last_checked", "Last Checked", "date"],
  ["last_condition", "Last Condition", "string"],
  ["notes", "Notes", "string"],
];

export default function Inventory() {
  const [kitList, setKitList] = useState<Array<Kit>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { currentUser } = useAuth();

  const isAdmin = currentUser ? currentUser.is_site_admin : false;

  const reloadKit = () => {
    setLoading(true);
    api.get("kit/inventory").then((response) => {
      setKitList(response.data);
      setLoading(false);
    });
  };

  useEffect(reloadKit, [setKitList]);

  const createNew = useCallback(() => {
    setLoading(true);
    api.post("kit/inventory/", {}).then((response) => {
      setKitList(kitList.concat([response.data]));
      setLoading(false);
    });
  }, [kitList]);

  const deleteKit = useCallback((id: number) => {
    return () => {
      api.delete(`kit/inventory/${id}`).then((response) => {
        reloadKit();
      });
    };
  }, []);

  return (
    <Section>
      <Heading>Kit Inventory</Heading>
      <Paragraph>
        If you are a member, you are able to borrow kit from the club at any
        time. The kit is held in storage by the committee, and can usually be
        arranged to be picked up from Glasgow.
      </Paragraph>
      <Paragraph>To submit a borrow request, choose the item below.</Paragraph>
      <Loading loading={loading}>
        <div className="overflow-x-auto">
          <table className="text-sm font-light whitespace-nowrap w-full">
            <thead>
              <tr>
                <th></th>
                {descMap.map(([key, val, _], ix) => (
                  <th key={ix} scope="col" className="min-w-[5rem] w-32">
                    {val}
                  </th>
                ))}
                {isAdmin && <th scope="col"></th>}
              </tr>
            </thead>
            <tbody>
              {kitList.map((kitItem) => (
                <tr key={kitItem.id}>
                  <td>
                    <SmallButton>Borrow</SmallButton>
                  </td>
                  {descMap.map(([name, displayName, fieldType], ix) => (
                    <EditableCell
                      key={name}
                      kitId={kitItem.id}
                      field={name}
                      fieldType={fieldType}
                      value={kitItem[name]}
                      allowEdit={isAdmin}
                    />
                  ))}
                  {isAdmin && (
                    <td>
                      <button
                        className="text-red-500"
                        onClick={deleteKit(kitItem.id)}
                      >
                        <Trash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isAdmin && <Button onClick={createNew}>Add item</Button>}
      </Loading>
    </Section>
  );
}

interface EditableCellParams {
  kitId: number;
  field: string;
  fieldType: string;
  value: string | number | null;
  allowEdit: boolean;
}

function EditableCell({
  field,
  kitId,
  value: initValue,
  fieldType,
  allowEdit,
}: EditableCellParams) {
  const [editable, setEditable] = useState<boolean>(
    initValue ? false : allowEdit
  );
  const [value, setValue] = useState<string | number | Date | null>(initValue);

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

  const getInput = (fieldType: string) => {
    if (fieldType === "number") {
      const numVal = Number(value);
      return (
        <FormInput
          type="number"
          value={value ? numVal : 0.0}
          step="0.01"
          onChange={(event) => setValue(event.target.value)}
          onBlur={updateValue}
        />
      );
    } else if (fieldType === "date") {
      return (
        <FormInput
          type="date"
          value={value ? dateFormat(value.toString(), "yyyy-mm-dd") : ""}
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
      <td className="p-2 text-center">
        <form onSubmit={updateValue}>{getInput(fieldType)}</form>
      </td>
    );
  } else {
    return (
      <td
        onClick={allowEdit ? () => setEditable(true) : () => null}
        className="p-2 text-center"
      >
        {typeof value === "number" ? value.toFixed(2) : value?.toString()}
      </td>
    );
  }
}
