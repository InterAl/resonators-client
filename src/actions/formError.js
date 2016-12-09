export default function(form) {
    return {
        type: '@@redux-form/SET_SUBMIT_FAILED',
        error: true,
        meta: {
            form,
            fields: []
        }
    };
}
