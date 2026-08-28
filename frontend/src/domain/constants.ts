import { countries } from "@/utils/countriesInfo";

export const countryCodes = countries.map(country => country.value)


export const userPrefixValues = [
    "not-set",
    "Miss",
    "Ms.",
    "Mrs.",
    "Mr.",
    "Dr.",
    "Prof.",
    "Mx.",
] as const

export const userRoleValues = [
    "admin",
    "reviewer",
    "participant",
] as const

export const userPrefixes = [
    { value: "not-set", label: "Not set" },
    { value: "Miss", label: "Miss" },
    { value: "Ms.", label: "Ms." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Mr.", label: "Mr." },
    { value: "Dr.", label: "Dr." },
    { value: "Prof.", label: "Prof." },
    { value: "Mx.", label: "Mx." },
] as const;


export const userRoles = [
    { value: "admin", label: "Administator" },
    { value: "reviewer", label: "Submission Reviewer" },
    { value: "participant", label: "Congress Participant" },
] as const
