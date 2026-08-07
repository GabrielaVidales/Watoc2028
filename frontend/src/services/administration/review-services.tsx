import api from "@/clients/api";
import { notify } from "@/components/custom/notify";
import type { PaginatedRequest, PaginatedResponse } from "@/domain/pagination";
import type { ReviewAssignment } from "@/domain/reviews";
import type { AssignmentFormOutput } from "@/schemas/reviews/review-assignment-schema";
import { filtersToQueryParams } from "@/utils/filter-operations";

async function getAllAssignments(requestData: PaginatedRequest = {}) {
    const { data } = await api.get<PaginatedResponse<ReviewAssignment>>('/reviews/assignments/', {
        params: {
            page: requestData.page,
            limit: requestData.itemsPerPage,
            search: requestData.search,
            ...filtersToQueryParams(requestData.filters),
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



// Truncar títulos largos
const getTruncatedTitle = (htmlTitle: string) => {
    const doc = new DOMParser().parseFromString(htmlTitle, "text/html");
    const title = doc.body.textContent ?? "";

    if (title.length <= 37) {
        return title
    }

    // Truncar si se pasa de 37, es decir, el título truncado
    // nunca pasa de 50 chars incluyendo la elipsis ...
    const maxIndex = Math.min(title.length, 37)
    const truncated = title.slice(0, maxIndex)
    return `${truncated.trim()}...`
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

export {
    getAssignment,
    getAllAssignments,
    createAssignment,
    updateAssignment,
    notifyAssignmentCreated,
    notifyAssignmentUpdated,
};

