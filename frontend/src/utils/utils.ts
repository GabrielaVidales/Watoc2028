

export function timeAgo(timestamp: number): string {
    const diff = Math.floor((Date.now() - timestamp) / 1000);

    if (diff < 60)
        return "Just now";

    if (diff < 3600) {
        const m = Math.floor(diff / 60);
        return `${m} minute${m !== 1 ? "s" : ""} ago`;
    }

    if (diff < 86400) {
        const h = Math.floor(diff / 3600);
        return `${h} hour${h !== 1 ? "s" : ""} ago`;
    }

    if (diff < 604800) {
        const d = Math.floor(diff / 86400);
        return `${d} day${d !== 1 ? "s" : ""} ago`;
    }

    if (diff < 2592000) {
        const w = Math.floor(diff / 604800);
        return `${w} week${w !== 1 ? "s" : ""} ago`;
    }

    if (diff < 31536000) {
        const mo = Math.floor(diff / 2592000);
        return `${mo} month${mo !== 1 ? "s" : ""} ago`;
    }

    const y = Math.floor(diff / 31536000);
    return `${y} year${y !== 1 ? "s" : ""} ago`;
}