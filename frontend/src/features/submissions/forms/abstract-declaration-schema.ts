import z from "zod";

export const declarationsLabels = {
  confirm_accuracy: {
    label: 'Information Accuracy',
    title: 'I confirm that the abstract and all entered information is correct:',
    description: 'I certify that the scientific content of this abstract and all submitted information is accurate and reflects the final intended presentation. I acknowledge that no changes can be made once the final submission deadline has passed.'
  },
  consent_publication: {
    label: 'Publication Consent',
    title: 'The submission of an abstract constitutes your consent to publication',
    description: 'I hereby grant permission for this abstract to be published in the WATOC Congress, including the official website and promotional materials related to the scientific program.'
  },
  submit_on_behalf: {
    label: 'Submission on Behalf',
    title: 'I confirm that I submit this abstract on behalf of all authors:',
    description: 'I herewith confirm that the contact details saved in this system are those of the first author, who will be notified about the status of the abstract. The first author is responsible for informing the other authors about the status of the abstract.'
  },
  commitment_attendance: {
    label: 'Attendance Commitment',
    title: 'The abstract submission constitutes a formal commitment by the first author to physically attend the Congress',
    description: 'I understand that submitting this abstract constitutes a formal commitment by the presenting author to register for and attend WATOC in person to deliver the presentation at the time and in the format (Oral or Poster) assigned by the Scientific Committee.'
  },
  not_previously_published: {
    label: 'Originality Statement',
    title: 'I herewith confirm that the abstract has not been previously published.',
    description: 'I confirm that this abstract presents original work and has not been previously published in a peer-reviewed journal or presented at another major international conference prior to WATOC.'
  },
  no_ai_used: {
    label: 'No AI Used',
    title: 'I herewith confirm that the abstract was prepared without using the aid of AI tools.',
    description: 'I certify that this abstract is the original work of the listed authors. No artificial intelligence tools or automated text generators were used in the preparation of this scientific work.'
  }
}

export const abstractDeclarationSchema = z.object({
  abstract_id: z.number().optional(),
  confirm_accuracy: z.boolean().refine((val) => val === true, { message: "Required", }),
  consent_publication: z.boolean().refine((val) => val === true, { message: "Required", }),
  submit_on_behalf: z.boolean().refine((val) => val === true, { message: "Required", }),
  commitment_attendance: z.boolean().refine((val) => val === true, { message: "Required", }),
  not_previously_published: z.boolean().refine((val) => val === true, { message: "Required", }),
  no_ai_used: z.boolean().refine((val) => val === true, { message: "Required", }),
})

export type AbstractDeclarationValues = z.infer<typeof abstractDeclarationSchema>

