import { isArray, isEqual } from "lodash";
import { features } from '@/utils/pegawai-feature'
import { inject } from "vue";

export async function groupMiddleware(to) {
    const feature = features.find(feature => feature.route === to.name)
    const auth = inject('auth')
    if (feature && !(feature.group && isArray(feature.group) && feature.group.length > 0 && feature.group.includes(auth.user().group))) {
        return {
            name: 'unavailable'
        }
    }
}