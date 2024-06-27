import { reactive,watch } from 'vue';
import { useRouter } from 'vue-router';
import { useState } from 'nuxt/app'
import { useRuntimeConfig } from 'nuxt/app'

export function useReactive(key, items) {


    if (useRuntimeConfig().public.ssr === "true") {
        items = useState(key, () => items).value;
    } else {
        items = reactive(items);
    }

    globalThis[key] = items;
    return items;
}
export function HookRouter(params) {
    let defaultParams = JSON.parse(JSON.stringify(params));
    let isUpdatingFromPush = false;

    if (defaultParams) {
        const router = useRouter();
        updateParamsFromHash(params, defaultParams);
        router.afterEach((to, from) => {
            if (!isUpdatingFromPush) {
                updateParamsFromHash(params, defaultParams);
            }
            isUpdatingFromPush = false;
        });
    }

    const watchers = Object.keys(params || {}).reduce((watchers, key) => {
        if (!key.startsWith('_')) return watchers;
        const router = useRouter();
        watchers[key] = function (newValue, oldValue) {
            const query = { ...router.currentRoute.value.query, [key]: JSON.stringify(newValue) };
            clearTimeout(globalThis.updateQueryTimeout);
            
            globalThis.updateQueryTimeout = setTimeout(() => {
                isUpdatingFromPush = true;
                router.push({ query });
            }, 1500);
        };

        return watchers;
    }, {});

    Object.keys(watchers).forEach(key => {
        watch(() => params[key], watchers[key], { deep: true, flush: 'sync' });
    });
}

const updateParamsFromHash = (params, defaultParams) => {
    const router = useRouter();
    const hashParams = new URLSearchParams(router.currentRoute.value.query);
    for (let key in params) {
        if (hashParams.has(key)) {
            try {
                const newValue = JSON.parse(hashParams.get(key));
               // if (JSON.stringify(params[key]) !== JSON.stringify(newValue)) 
                    params[key] = newValue;
                
            } catch (e) {
                //if (JSON.stringify(params[key]) !== JSON.stringify(hashParams.get(key))) 
                    params[key] = hashParams.get(key);
                
            }
        } else if (params[key] !== defaultParams[key]) {
            params[key] = defaultParams[key];
        }
    }
};
