import z from "zod";

export const declarationsLabels = {
  confirm_accuracy: {
    label: 'Information Accuracy',
    title: '1. I confirm that the abstract and all entered information is correct:',
    description: 'I certify that the scientific content of this abstract and all submitted information is accurate and reflects the final intended presentation. I acknowledge that no changes can be made once the final submission deadline has passed.'
  },
  consent_publication: {
    label: 'Publication Consent',
    title: '2. The submission of an abstract constitutes your consent to publication',
    description: 'I hereby grant permission for this abstract to be published in the WATOC Congress, including the official website and promotional materials related to the scientific program.'
  },
  submit_on_behalf: {
    label: 'Submission on Behalf',
    title: '3. I confirm that I submit this abstract on behalf of all authors:',
    description: 'I herewith confirm that the contact details saved in this system are those of the first author, who will be notified about the status of the abstract. The first author is responsible for informing the other authors about the status of the abstract.'
  },
  commitment_attendance: {
    label: 'Attendance Commitment',
    title: '4. The abstract submission constitutes a formal commitment by the first author to physically attend the Congress',
    description: 'I understand that submitting this abstract constitutes a formal commitment by the presenting author to register for and attend WATOC in person to deliver the presentation at the time and in the format (Oral or Poster) assigned by the Scientific Committee.'
  },
  not_previously_published: {
    label: 'Originality Statement',
    title: '5. I herewith confirm that the abstract has not been previously published.',
    description: 'I confirm that this abstract presents original work and has not been previously published in a peer-reviewed journal or presented at another major international conference prior to WATOC.'
  },
  no_ai_used: {
    label: 'No AI Used',
    title: '6. I herewith confirm that the abstract was prepared without using the aid of AI tools (such as, but not limited to, ChatGPT).:',
    description: 'I certify that this abstract is the original work of the listed authors. No artificial intelligence tools or automated text generators were used in the preparation of this scientific work.'
  }
}

export const abstractDeclarationSchema = z.object({
  confirm_accuracy: z.boolean().default(false).refine((val) => val === true, {
    message: "You must confirm that the information is correct.",
  }),
  consent_publication: z.boolean().default(false).refine((val) => val === true, {
    message: "You must consent to the publication of the abstract.",
  }),
  submit_on_behalf: z.boolean().default(false).refine((val) => val === true, {
    message: "You must confirm you are submitting on behalf of all authors.",
  }),
  commitment_attendance: z.boolean().default(false).refine((val) => val === true, {
    message: "You must commit to attending the congress in person.",
  }),
  not_previously_published: z.boolean().default(false).refine((val) => val === true, {
    message: "You must confirm the abstract has not been previously published.",
  }),
  no_ai_used: z.boolean().default(false).refine((val) => val === true, {
    message: "You must certify that no AI tools were used in this work.",
  }),
})

export type AbstractDeclarationValues = z.infer<typeof abstractDeclarationSchema>