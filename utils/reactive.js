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
let oldQuery;
export function HookRouter(params, router) {
    let defaultParams = JSON.parse(JSON.stringify(params));
    let isUpdatingFromPush = false;

    if (defaultParams) {
        updateParamsFromHash(params, defaultParams, router);
        router.afterEach((to, from) => {
            if (!isUpdatingFromPush) {
                updateParamsFromHash(params, defaultParams, router);
            }
            isUpdatingFromPush = false;
        });
    } 

    const watchers = Object.keys(params || {}).reduce((watchers, key) => {
        if (!key.startsWith('_')) return watchers;
        watchers[key] = function (newValue, oldValue) {
            const query = { ...router.currentRoute.value.query, ...oldQuery, [key]: JSON.stringify(newValue) };
            oldQuery = query;
            clearTimeout(globalThis.updateQueryTimeout);
            
            globalThis.updateQueryTimeout = setTimeout(() => {
                isUpdatingFromPush = true;
                router.push({ query });
            }, 1500);
        };

        return watchers;
    }, {});

    Object.keys(watchers).forEach(key => {
        watch(() => params[key], watchers[key], { deep: true/*, flush: 'sync' */ });
    });
}

const updateParamsFromHash = (params, defaultParams, router) => {
    const hashParams = new URLSearchParams(router.currentRoute.value.query);
    for (let key in params) {
        if (!key.startsWith('_')) continue;
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
