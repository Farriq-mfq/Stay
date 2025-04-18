import { features } from '@/utils/pegawai-feature';
import { isArray } from "lodash";
import { inject } from "vue";

export async function groupMiddleware(to) {
    const toName = to.name
    const feature = features.find(feature => feature.route === toName)
    const auth = inject('auth')

    if (feature && !(feature.group && isArray(feature.group) && feature.group.length > 0 && feature.group.includes(auth.user().group))) {
        return {
            name: 'unavailable'
        }
    }
}