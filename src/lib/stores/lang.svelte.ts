// Shared language state; mutate .value instead of reassigning the export
export const lang = $state<{ value: 'id' | 'en' }>({ value: 'id' });
