import fetcher from './fetcher';

export function sendAnswer({resonatorId, questionId, answerId, sentResonatorId}) {
    return fetcher.post(`/criteria/stats/reminders/${resonatorId}/criteria/submit`, {
        question_id: questionId,
        answer_id: answerId,
        sent_resonator_id: sentResonatorId
    });
}
