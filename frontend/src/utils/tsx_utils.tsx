export const renderHTMLString = (escapedStr: string) => {
    try {
        const parser = new DOMParser();
        const decoded = parser.parseFromString(escapedStr, 'text/html').body.textContent || "";
        return <div dangerouslySetInnerHTML={{ __html: decoded }} className="" />;
    } catch (e) {
        return <div dangerouslySetInnerHTML={{ __html: escapedStr }} className="inline-block" />;
    }
};