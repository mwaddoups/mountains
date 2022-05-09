import tw from "twin.macro";

export const Section = tw.div`rounded shadow p-4 mb-4`
export const Heading = tw.h1`text-3xl font-bold tracking-tight`
export const Paragraph = tw.p`my-3 ml-3 tracking-wide font-light`

export const FormLabel = tw.label`block text-gray-700 text-sm font-bold mb-2`
export const FormInput = tw.input`px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4`
export const FormSelect = tw.select`px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-lg mb-4`
export const FormButton = tw.button`block rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3`