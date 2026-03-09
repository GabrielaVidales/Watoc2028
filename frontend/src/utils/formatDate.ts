export const formatDate = (
    dateStr: string | Date,
    options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    },
    locale: string = 'en-US'
) => {

    let data: Date
    if (typeof dateStr === 'string') {
        data = new Date(dateStr)
    } else {
        data = dateStr
    }

    return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...options
    }).format(data);
};

