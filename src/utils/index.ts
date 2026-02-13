import dayjs from "dayjs";

export function generateTaskCode() {
    return `T${dayjs(new Date()).format('YYYYMMDDHHmmss')}`;
}

export function generateLabelCode() {
    return `L${dayjs(new Date()).format('YYYYMMDDHHmmss')}`;
}

export function generateBatchNo() {
    return dayjs(new Date()).format('YYMMDD');
}

export function getDisplayName(code: string, name: string | null | undefined) {
    return name ? `${code}: ${name}` : code;
}