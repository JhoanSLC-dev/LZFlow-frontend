<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="heading">{{ t('categories.title') }}</h1>
                <p class="subheading mt-1">{{ t('header.organizeProducts') }}</p>
            </div>
            <button @click="openCreate" class="btn-primary">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ t('categories.new') }}
            </button>
        </div>

        <DataTable :columns="columns" :data="categoryStore.categories as unknown as Record<string, unknown>[]">
            <template #cell-description="{ row }">
                <span class="text-dark-400">{{ row.description || '—' }}</span>
            </template>
            <template #actions="{ row }">
                <button @click="openEdit(row)"
                    class="text-lz-400 hover:text-lz-300 text-sm mr-3 font-medium">{{ t('common.edit') }}</button>
                <button @click="confirmDelete(row.id as string)"
                    class="text-red-400 hover:text-red-300 text-sm font-medium">{{ t('common.delete') }}</button>
            </template>
        </DataTable>

        <Modal v-model="showModal" :title="editing ? t('categories.editTitle') : t('categories.newTitle')">
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <FormField name="name" :label="t('common.name')" v-model="form.name" :error="errors.name" />
                <FormField name="description" :label="t('common.description')" type="textarea" v-model="form.description" />
                <div class="flex justify-end gap-3">
                    <button type="button" @click="showModal = false" class="btn-secondary">{{ t('common.cancel') }}</button>
                    <button type="submit" :disabled="saving" class="btn-primary">{{ saving ? t('common.saving') : t('common.save')
                        }}</button>
                </div>
            </form>
            <p v-if="apiError" class="text-sm text-red-400 mt-3 text-center">{{ apiError }}</p>
        </Modal>

        <Modal v-model="showDeleteModal" :title="t('categories.deleteTitle')">
            <p class="text-dark-400">{{ t('categories.deleteConfirm') }}</p>
            <template #actions>
                <button @click="showDeleteModal = false" class="btn-secondary">{{ t('common.cancel') }}</button>
                <button @click="deleteCategory" class="btn-danger">{{ t('common.delete') }}</button>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useCategoryStore } from '../../stores/category.store';
import { useLocaleStore } from '../../stores/locale.store';
import DataTable from '../../components/ui/DataTable.vue';
import Modal from '../../components/ui/Modal.vue';
import FormField from '../../components/ui/FormField.vue';
import type { Category } from '../../types';

const { t } = useLocaleStore();

const categoryStore = useCategoryStore();
const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Category | null>(null);
const saving = ref(false);
const apiError = ref('');
const deleteTarget = ref('');
const form = reactive({ name: '', description: '' });
const errors = reactive({ name: '', description: '' });
const columns = computed(() => [{ key: 'name', label: t('common.name') }, { key: 'description', label: t('common.description') }]);

function openCreate() { editing.value = null; form.name = ''; form.description = ''; showModal.value = true; }
function openEdit(category: unknown) {
    const cat = category as Category; editing.value = cat;
    form.name = cat.name; form.description = cat.description || ''; showModal.value = true;
}
async function handleSubmit() {
    apiError.value = ''; errors.name = '';
    if (!form.name) { errors.name = t('categories.validationRequired'); return; }
    saving.value = true;
    try {
        if (editing.value) { await categoryStore.update(editing.value.id, { name: form.name, description: form.description || null }); }
        else { await categoryStore.create({ name: form.name, description: form.description || null }); }
        showModal.value = false;
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        apiError.value = error?.response?.data?.error || t('common.saveFailed');
    } finally { saving.value = false; }
}
function confirmDelete(id: string) { deleteTarget.value = id; showDeleteModal.value = true; }
async function deleteCategory() { await categoryStore.remove(deleteTarget.value); showDeleteModal.value = false; }
onMounted(() => categoryStore.fetchAll());
</script>
