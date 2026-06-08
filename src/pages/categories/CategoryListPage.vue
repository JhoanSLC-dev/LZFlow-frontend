<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="heading">Categories</h1>
                <p class="subheading mt-1">Organize your products</p>
            </div>
            <button @click="openCreate" class="btn-primary">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                New Category
            </button>
        </div>

        <DataTable :columns="columns" :data="categoryStore.categories as unknown as Record<string, unknown>[]">
            <template #cell-description="{ row }">
                <span class="text-dark-400">{{ row.description || '—' }}</span>
            </template>
            <template #actions="{ row }">
                <button @click="openEdit(row)"
                    class="text-lz-400 hover:text-lz-300 text-sm mr-3 font-medium">Edit</button>
                <button @click="confirmDelete(row.id as string)"
                    class="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
            </template>
        </DataTable>

        <Modal v-model="showModal" :title="editing ? 'Edit Category' : 'New Category'">
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <FormField name="name" label="Name" v-model="form.name" :error="errors.name" />
                <FormField name="description" label="Description" type="textarea" v-model="form.description" />
                <div class="flex justify-end gap-3">
                    <button type="button" @click="showModal = false" class="btn-secondary">Cancel</button>
                    <button type="submit" :disabled="saving" class="btn-primary">{{ saving ? 'Saving...' : 'Save'
                        }}</button>
                </div>
            </form>
            <p v-if="apiError" class="text-sm text-red-400 mt-3 text-center">{{ apiError }}</p>
        </Modal>

        <Modal v-model="showDeleteModal" title="Delete Category">
            <p class="text-dark-400">Are you sure? This will affect products in this category.</p>
            <template #actions>
                <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
                <button @click="deleteCategory" class="btn-danger">Delete</button>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useCategoryStore } from '../../stores/category.store';
import DataTable from '../../components/ui/DataTable.vue';
import Modal from '../../components/ui/Modal.vue';
import FormField from '../../components/ui/FormField.vue';
import type { Category } from '../../types';

const categoryStore = useCategoryStore();
const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Category | null>(null);
const saving = ref(false);
const apiError = ref('');
const deleteTarget = ref('');
const form = reactive({ name: '', description: '' });
const errors = reactive({ name: '', description: '' });
const columns = [{ key: 'name', label: 'Name' }, { key: 'description', label: 'Description' }];

function openCreate() { editing.value = null; form.name = ''; form.description = ''; showModal.value = true; }
function openEdit(category: unknown) {
    const cat = category as Category; editing.value = cat;
    form.name = cat.name; form.description = cat.description || ''; showModal.value = true;
}
async function handleSubmit() {
    apiError.value = ''; errors.name = '';
    if (!form.name) { errors.name = 'Required'; return; }
    saving.value = true;
    try {
        if (editing.value) { await categoryStore.update(editing.value.id, { name: form.name, description: form.description || null }); }
        else { await categoryStore.create({ name: form.name, description: form.description || null }); }
        showModal.value = false;
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        apiError.value = error?.response?.data?.error || 'Save failed';
    } finally { saving.value = false; }
}
function confirmDelete(id: string) { deleteTarget.value = id; showDeleteModal.value = true; }
async function deleteCategory() { await categoryStore.remove(deleteTarget.value); showDeleteModal.value = false; }
onMounted(() => categoryStore.fetchAll());
</script>
