import styled from "@emotion/styled";
import tw from "twin.macro";

export const Section = tw.div`rounded shadow md:p-4 p-2 mb-4`;
export const Heading = tw.h1`text-3xl font-medium mb-2`;
export const Paragraph = tw.p`mb-2 font-light text-sm`;
export const StrongParagraph = tw.p`mb-2 font-bold`;
export const UList = tw.ul`list-disc ml-6 mb-2 text-sm font-light tracking-wide`;
export const OList = tw.ol`list-decimal ml-6 mb-2 text-sm font-light tracking-wide`;
export const LI = tw.li`font-light tracking-wide text-sm`;
export const SubHeading = tw.h2`text-2xl mb-2 font-medium tracking-tight`;
export const SmallHeading = tw.h3`text-lg mb-2 font-semibold tracking-tight`;
export const Bolded = tw.span`font-bold`;
export const Italic = tw.span`italic`;
export const Image = tw.img`w-auto object-cover h-64 rounded-lg mx-auto my-2`;
export const Link = tw.a`text-blue-700 hover:text-blue-400`;

export const EventHeading = tw.h1`md:text-lg font-semibold tracking-tight hover:underline`;

export const FormContainer = tw.div`w-3/4 rounded shadow p-8 m-4 bg-white mx-auto`;
export const FormLabel = tw.label`block text-gray-700 text-sm font-bold mb-2`;
export const FormInput = tw.input`px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4`;
export const FormTextArea = tw.textarea`text-sm px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4 resize-none h-80`;
export const FormSelect = tw.select`px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4`;
export const FormButton = tw.button`block rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3`;
export const FormCancelButton = tw.button`block rounded bg-gray-300 hover:bg-gray-400 text-gray-700 p-3`;

export const Button = tw.button`px-2 py-1 rounded-lg bg-blue-400 text-gray-100 hover:bg-blue-600 mr-4`;
export const SmallButton = tw.button`px-1 py-0.5 rounded-lg bg-blue-400 text-sm text-gray-100 hover:bg-blue-600`;
export const CancelButton = tw.button`px-2 py-1 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 mr-4`;
export const Error = tw.p`font-light text-sm text-red-500`;

export type BadgeColor =
  | "red"
  | "green"
  | "purple"
  | "blue"
  | "darkgreen"
  | "darkblue"
  | "orange"
  | "pink"
  | "gray"
  | "lightblue";
interface BadgeProps {
  $badgeColor: BadgeColor;
}

const colorVariants: Record<BadgeColor, any> = {
  red: tw`bg-red-400 text-gray-100`,
  green: tw`bg-green-400 text-gray-100`,
  purple: tw`bg-purple-400 text-gray-100`,
  blue: tw`bg-blue-500 text-gray-100`,
  lightblue: tw`bg-blue-300 text-gray-100`,
  darkgreen: tw`bg-green-700 text-gray-100`,
  darkblue: tw`bg-blue-700 text-gray-100`,
  orange: tw`bg-orange-400 text-gray-100`,
  pink: tw`bg-pink-400 text-gray-100`,
  gray: tw`bg-gray-500 text-gray-100`,
};

export const Badge = styled.span(({ $badgeColor }: BadgeProps) => [
  tw`rounded-lg mr-2 px-2 py-0.5 md:text-sm text-xs flex-initial truncate inline-flex items-center`,
  colorVariants[$badgeColor],
]);

export const FilterBadge = styled.span(({ $badgeColor }: BadgeProps) => [
  tw`rounded-lg mr-2 px-2 py-0.5 md:text-sm text-xs shrink-0 inline select-none cursor-pointer`,
  colorVariants[$badgeColor],
]);
