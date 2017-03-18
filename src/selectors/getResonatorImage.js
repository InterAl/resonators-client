import _ from 'lodash';

export default resonator => {
    if (!resonator) return null;

    let lastPicture = _(resonator.items)
        .filter(i => i.media_kind === 'picture')
        .sortBy(i => new Date(i.created_at))
        .last();

    if (lastPicture) {
        if (lastPicture.link)
            return lastPicture.link;
        else
            return `https://reminders-uploads.s3.amazonaws.com/${lastPicture.media_id}.jpg`;
    } else
        return null;
}
