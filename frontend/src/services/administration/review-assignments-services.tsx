import api from "@/clients/api";
import { notify } from "@/components/custom/notify";
import { mapErrors } from "@/lib/mapErrors";
import { filtersToQueryParams } from "@/utils/filter-operations";
import type { PaginatedRequest, PaginatedResponse } from "@/domain/pagination";
import type { ReviewAssignment } from "@/features/reviews/types/reviews";
import type { AssignmentFormInput, AssignmentFormOutput } from "@/features/reviews/schemas/review-assignment-schema";
import type { AxiosError } from "axios";
import type { UseFormReturn } from "react-hook-form";


async function getAllAssignments(requestParams: PaginatedRequest = {}) {
    const { data } = await api.get<PaginatedResponse<ReviewAssignment>>('/reviews/assignments/', {
        params: {
            page: requestParams.page,
            limit: requestParams.itemsPerPage,
            search: requestParams.search,
            ...filtersToQueryParams(requestParams.filters),
        }
    })
    return data
}


async function getAssignment(id: number) {
    const { data } = await api.get<ReviewAssignment>(`/reviews/assignments/${id}/`);
    return data;
}


async function createAssignment(data: AssignmentFormOutput): Promise<ReviewAssignment> {
    const { data: responseData } = await api.post('/reviews/assignments/', data);
    return responseData;
}


async function updateAssignment(data: AssignmentFormOutput): Promise<ReviewAssignment> {
    const { data: responseData } = await api.patch(`/reviews/assignments/${data.id}/`, data);
    return responseData;
}


async function deleteAssignment(id: number) {
    await api.delete(`/reviews/assignments/${id}/`);
}

// Mapea errores de los campos al form de RHF
function mapAssignmentErrors(error: AxiosError<any, any>, form: UseFormReturn<AssignmentFormInput, AssignmentFormOutput>) {
    mapErrors<AssignmentFormInput>({ errors: error.response.data }, (field, errors) => {
        (errors.length > 0) && notify.destructive('Something went wrong!', { description: errors });
        form.setError(field, {
            message: Array.isArray(errors) ? errors.join('. ') : errors,
            type: 'server'
        });
    });
}

// Truncar títulos largos
function getTruncatedTitle(htmlTitle: string) {
    const doc = new DOMParser().parseFromString(htmlTitle, "text/html");
    const title = doc.body.textContent ?? "";

    if (title.length <= 37) {
        return title;
    }

    // Truncar si se pasa de 37, es decir, el título truncado
    // nunca pasa de 50 chars incluyendo la elipsis ...
    const maxIndex = Math.min(title.length, 37);
    const truncated = title.slice(0, maxIndex);
    return `${truncated.trim()}...`;
}

function notifyAssignmentCreated(assignment: ReviewAssignment) {
    const title = getTruncatedTitle(assignment.abstract.title)
    notify.success('Review Assignment created!', {
        className: 'md:w-110 md:max-w-110',
        description: (
            <span>
                The submission{" "}
                <span className='font-medium'>"{title}"</span>{" "}
                was successfully assigned to{" "}
                <span className='font-medium'>{assignment.user.full_name}</span>.
            </span>
        ),
    })
}

function notifyAssignmentUpdated(assignment: ReviewAssignment) {
    const title = getTruncatedTitle(assignment.abstract.title)
    notify.success('Review Assignment updated!', {
        className: 'md:w-110 md:max-w-110',
        description: (
            <span>
                The submission{" "}
                <span className='font-medium'>"{title}"</span>{" "}
                assigned to{" "}
                <span className='font-medium'>{assignment.user.full_name}</span>{" "}
                was successfully updated.
            </span>
        ),
    })
}

function notifyAssignmentDeleted(assignment: ReviewAssignment) {
    const title = getTruncatedTitle(assignment.abstract.title)
    notify.warning('Submission discarded succesfully!', {
        description: (
            <p>
                The submission{" "}
                <span className='font-medium'>"{title}"</span>{" "}
                is no longer assigned to{" "}
                <span className='font-medium'>{assignment.user.full_name}</span>.
            </p>
        )
    })
}

export {
    getAssignment,
    getAllAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    mapAssignmentErrors,
    notifyAssignmentCreated,
    notifyAssignmentUpdated,
    notifyAssignmentDeleted,
}