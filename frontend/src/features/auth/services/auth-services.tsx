import api from "@/clients/api";
import type { ParticipantFormSchema, ParticipantSchema } from "@/features/participants/types/participants";

async function getParticipantData(userId: number): Promise<ParticipantSchema> {
    if (!userId) return null

    const { data } = await api.get<ParticipantSchema>(`/participants/profiles/${userId}/`)
    return data
}


async function saveParticipantData(participantData: ParticipantFormSchema): Promise<ParticipantSchema | null> {
    if (!participantData.user) return null    

    const {
        invitation_letter,
        student_proof,
        ...body
    } = participantData

    const { data } = await api.patch<ParticipantSchema>(`/participants/profiles/${participantData.user}/`, body)
    return data
}



async function getStudentProofFile(url: string): Promise<File> {
    if (!url) return null

    const response = await api.get<Blob>(url);
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition?.match(/filename="?([^"]+)"?/)?.[1] ?? "Student proof.pdf";

    return new File(
        [response.data],
        filename, {
        type: response.data.type,
    })
}


async function saveStudentProofFile(id: number, file: File) {
    if (!file) return null

    const formData = new FormData()
    formData.append('student_proof', file)

    const { data } = await api.patch<void>(`/participants/profiles/${id}/student-proof/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    },)
    return data
}


export {
    getParticipantData, getStudentProofFile, saveParticipantData,
    saveStudentProofFile
};

