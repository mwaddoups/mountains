import { useCallback, useEffect, useState } from "react";
import { Kit } from "../../models";
import { Link, Navigate, useParams } from "react-router-dom";
import api from "../../api";
import Loading from "../Loading";
import {
  FormButton,
  FormContainer,
  FormInput,
  FormLabel,
  SubHeading,
  Error,
  FormCancelButton,
} from "../base/Base";
import dateFormat from "dateformat";

export default function KitEditor() {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [currentKit, setCurrentKit] = useState<Kit | null>(null);

  const [kitId, setKitId] = useState<number | null>(null);
  const [kitTextId, setKitTextId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [kitType, setKitType] = useState<string>("");
  const [purchasedOn, setPurchasedOn] = useState<Date>(new Date());
  const [addedOn, setAddedOn] = useState<Date>(new Date());
  const [seller, setSeller] = useState<string>("");
  const [price, setPrice] = useState<number>(0.0);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [lastCondition, setLastCondition] = useState<string>("");
  const [notes, setNotes] = useState<string | null>(null);

  const { kitId: kitIdParam } = useParams();
  useEffect(() => {
    if (kitIdParam) {
      api.get(`reports/${kitIdParam}/`).then((res) => {
        let kit = res.data as Kit;
        setCurrentKit(kit);

        setKitId(kit.id);
        setKitTextId(kit.text_id);
        setDescription(kit.description);
        setBrand(kit.brand);
        setColor(kit.color);
        setKitType(kit.type);
        setPurchasedOn(new Date(kit.purchased_on));
        setAddedOn(new Date(kit.added_on));
        setSeller(kit.seller);
        setPrice(kit.price);
        setLastChecked(new Date(kit.last_checked));
        setLastCondition(kit.last_condition);
        setNotes(kit.notes);
      });
    }
    setLoading(false);
  }, [kitIdParam]);

  const updateKit = useCallback(
    (e) => {
      e.preventDefault();
      let newKit = Object.assign({}, currentKit);

      if (kitTextId === "") {
        setErrorText("Kit must have an ID!");
        return;
      }

      newKit.text_id = kitTextId;
      newKit.description = description;
      newKit.brand = brand;
      newKit.color = color;
      newKit.type = kitType;
      newKit.purchased_on = dateFormat(purchasedOn, "isoDateTime");
      newKit.added_on = dateFormat(addedOn, "isoDateTime");
      newKit.seller = seller;
      newKit.price = price;
      newKit.last_checked = dateFormat(lastChecked, "isoDateTime");
      newKit.last_condition = lastCondition;
      newKit.notes = notes;

      if (kitId) {
        setErrorText(null);
        api.put(`kit/inventory/${kitId}/`, newKit).then((res) => {
          setSubmitted(true);
        });
      } else {
        setErrorText(null);
        api.post(`kit/inventory/`, newKit).then((res) => {
          setKitId((res.data as Kit).id);
          setSubmitted(true);
        });
      }
    },
    [
      kitId,
      kitTextId,
      description,
      brand,
      color,
      kitType,
      purchasedOn,
      addedOn,
      seller,
      price,
      lastChecked,
      lastCondition,
      notes,
      currentKit,
    ]
  );

  if (submitted) {
    return <Navigate to={`../`} />;
  }

  return (
    <Loading loading={loading}>
      <FormContainer>
        <SubHeading>Edit Kit</SubHeading>
        <form onSubmit={updateKit}>
          <div className="w-full flex">
            <div className="w-full pr-5">
              <FormLabel htmlFor="kitId">Kit ID</FormLabel>
              <FormInput
                type="string"
                id="kitId"
                value={kitTextId}
                onChange={(event) => setKitTextId(event.target.value)}
              />
            </div>
            <div className="w-full">
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormInput
                type="string"
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex">
            <div className="w-full pr-5">
              <FormLabel htmlFor="brand">Brand</FormLabel>
              <FormInput
                type="string"
                id="brand"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
              />
            </div>
            <div className="w-full">
              <FormLabel htmlFor="colour">Colour</FormLabel>
              <FormInput
                type="string"
                id="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
              />
            </div>
          </div>
          {errorText && <Error>{errorText}</Error>}
          <div className="flex justify-between">
            <FormButton type="submit">Submit</FormButton>
            <Link to={`../`}>
              <FormCancelButton className="ml-auto">Cancel</FormCancelButton>
            </Link>
          </div>
        </form>
      </FormContainer>
    </Loading>
  );
}
