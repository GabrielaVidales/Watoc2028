import api from "@/clients/api";
import { notify } from "@/components/custom/notify";
import type { ReviewAssignment } from "@/domain/reviews";
import type { AssignmentFormOutput } from "@/schemas/reviews/review-assignment-schema";


async function createAssignment(data: AssignmentFormOutput): Promise<ReviewAssignment> {
    const { data: responseData } = await api.post('/reviews/assignments/', data);
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
                <span className='font-medium'>{assignment.user.full_name}</span>
            </span>
        ),
    })
}

export {
    createAssignment,
    notifyAssignmentCreated
};

