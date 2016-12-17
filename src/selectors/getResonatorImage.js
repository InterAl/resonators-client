import _ from 'lodash';

export default resonator => {
    if (!resonator) return null;

    let lastPicture = _(resonator.items)
        .filter(i => i.media_kind === 'picture')
        .sortBy(i => new Date(i.created_at))
        .last();

    return lastPicture ? `https://reminders-uploads.s3.amazonaws.com/${lastPicture.media_id}.jpg` :
                         null;
}
