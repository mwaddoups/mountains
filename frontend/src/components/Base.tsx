import tw from "twin.macro";

export const Section = tw.div`rounded shadow p-4 mb-4`
export const Heading = tw.h1`text-3xl font-medium mb-2`
export const Paragraph = tw.p`mb-2 font-light text-sm`
export const UList = tw.ul`list-disc ml-6 mb-2 text-sm font-light tracking-wide`
export const OList = tw.ol`list-decimal ml-6 mb-2 text-sm font-light tracking-wide`
export const LI = tw.li`font-light tracking-wide text-sm`
export const SubHeading = tw.h2`text-2xl mb-2 font-medium tracking-tight`
export const SmallHeading = tw.h3`text-lg mb-2 font-medium tracking-tight`
export const Bolded = tw.p`text-gray-700 font-bold italic`
export const Italic = tw.p`text-gray-700 text-xs italic`

export const FormLabel = tw.label`block text-gray-700 text-sm font-bold mb-2`
export const FormInput = tw.input`px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4`
export const FormSelect = tw.select`px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4`
export const FormButton = tw.button`block rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3`