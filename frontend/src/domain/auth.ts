import api from "@/clients/api";
import type { UserSchema } from "@/schemas/user-schemas";

type LoginResponse = {
    anonymous: boolean,
    user: UserSchema
}

type EditUserData = {
    email: string;
    first_name: string;
    last_name: string;
    prefix: "not-set" | "Miss" | "Ms." | "Mrs." | "Mr." | "Dr." | "Prof." | "Mx.";
    institution: string;
    job_title: string;
    field_of_study: string;
    nationality: string;
    city: string;
    id?: number;
    middle_name?: string;
    pronouns?: string;
}

async function editUserData(userData: EditUserData) {
    if (!userData.email) {
        delete userData.email
    }

    const { data } = await api.patch<UserSchema>(`/users/${userData.id}/`, userData)
    return data
}

async function editUserPicture(file: File) {
    if (!file) return

    const formData = new FormData()
    formData.append('photo', file)

    await api.post(`/users/change-profile-pic/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export {
    editUserData,
    editUserPicture,
    type LoginResponse
};

