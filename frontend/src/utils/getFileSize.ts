

export const getFileSize = (file: File | number) => {
    let i = 0;
    let size = file instanceof File ? file.size : file;
    while (size > 900) {
        size /= 1024;
        i++;
    }
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const exactSize = (Math.round(size * 100) / 100) + ' ' + units[i];
    return exactSize;
};
