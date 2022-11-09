import styled from "@emotion/styled";
import tw from "twin.macro";

export const Section = tw.div`rounded shadow p-4 mb-4`
export const Heading = tw.h1`text-3xl font-medium mb-2`
export const Paragraph = tw.p`mb-2 font-light text-sm`
export const UList = tw.ul`list-disc ml-6 mb-2 text-sm font-light tracking-wide`
export const OList = tw.ol`list-decimal ml-6 mb-2 text-sm font-light tracking-wide`
export const LI = tw.li`font-light tracking-wide text-sm`
export const SubHeading = tw.h2`text-2xl mb-2 font-medium tracking-tight`
export const SmallHeading = tw.h3`text-lg mb-2 font-medium tracking-tight`
export const Bolded = tw.span`text-gray-700 font-bold italic`
export const Italic = tw.span`text-gray-700 text-xs italic`

export const FormContainer = tw.div`w-3/4 rounded shadow p-8 m-4 bg-white mx-auto`
export const FormLabel = tw.label`block text-gray-700 text-sm font-bold mb-2`
export const FormInput = tw.input`px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4`
export const FormTextArea = tw.textarea`px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4 resize-none h-80`
export const FormSelect = tw.select`px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4`
export const FormButton = tw.button`block rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3`
export const FormCancelButton = tw.button`block rounded bg-gray-300 hover:bg-gray-400 text-gray-700 p-3`

export const Button = tw.button`px-2 py-1 rounded-lg bg-blue-400 text-gray-100 hover:bg-blue-600 mr-4`

interface BadgeProps {
  $badgeColor: "red" | "green" | "purple" | "blue";
}

const colorVariants = {
  red: tw`bg-red-400 text-gray-100`,
  green: tw`bg-green-400 text-gray-100`,
  purple: tw`bg-purple-400 text-gray-100`,
  blue: tw`bg-blue-400 text-gray-100`,
}

export const Badge = styled.span(({$badgeColor}: BadgeProps) => [
 tw`rounded-lg m-1 px-3 py-0.5 text-sm flex-initial truncate block sm:inline-block`,
 colorVariants[$badgeColor], 
])