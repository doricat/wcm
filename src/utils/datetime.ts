import dayjs from "dayjs";

export function toYYYYMMDDHHmmss(date: Date | null | undefined) {
    return date ? dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ') : null;
}