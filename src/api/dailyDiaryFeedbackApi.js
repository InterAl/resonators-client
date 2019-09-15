import fetcher from './fetcher';

export function sendDiaryAnswer({ resonatorId, updateRow, updateCol, answerId }) {
    return fetcher.post(`/diary/stats/reminders/${resonatorId}/diary/submit`, {
        row_id: updateRow,
        cell_id: updateCol,
        answer: answerId
    });
}
