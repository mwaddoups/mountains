import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../api";
import { Kit, KitBorrow } from "../../models";
import Loading from "../Loading";
import {
  Button,
  FormInput,
  Heading,
  Section,
  SmallButton,
  Paragraph,
  FormLabel,
  FormTextArea,
  SmallHeading,
  SmallCancelButton,
} from "../base/Base";
import { Trash } from "react-bootstrap-icons";
import { useAuth } from "../Layout";
import dateFormat from "dateformat";
import Borrow from "./Borrows";

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
  const [toBorrow, setToBorrow] = useState<Array<Kit>>([]);
  const [borrowList, setBorrowList] = useState<Array<KitBorrow>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { currentUser } = useAuth();

  const isAdmin = currentUser ? currentUser.is_site_admin : false;

  const reloadKit = () => {
    setLoading(true);
    api.get("kit/inventory").then((response) => {
      setKitList(response.data);
      setLoading(false);
    });
    api.get("kit/borrow").then((response) => {
      setBorrowList(response.data);
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

  const handleBorrowRequest = useCallback(
    (e) => {
      e.preventDefault();
      if (currentUser) {
        Promise.all(
          toBorrow.map((kit) =>
            api.post(`kit/borrow/`, {
              user: currentUser.id,
              kit: kit.id,
              start_date: new Date(e.target.start_date.value),
              end_date: new Date(e.target.end_date.value),
              collection_details: e.target.collection_details.value,
            })
          )
        ).then((response) => {
          setToBorrow([]);
          reloadKit();
        });
      }
    },
    [currentUser, toBorrow]
  );

  return (
    <>
      <Section>
        <Heading>Kit Inventory</Heading>
        <Paragraph>
          If you are a member, you are able to borrow kit from the club at any
          time. The kit is held in storage by the committee, and can usually be
          arranged to be picked up from Glasgow.
        </Paragraph>
        <Paragraph>
          To submit a borrow request, choose the items below.
        </Paragraph>
        <section className={toBorrow.length > 0 ? "" : "hidden"}>
          <SmallHeading>New Borrow</SmallHeading>
          <form
            className="pl-2 border-l-2 border-teal-500 w-3/4"
            onSubmit={handleBorrowRequest}
          >
            <fieldset className="flex w-full gap-1">
              <FormLabel className="w-full">
                Start of borrow
                <FormInput
                  type="date"
                  name="start_date"
                  defaultValue={dateFormat(new Date(), "yyyy-mm-dd")}
                />
              </FormLabel>
              <FormLabel className="w-full">
                End of borrow
                <FormInput
                  type="date"
                  name="end_date"
                  defaultValue={dateFormat(new Date(), "yyyy-mm-dd")}
                />
              </FormLabel>
            </fieldset>
            <FormLabel>
              To borrow:
              <ul>
                {toBorrow.map((kit, ix) => {
                  return (
                    <li className="text-sm" key={ix}>
                      <input
                        type="hidden"
                        name={"kit" + ix.toString()}
                        value={kit.id}
                      />
                      {`${ix + 1}: ${kit.description} (${kit.text_id})`}
                    </li>
                  );
                })}
              </ul>
            </FormLabel>
            <FormLabel className="w-full">
              Availability for collection
              <FormTextArea
                required
                name="collection_details"
                className="h-32"
                placeholder="Enter any dates and times that you'd be available to pick up the kit."
              />
            </FormLabel>
            <Button>Submit request</Button>
          </form>
        </section>
        <Loading loading={loading}>
          <div className="overflow-auto max-h-[40rem]">
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
                      {toBorrow.includes(kitItem) ? (
                        <SmallCancelButton
                          onClick={() =>
                            setToBorrow(toBorrow.filter((k) => k !== kitItem))
                          }
                        >
                          Remove
                        </SmallCancelButton>
                      ) : (
                        <SmallButton
                          onClick={() => setToBorrow(toBorrow.concat(kitItem))}
                        >
                          Borrow
                        </SmallButton>
                      )}
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
      <Borrow borrowList={borrowList} setBorrowList={setBorrowList} />
    </>
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
  const [value, setValue] = useState<string | Date | number | null>(initValue);
  const [error, setError] = useState<string | null>(null);
  const updateValue = useCallback(
    (e) => {
      e.preventDefault();
      const cellValue = e.target.cellValue.value;
      if (cellValue !== null) {
        api
          .patch(`kit/inventory/${kitId}/`, { [field]: cellValue })
          .then((response) => {
            setValue(response.data[field]);
            setEditable(false);
            setError(null);
          })
          .catch((err) => {
            setError(err.response.data[field][0]);
          });
      }
    },
    [kitId, setEditable, field, setError]
  );

  const formRef = useRef<HTMLFormElement>(null);
  const getInput = useCallback(
    (fieldType: string, error: string | null) => {
      const classes = error ? "bg-red-100" : "";

      if (fieldType === "number") {
        const numVal = Number(value);
        return (
          <FormInput
            type="number"
            name="cellValue"
            className={classes}
            defaultValue={value ? numVal : 0.0}
            step="0.01"
            onBlur={(e) => formRef.current?.requestSubmit()}
          />
        );
      } else if (fieldType === "date") {
        return (
          <FormInput
            type="date"
            name="cellValue"
            className={classes}
            defaultValue={
              value ? dateFormat(value.toString(), "yyyy-mm-dd") : ""
            }
            onBlur={(e) => formRef.current?.requestSubmit()}
          />
        );
      } else {
        return (
          <FormInput
            type="string"
            name="cellValue"
            className={classes}
            defaultValue={value ? value.toString() : ""}
            onBlur={(e) => formRef.current?.requestSubmit()}
          />
        );
      }
    },
    [value]
  );

  if (editable) {
    return (
      <td className="px-2 text-center">
        <form ref={formRef} onSubmit={updateValue} className="inline">
          {getInput(fieldType, error)}
          <input className="hidden" type="submit" />
        </form>
      </td>
    );
  } else {
    return (
      <td
        onClick={allowEdit ? () => setEditable(true) : () => null}
        className={"px-2 text-center" + (value ? "" : " opacity-30")}
      >
        {value
          ? typeof value === "number"
            ? value.toFixed(2)
            : value.toString()
          : "N/A"}
      </td>
    );
  }
}
