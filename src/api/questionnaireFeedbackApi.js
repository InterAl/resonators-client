import fetcher from './fetcher';

export function sendQuestionnaireAnswer({resonatorId, updateRow, answerId}) {
    return fetcher.post(`/questionnaire/stats/reminders/${resonatorId}/questionnaire/submit`, {
        question_id: updateRow,
        answer: answerId
    });
}
